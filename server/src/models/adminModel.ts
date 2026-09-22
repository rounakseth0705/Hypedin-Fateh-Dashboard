import mongoose from "mongoose";

interface IAdmin extends mongoose.Document {
    userId: mongoose.Types.ObjectId
}

const adminSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
},{ timestamps: true });

const AdminModel = mongoose.model<IAdmin>("admin", adminSchema);

export default AdminModel;