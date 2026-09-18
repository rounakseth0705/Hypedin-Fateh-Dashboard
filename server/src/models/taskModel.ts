import mongoose from "mongoose";

interface ITask extends mongoose.Document {
    title: string,
    description: string,
    belongsTo?: "Ambassador" | "POC",
    periodicity: "Weekly" | "Monthly" | "Both" | "One Time",
    activity: string,
    target?: string,
    taskMonth?: number,
    taskWeek?: number,
    isImageAllowed: boolean,
    isVideoAllowed: boolean,
    createdBy: mongoose.Types.ObjectId
}

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    belongsTo: { type: String },
    periodicity: { type: String, required: true },
    activity: { type: String },
    target: { type: String },
    taskMonth: { type: Number },
    taskWeek: { type: Number },
    isImageAllowed: { type: Boolean, required: true, default: false },
    isVideoAllowed: { type: Boolean, required: true, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin", required: true, select: false }
},{ timestamps: true });

const TaskModel = mongoose.model<ITask>("task", taskSchema);

export default TaskModel;