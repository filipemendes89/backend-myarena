import mongoose from "mongoose"

const sportSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: new Date() },
  name: { type: String, required: true },
  hasClass: { type: Boolean, required: false, default: false },
});

export const Sport = mongoose.model('Sport', sportSchema);
