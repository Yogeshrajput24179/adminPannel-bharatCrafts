import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import authMiddleware from "./middleware/auth.js";
import ProductModel from "./models/ProductModel.js"; // ✅ Fix: Import model directly

dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8282;

// Use BASE_URL for image URLs, fallback to localhost
const baseURL = process.env.BASE_URL || `http://localhost:${port}`;

// Middleware
app.use(express.json());

// CORS setup with whitelist
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://adminpannel-bharatcrafts.onrender.com",
  "https://yogeshrajput24179.github.io",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow Postman or server-to-server
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Serve static files (uploads/images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ FIXED: Product list API with image URL
app.get("/api/products/list", async (req, res) => {
  try {
    const products = await ProductModel.find().lean();
    const updatedProducts = products.map((product) => ({
      id: product._id.toString(),
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image ? `${baseURL}/uploads/${product.image}` : null,
    }));

    res.json({ success: true, data: updatedProducts });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on ${baseURL}`);
});
