import mongoose, { Schema } from "mongoose"

const reservationSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: new Date() },
  courtId: { type: Schema.Types.ObjectId, ref: 'Court' },
  time: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class' },
  date: { type: String, required: true },
  reserverId: { type: Schema.Types.ObjectId, ref: 'People' },
  active: { type: Boolean, required: true, default: true },
  tenantId: { type: String, default: "1" }
});
  
  export const Reservation = mongoose.model('Reservation', reservationSchema);