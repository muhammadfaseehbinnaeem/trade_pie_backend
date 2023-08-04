import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Faseeh',
        email: 'faseeh@email.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: false,
        accountNumber: '03017442932',
        accountType: 'Jazzcash',
        referral: null,
        referralCommission: 0,
        teamCommission: 0,
        investment: 25,
        earning: 30,
        profit: 5
    },
    {
        name: 'Naeem',
        email: 'naeem@email.com',
        password: bcrypt.hashSync('123', 10),
        isAdmin: false,
        accountNumber: '03468917070',
        accountType: 'Easypaisa',
        referral: null,
        referralCommission: 0,
        teamCommission: 0,
        investment: 10,
        earning: 0,
        profit: 0
    },
];

export default users;