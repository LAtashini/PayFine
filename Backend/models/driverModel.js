import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    role: { type: String, default: "driver", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, required: false },  
    Address: { type: Object, required: true },  
    LicenseNumber: { type: String, required: true },
    LicenseIssedDate: { type: String, required: true },
    LicenseExpiredDate: { type: String, required: true },
    IDNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true }
}, { minimize: false });

const driverModel = mongoose.models.driver || mongoose.model('driver', driverSchema);

export default driverModel;
