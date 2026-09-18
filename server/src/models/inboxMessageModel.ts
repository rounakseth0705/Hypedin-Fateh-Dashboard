import mongoose from "mongoose";

interface IinboxMessage extends mongoose.Document {
    message: string,
    userId: mongoose.Types.ObjectId,
}

const inboxMessageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }
},{ timestamps: true });

const InboxMessageModel = mongoose.model<IinboxMessage>("inboxMessage", inboxMessageSchema);

export default InboxMessageModel;