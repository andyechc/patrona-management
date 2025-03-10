import { Schema, model, modelNames, models } from "mongoose";

const warehouseSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  stock: {
    type: Number,
    min: [0, "La cantidad no puede ser negativo"],
    required: true
  },
});

const Warehouse = modelNames().includes("Warehouse")
  ? models.Warehouse
  : model("Warehouse", warehouseSchema);
export default Warehouse;
