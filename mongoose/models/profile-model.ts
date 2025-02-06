import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
    {
        profile_img: { // Changed to lowercase
            type: String,
        },
        website:{
            type: String
        },
        org_name: { // Changed to lowercase
            type: String,
        },
        number_of_electricians: {
            type: Number
        },
        where_to_get_esupplies: {
            type: String
        }, // Changed to lowercase
        address: { // Changed to lowercase
            type: String,
        },
        dob: { // Changed to lowercase
            type: String,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
