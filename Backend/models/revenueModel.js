import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema({
    vehicleNo: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    referenceNo: { type: String, required: true },
    vehicleType: { type: String, required: true },
    fuelType: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerAddress: { type: String, required: true },
    issuedDate: { type: Date, required: true },
    expiredDate: { type: Date, required: true }
}, { minimize: false });

const revenueModel = mongoose.models.revenue || mongoose.model("revenue", revenueSchema);

export default revenueModel;
