var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'User email required']
    },
    password: {
        type: String,
        required: [true, 'User password required']
    },
    phone_number: {
        type: String,
        required: [true, 'User phone number required']
    },
    verified: {
        type: Boolean,
        default: false
    },
    verification_otp: {
        type: String,
        default: "0"
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Profile
        ref: 'Profile', // Must match the name of the Profile model
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Subscription
        ref: 'Subscription', // Must match the name of the Subscription model
    },
},
    { timestamps: true },
);

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User