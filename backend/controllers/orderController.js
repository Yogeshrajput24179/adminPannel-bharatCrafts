import Order from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Place Order with Stripe Checkout
export const placeOrder = async (req, res) => {
  const frontend_url = req.headers.origin || "http://localhost:5173";

  try {
    console.log("📦 Incoming Order Request:", JSON.stringify(req.body, null, 2));

    const { userId, items, deliveryAddress, totalAmount } = req.body;

    // ✅ Validation
    if (!userId || !items || items.length === 0 || !deliveryAddress || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Save Order in DB
    const newOrder = new Order({
      userId,
      items,
      deliveryAddress,
      totalAmount,
      status: "Pending",
    });

    await newOrder.save();

    // ✅ Clear user's cart (optional)
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // ✅ Stripe Format Items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        unit_amount: Math.round(item.price * 100), // convert ₹ to paise
        product_data: {
          name: item.name || "Unnamed Product",
          description: item.description || "No description",
        },
      },
      quantity: item.quantity,
    }));

    // ✅ Add Fixed Shipping Fee
    line_items.push({
      price_data: {
        currency: "inr",
        unit_amount: 20000, // ₹200
        product_data: {
          name: "Shipping Fee",
          description: "Standard delivery",
        },
      },
      quantity: 1,
    });

    console.log("🧾 Stripe Line Items:", JSON.stringify(line_items, null, 2));

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    if (!session || !session.url) {
      return res.status(500).json({
        success: false,
        message: "Failed to create Stripe session",
      });
    }

    // ✅ Send Stripe session URL to frontend
    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
      session_url: session.url,
    });

  } catch (error) {
    console.error("❌ Error placing order:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// ✅ Admin: List all Orders
export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email"); // Optional: Include user details
    res.json({ success: true, orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};
