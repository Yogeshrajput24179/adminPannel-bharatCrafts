import React, { useEffect, useState } from "react";
import "./Add.css";
import { assets } from "../../assets/admin_assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const url = "https://adminpannel-bharatcrafts.onrender.com";

const Add = () => {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Painting",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage); // prevent memory leaks
      }
    };
  }, [previewImage]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("📸 Please upload an image!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("category", data.category);
      formData.append("image", image);

      const res = await axios.post(`${url}/api/products/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("✅ Product added successfully!");
        setData({
          name: "",
          description: "",
          price: "",
          category: "Painting",
        });
        setImage(null);
        setPreviewImage(null);
      } else {
        toast.error("❌ Failed to add product");
      }
    } catch (err) {
      console.error("❌ Error adding product:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        {/* Image Upload */}
        <div className="add-img-upload flex col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={previewImage || assets.upload_area} alt="Preview" />
          </label>
          <input
            onChange={onImageChange}
            type="file"
            id="image"
            accept="image/*"
            hidden
            required
          />
        </div>

        {/* Product Name */}
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Type here"
            required
          />
        </div>

        {/* Description */}
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write content here"
            required
          />
        </div>

        {/* Category and Price */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
              required
            >
              <option value="Painting">Painting</option>
              <option value="Furniture">Furniture</option>
              <option value="Jewellery">Jewellery</option>
              <option value="Bamboo & Jute">Bamboo & Jute</option>
              <option value="Pottery">Pottery</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              min="0"
              placeholder="₹20"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
