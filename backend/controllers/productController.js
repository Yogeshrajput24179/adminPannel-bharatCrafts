import ProductModel from "../models/productModel.js";

// ✅ Add Product
const addProduct = async (req, res) => {
  try {
    // ✅ Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const image_filename = req.file.filename;

    const product = new ProductModel({
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price), // ensure it's stored as number
      category: req.body.category,
      image: image_filename
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "✅ Product added successfully!",
      product
    });

  } catch (error) {
    console.error("❌ Error adding product:", error.message);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
};

// ✅ List All Products
const listProduct = async (req, res) => {
  try {
    const products = await ProductModel.find().lean();

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    res.json({ success: true, data: products });

  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

// ✅ Remove Product by ID
const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "✅ Product removed successfully" });

  } catch (error) {
    console.error("❌ Error removing product:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { addProduct, listProduct, removeProduct };
