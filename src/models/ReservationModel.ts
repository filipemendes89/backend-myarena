import mongoose from "mongoose"

const reservationSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: new Date() },
  courtId: { type: String, required: true },
  time: { type: String, required: true },
  classId: { type: String, required: true },
  date: { type: String, required: true },
  reserverId: { type: String, required: false },
  active: { type: Boolean, required: true },
  tenantId: { type: String, default: "1" }
});
  
  export const Reservation = mongoose.model('Reservation', reservationSchema);