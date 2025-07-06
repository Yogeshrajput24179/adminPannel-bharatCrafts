import express from "express";
import Order from "../models/orderModel.js";
import authMiddleware from "../middleware/auth.js";
import { listOrders } from "../controllers/orderController.js";

const router = express.Router();

// 🔐 Get all orders of the logged-in user
router.post("/userOrders", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 Fetching user orders for:", req.user.id);

    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.productId"); // Populate product details in items

    console.log("📦 Orders found:", orders.length);

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 📩 Place a new order (authenticated)
router.post("/place", authMiddleware, async (req, res) => {
  try {
    console.log("🛡️ User from middleware:", req.user);
    console.log("📦 Order details:", req.body);

    const userId = req.user.id;
    const { items, deliveryAddress, totalAmount } = req.body;

    if (!items || !items.length || !deliveryAddress || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing fields: items, deliveryAddress, or totalAmount",
      });
    }

    const newOrder = new Order({
      userId,
      items,
      deliveryAddress,
      totalAmount,
      status: "Pending",
    });

    await newOrder.save();
    console.log("🎉 Order placed:", newOrder);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error placing order:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 📝 Update order status (admin or authorized user)
router.patch("/updateStatus/:orderId", async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Status updated", order: updatedOrder });
  } catch (error) {
    console.error("❌ Error updating order status:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔎 List all orders (maybe for admin) from controller
router.get("/list", listOrders);

export default router;
