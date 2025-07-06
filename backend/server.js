import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import productModel from "./models/productModel.js";
import cartModel from "./models/cartModel.js";
import Order from "./models/orderModel.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import authMiddleware from "./middleware/auth.js";

dotenv.config();

// Fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App config
const app = express();
const port = process.env.PORT || 8282;

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));


// Database Connection
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Serve Static Images (Ensure `uploads` folder exists)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/products", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Fetch Product List API
app.get("/api/products/list", async (req, res) => {
  try {
    const products = await productModel.find().lean();
    const updatedProducts = products.map((product) => ({
      id: product._id.toString(), // Convert `_id` to string
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image ? `http://localhost:${port}/uploads/${product.image}` : null,
    }));

    res.json({ success: true, data: updatedProducts });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Fetch Cart API
app.get("/api/cart", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // from JWT decoded token
    const cart = await cartModel.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.json({ success: true, cart });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Place Order API (Protected Route)


// Start Server After MongoDB Connects
app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});
