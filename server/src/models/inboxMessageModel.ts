import mongoose from "mongoose";

interface IinboxMessage extends mongoose.Document {
    message: string,
    userId: mongoose.Types.ObjectId,
    isImageAttached: boolean,
    attachmentLinks?: string[]
}

const inboxMessageSchema = new mongoose.Schema({
    message: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    isImageAttached: { type: Boolean, default: false, required: true },
    attachmentLinks: [{ type: String }]
},{ timestamps: true });

const InboxMessageModel = mongoose.model<IinboxMessage>("inboxMessage", inboxMessageSchema);

export default InboxMessageModel;