import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
        accountNumber: { type: String, required: true },
        accountType: { type: String, required: true },
        referral: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User', default: null },
        wallet: { type: Number, required: true, default: 0 },
        referralCommission: { type: Number, required: true, default: 0 },
        teamCommission: { type: Number, required: true, default: 0 },
        investment: { type: Number, required: true, default: 0 },
        withdrawal: { type: Number, required: true, default: 0 },
        earning: { type: Number, required: true, default: 0 },
        profit: { type: Number, required: true, default: 0 }
    },
    {
        timestamps: true
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;