import mongoose from "mongoose";

const fineSchema = new mongoose.Schema({
    fineId:{type:String, required:true},
    provisionId:{type:String, required:true},
    provision:{type:String, required:true},
    fineAmount:{type:String, required:true},

},{minimize:false})

const fineModel  = mongoose.models.fine || mongoose.model('fine', fineSchema)

export default fineModel;
