import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
   
    Id: { type: String, required: true },
    message:{type:String, required:true},
    reply:{type:String, required:true},
    driverLisence:{type:String, requried:true},
    adminId: { type: String, required: true }
}, { minimize: false })

const feedbackModel = mongoose.models.feedback || mongoose.model('feedback', feedbackSchema)

export default feedbackModel;

