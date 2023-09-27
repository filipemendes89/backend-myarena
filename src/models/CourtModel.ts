import mongoose from "mongoose"

const courtSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: new Date() },
  name: { type: String, required: true },
  avatar: { type: String, required: false },
  type: { type: String, required: true },
  sports: { type: [String], required: true },
  active: { type: Boolean, required: true },
  calendar: { type: String, required: true },
  tenantId: { type: String, default: "1" }
});

export const Court = mongoose.model('Court', courtSchema);
