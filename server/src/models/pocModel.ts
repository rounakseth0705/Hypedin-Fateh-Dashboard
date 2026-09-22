import mongoose from "mongoose";

interface IPOC extends mongoose.Document {
    name: string,
    phoneNo: string,
    email: string,
    userId: mongoose.Types.ObjectId
}

const POCSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", unique: true, required: true }
},{ timestamps: true });

const POCModel = mongoose.model<IPOC>("POC", POCSchema);

export default POCModel;