const dbConnect = require('../mongoose/db-connection');
const User = require('../mongoose/models/user-model');
const bcrypt = require('bcrypt');
const load = async () => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await dbConnect()
        await User.create({
                name: 'super admin',
                email: 'admin@gmail.com',
                dob:'01012000',
                password: hashedPassword,
                phone_number: '1234567890'
        })
        console.log('user created');
    } catch (error) {
        console.log('error', error);
    }
}

load()