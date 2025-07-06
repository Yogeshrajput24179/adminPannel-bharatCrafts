import express from "express";
import mongoose from "mongoose";
import authMiddleware from "../middleware/auth.js";
import Cart from "../models/cartModel.js";

const router = express.Router();

// Add item to cart
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");

    res.json({ success: true, message: "Item added to cart", cart: updatedCart });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Remove item from cart
router.post("/remove", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();

      const updatedCart = await Cart.findOne({ userId }).populate("items.productId");
      return res.json({ success: true, message: "Item updated in cart", cart: updatedCart });
    } else {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("❌ Error removing item from cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
