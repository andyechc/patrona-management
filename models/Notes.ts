import mongoose, { Schema, model } from "mongoose";

const notes = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Notes = mongoose.models.Notes || model("Notes", notes);
export default Notes;
