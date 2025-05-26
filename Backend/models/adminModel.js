import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    role: { type: String, default: "admin", required: true },
    adminId: { type: String, required: true },
    name: { type: String, required: true },
    PoliceStation:{type: String, required:true},
    email: { type: String, required:true },
    password: { type: String, required: true },
    image: { type: String ,default:""},
    code: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], required: true }
}, { minimize: false });

const adminModel = mongoose.models.admin || mongoose.model('admin', adminSchema);

export default adminModel;
