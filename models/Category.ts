import { modelNames, models } from "mongoose";
import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    unique: true,
  },
});

const Category = modelNames().includes("Category")
  ? models.Category
  : model("Category", categorySchema);
export default Category;
