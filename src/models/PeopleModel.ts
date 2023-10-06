import mongoose, { Schema } from "mongoose"

const peopleSchema = new mongoose.Schema({
    createdAt: { type: Date, required: true, default: new Date() },
    nome: { type: String, required: true },
    email: { type: String, required: true },
    dtNascimento: { type: String, required: false },
    genero: { type: String, required: false },
    nacionalidade: { type: String, required: false },
    cpf: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, required: false },
    sports: { type: [String], required: true },
    levels: { type: [{ sport: String, levelNumber: Number }] , required: false },
    tipo: { type: String, required: true, default: 'Aluno' },
    id: { type: Schema.Types.ObjectId },
    instagram: { type: String, required: false },
    tenantId: { type: String, default: "1" }
  });
  
  export const People = mongoose.model('People', peopleSchema);