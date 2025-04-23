import mongoose, { Schema, model } from "mongoose";

const dailyLog = new Schema({
  type: {
    type: String,
    enum: ["gains", "losses", "warn", "info"],
  },
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

const DailyLog = mongoose.models.DailyLog || model("DailyLog", dailyLog);
export default DailyLog;
