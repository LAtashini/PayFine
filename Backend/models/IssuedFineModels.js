import mongoose from "mongoose";

const issuedfineSchema = new mongoose.Schema({
    referenceNo: { type: String, required: true },
    policeId: { type: mongoose.Schema.Types.ObjectId, ref: "police", required: true },
    licenseId: { type: String, required: true },
    driverName: { type: String },               // New field
    address: { type: String },                  // New field
    vehicleClass: { type: String },             // New field
    nic: { type: String },                      // New field
    officerName: { type: String },              // New field
    place: { type: String },                    // New field
    vehicleNo: { type: String, required: true },
    issuedDate: { type: Date, required: true },
    issuedTime: { type: String, required: true },
    expiredDate: { type: Date },
    expiredTime: { type: String },
    court: { type: String },
    courtDate: { type: Date },
    provision: { type: String },                // Changed from ObjectId to String (from frontend dropdown)
    amount: { type: Number },                   // New field: main provision amount
    additionalProvisions: [                     // New field: array of additional provisions
        {
            name: { type: String },
            amount: { type: Number }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'unpaid', 'notified'], default: 'unpaid' },
    paidDate: { type: Date },
    notified: { type: Boolean, default: false }
}, { minimize: false });

const issuedfineModels = mongoose.models.issuedfine || mongoose.model("issuedfine", issuedfineSchema);

export default issuedfineModels;
