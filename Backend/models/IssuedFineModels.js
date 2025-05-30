import mongoose from "mongoose";

const issuedfineSchema = new mongoose.Schema({
    referenceNo: { type: String, required: true },
    policeId: { type: mongoose.Schema.Types.ObjectId, ref: "police", required: true },
    licenseId: { type: String, required: true },
    driverName: { type: String },              
    address: { type: String },                  
    vehicleClass: { type: String },             
    nic: { type: String },                      
    officerName: { type: String },              
    place: { type: String },                    
    vehicleNo: { type: String, required: true },
    issuedDate: { type: Date, required: true },
    issuedTime: { type: String, required: true },
    expiredDate: { type: Date },
    expiredTime: { type: String },
    court: { type: String },
    courtDate: { type: Date },
    provision: { type: String },                
    amount: { type: Number },                   
    additionalProvisions: [                     
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
