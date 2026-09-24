import mongoose from "mongoose";

interface ISubmissions extends mongoose.Document {
    ambassadorId: mongoose.Types.ObjectId,
    taskId: mongoose.Types.ObjectId,
    proofURLs: string[],
    status: "Pending" | "Approved" | "Rejected",
    adminFeedback?: string,
    remarks?: string,
    reviewedBy?: mongoose.Types.ObjectId,
    reviewedOn?: Date
}

const submissionSchema = new mongoose.Schema({
    ambassadorId: { type: mongoose.Schema.Types.ObjectId, ref: "ambassador", required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "task", required: true },
    proofURLs: [{ type: String, required: true }],
    status: { type: String, required: true },
    adminFeedback: { type: String },
    remarks: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    reviewedOn: { type: Date }
},{ timestamps: true });

const SubmissionModel = mongoose.model<ISubmissions>("submission", submissionSchema);

export default SubmissionModel;