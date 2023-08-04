import mongoose from "mongoose";

const commissionSchema = new mongoose.Schema(
    {
        from: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User', default: null },
        to: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User', default: null },
        commission: { type: Number, required: true, default: 0 },
        commissionType: { type: String, required: true },
        isActive: { type: Boolean, required: true, default: true },
        isApproved: { type: Boolean, required: true, default: false }
    },
    {
        timestamps: true
    }
);

const Commission = mongoose.model('Commission', commissionSchema);

export default Commission;