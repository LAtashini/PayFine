// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    nic: { type: String, required: true },
    referenceNo: { type: String, required: true },
    provision: { type: String },  // Store provision name directly
    provisionAmount: { type: String },  // Store fine amount directly
    vehicleNumber: { type: String, required: true },
    issuedDate: { type: Date, required: true },
    courtDate: { type: Date },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Notification', notificationSchema);
