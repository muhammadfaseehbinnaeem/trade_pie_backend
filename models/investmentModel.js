import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        amount: { type: Number, required: true, default: 0 },
        image: { type: String, required: true },
        isActive: { type: Boolean, required: true, default: true },
        isApproved: { type: Boolean, required: true, default: false },
        profit: { type: Number, required: true, default: 0 }
    },
    {
        timestamps: true
    }
);

const Investment = mongoose.model('Investment', investmentSchema);

export default Investment;