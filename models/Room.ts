import mongoose, { Schema, model } from "mongoose";

const roomSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
  },
  inventary: [
    {
      name: String,
      stock: Number,
    }
  ],
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      stock: Number
    }
  ]
});

const Room = mongoose.models.Room || model('Room', roomSchema);
export default Room;
