import mongoose from "mongoose";

interface IAmbassador extends mongoose.Document {
    userId: mongoose.Types.ObjectId,
    ID?: string,
    city: "Bengaluru" | "Delhi NCR" | "Chennai" | "Mumbai" | "Hyderabad",
    college: string,
    taskSubmitted: number,
    submittedTasks?: mongoose.Types.ObjectId[],
    taskCompleted: number,
    completedTasks?: mongoose.Types.ObjectId[],
    POCID: mongoose.Types.ObjectId,
    isUTMAlloted?: boolean,
    isQRAlloted?: boolean,
    UTM?: string,
    QR?: string
}

const ambassadorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, unique: true },
    ID: { type: String },
    city: { type: String, required: true },
    college: { type: String, required: true },
    taskSubmitted: { type: Number, required: true, default: 0 },
    submittedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task", required: true }],
    taskCompleted: { type: Number, required: true, default: 0 },
    completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "task", required: true }],
    POCID: { type: mongoose.Schema.Types.ObjectId, ref: "poc" },
    isUTMAlloted: { type: Boolean, required: true, default: false },
    isQRAlloted: { type: Boolean, required: true, default: false },
    UTM: { type: String },
    QR: { type: String }
},{ timestamps: true });

const AmbassadorModel = mongoose.model<IAmbassador>("ambassador", ambassadorSchema);

export default AmbassadorModel;