import mongoose, { Schema, model } from "mongoose";

const client = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  dni: {
    type: String,
    unique: true,
  },
  factura: {
    type: Array,
  },
  rooms: Array,
  status: {
    type: String,
    enum: ["activo", "inactivo"],
  },
});

const Client = mongoose.models.Client || model("Client", client);
export default Client;
