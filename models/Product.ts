import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
  },
  purchasePrice: {
    type: Number,
    min: [0, "El precio de compra no puede ser negativo"],
    required: [true, "El precio de compra es obligatorio"],
  },
  salePrice: {
    type: Number,
    min: [0, "El precio de venta no puede ser negativo"],
    required: [true, "El precio de venta es obligatorio"],
  },
  category: {
    type: String,
    trim: true,
  },
  currency: {
    type: String,
  }
});

const Product = mongoose.models.Product || model('Product', productSchema);
export default Product;
