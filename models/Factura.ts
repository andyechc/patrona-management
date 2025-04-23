import mongoose, { Schema, model } from "mongoose";

const factura = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  factura: {
    type: Array,
  },
  date: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
});

const Factura = mongoose.models.Factura || model("Factura", factura);
export default Factura;
