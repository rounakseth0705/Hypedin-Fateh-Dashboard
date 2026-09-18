import mongoose from "mongoose";

interface IRewards extends mongoose.Document {
    title: string,
    belongsTo: "Ambassador" | "POC"
}

const rewardSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    belongsTo: { type: String, required: true }
},{ timestamps: true });

const RewardModel = mongoose.model<IRewards>("reward", rewardSchema);

export default RewardModel;