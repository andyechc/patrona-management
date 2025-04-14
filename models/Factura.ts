import mongoose, { Schema, model } from "mongoose";

const factura = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  factura: {
    type: Array,
  },
  status: {
    type: String,
    enum: ["pendiente", "facturada"],
  },
});

const Factura = mongoose.models.Factura || model("Factura", factura);
export default Factura;
