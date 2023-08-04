import mongoose from "mongoose";
import dotenv from 'dotenv';
import colors from 'colors';

import admins from "./data/admins.js";
import users from './data/users.js';
import investments from './data/investments.js';
import Admin from "./models/adminModel.js";
import User from './models/userModel.js';
import Investment from "./models/investmentModel.js";

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Seeder started!'))
    .catch((err) => console.log(err));

const importData = async () => {
    try {
        await Admin.deleteMany();
        await User.deleteMany();
        await Investment.deleteMany();

        await Admin.insertMany(admins);
        const createdUsers = await User.insertMany(users);

        const firstUser = createdUsers[0]._id;

        const sampleInvestments = investments.map((investment) => {
            return { ...investment, user: firstUser };
        });

        await Investment.insertMany(sampleInvestments);

        console.log('Data imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.log(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Admin.deleteMany();
        await User.deleteMany();
        await Investment.deleteMany();

        console.log('Data destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}