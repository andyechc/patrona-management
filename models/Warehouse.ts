import { Schema, model, modelNames, models } from "mongoose";

const warehouseSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    unique: true,
  },
  price: {
    type: Number,
    min: [0, "El precio no puede ser negativo"],
    required: [true, "El precio es obligatorio"],
  },
  category: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
  },
  total: {
    type: Number
  }
});

const Warehouse = modelNames().includes("Warehouse")
  ? models.Warehouse
  : model("Warehouse", warehouseSchema);
export default Warehouse;
