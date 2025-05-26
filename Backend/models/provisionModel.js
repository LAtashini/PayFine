// models/provisionModel.js
import mongoose from "mongoose";

const provisionSchema = new mongoose.Schema({
    provisionId: { type: String, required: true, unique: true },
    sectionOfAct: { type: String, required: true },
    fineAmount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Provision", provisionSchema);
