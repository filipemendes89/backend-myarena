import mongoose from "mongoose"

const classSchema = new mongoose.Schema({
    createdAt: { type: Date, required: true, default: new Date() },
    sport: { type: String, required: true },
    date: { type: String, required: true },
    courtId: { type: String, required: true },
    teacherId: { type: String, required: true },
    time: { type: String, required: true },
    people: { type: Number, required: true },
    level: { type: String, required: true },
    peopleList: { type: [{ id: String, nome: String }], required: false },
    court: { type: String, required: true },
    tenantId: { type: String, default: "1" }
  })
  
  export const Class = mongoose.model('Class', classSchema);