import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// ✅ Add to Cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    console.log("🛒 Add to cart | User:", userId, "| Product:", productId);

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required.",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");

    res.json({ success: true, message: "Item added to cart", cart: updatedCart });
  } catch (error) {
    console.error("❌ Error adding to cart:", error.message);
    res.status(500).json({ success: false, message: "Error adding to cart." });
  }
};

// ✅ Remove from Cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body; // Expecting productId in body for consistency

    console.log("🗑️ Remove from cart | User:", userId, "| Product:", productId);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");

    res.json({ success: true, message: "Item removed from cart", cart: updatedCart });
  } catch (error) {
    console.error("❌ Error removing item from cart:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("📦 Fetching cart for user:", userId);

    let cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
      select: "_id name price image", // Use _id if using it on frontend
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Filter out invalid entries
    cart.items = cart.items.filter((item) => item.productId);

    res.json({ success: true, cart });
  } catch (error) {
    console.error("❌ Error fetching cart:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addToCart, removeFromCart, getCart };
