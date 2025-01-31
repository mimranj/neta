import { NextResponse } from 'next/server';
import dbConnect from '../../../../../mongoose/db-connection';
import User from "../../../../../mongoose/models/user-model";
// import Profile from "../../../../../mongoose/models/profile-model";
import { verifyToken } from "../../../lib/jwt";
import Profile from '../../../../../mongoose/models/profile-model';
import Subscription from '../../../../../mongoose/models/subscription-model';
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function GET(req: any) {
    try {
        const isValidToken = verifyToken(req);
        await dbConnect();
        const data = await User.findOne({ email: isValidToken.email })
        const profile = await Profile.findOne({ user_id: data._id });
        const subscription = await Subscription.findOne({ user_id: data._id });
        const { password, ...userData } = data._doc;
        return NextResponse.json({
            data: {
                name: userData.name,
                email: userData.email,
                phone_number: userData.phone_number,
                verified: userData.verified,
                profile_img: profile.profile_img,
                org_name: profile.org_name,
                address: profile.address,
                dob: profile.dob
            },
            subscriptions: subscription.subscription,
            msg: "success"
        });
        /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ err: error.message }, { status: 401 });
    }
}