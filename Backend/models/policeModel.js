import mongoose from "mongoose";

const policeSchema = new mongoose.Schema({
    role: { type: String, default: "police", required: true },
    policeId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    registeredDate: { type: Date, required: true },
    code: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], required: true },
    station: { type: String, required: true },
    court: { type: String, required: true }
}, { minimize: false });

const policeModel = mongoose.models.police || mongoose.model('police', policeSchema);

export default policeModel;