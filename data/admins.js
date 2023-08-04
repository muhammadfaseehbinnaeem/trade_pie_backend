import bcrypt from 'bcryptjs';

const admins = [
    {
        name: 'Admin User',
        email: 'admin@tradepie.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: true,
        accountNumber: '03304095376',
        accountType: 'Jazzcash',
        referralCommission: 0,
        teamCommission: 0,
        goals: ''
    }
];

export default admins;