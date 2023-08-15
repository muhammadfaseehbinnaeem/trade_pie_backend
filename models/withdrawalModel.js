import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        amount: { type: Number, required: true, default: 0 },
        isActive: { type: Boolean, required: true, default: true },
        isApproved: { type: Boolean, required: true, default: false },
    },
    {
        timestamps: true
    }
);

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

export default Withdrawal;