import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: true },
        accountNumber: { type: String, required: true },
        accountType: { type: String, required: true },
        referralCommission: { type: Number, required: true, default: 0 },
        teamCommission: { type: Number, required: true, default: 0 },
        profitRange1: { type: Number, required: true, default: 0 },
        profitRange2: { type: Number, required: true, default: 0 },
        profitRange3: { type: Number, required: true, default: 0 },
        profitRange4: { type: Number, required: true, default: 0 },
        profitRange5: { type: Number, required: true, default: 0 },
        goals: { type: String, default: '' }
    },
    {
        timestamps: true
    }
);

adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;