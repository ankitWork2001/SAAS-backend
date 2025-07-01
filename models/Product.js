import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }, 
  imageUrl: { type: String }, 
  isAvailable: {type: Boolean, default: true},  // whether the plan is available for purchase or blocked by admin 
  features: [String],  
});

const Product = mongoose.model("Product", productSchema);
export default Product;
