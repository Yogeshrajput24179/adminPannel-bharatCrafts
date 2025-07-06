import express from "express";
import multer from "multer";
import { addProduct, listProduct, removeProduct } from "../controllers/productController.js";

const router = express.Router();

// 🔧 Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // ✅ Make sure this folder exists
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ Routes
router.post("/add", upload.single("image"), addProduct); // 🟢 Handles image + form data
router.get("/list", listProduct);
router.delete("/remove/:id", removeProduct);

export default router;
