import mongoose from "mongoose"

const timeSlotSchema = new mongoose.Schema({
    entryTime: { type: String, required: true },
    exitTime: { type: String, required: true },
  });
  
const calendarSchema = new mongoose.Schema({
   createdAt: { type: Date, required: true, default: new Date() },
   name: { type: String, required: true },
   times: { type: [timeSlotSchema], required: true },
});

export const Calendar = mongoose.model('Calendar', calendarSchema);