import mongoose, { Schema, model } from "mongoose";

const roomSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
  },
  inventary: {
    type: Array,
  },
  products: {
    type: Array
  }
});

const Room = mongoose.models.Room || model('Room', roomSchema);
export default Room;
