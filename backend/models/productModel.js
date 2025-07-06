import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
}, { 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ✅ Convert `_id` to `id`
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// ✅ Ensure `_id` is replaced with `id`
productSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id; // ✅ Add `id` field
        delete ret._id; // ❌ Remove `_id`
        delete ret.__v; // ❌ Remove Mongoose version field
    }
});

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);
export default ProductModel;
