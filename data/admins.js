import bcrypt from 'bcryptjs';

const admins = [
    {
        name: 'Admin User',
        email: 'admin@tradepie.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: true,
        accountNumber: '03487178935',
        accountType: 'Easypaisa',
        referralCommission: 10,
        teamCommission: 5,
        profitRange1: 2,
        profitRange2: 10,
        profitRange3: 25,
        profitRange4: 40,
        profitRange5: 100,
        goals: ''
    }
];

export default admins;