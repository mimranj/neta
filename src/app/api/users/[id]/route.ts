import { NextResponse } from 'next/server';
import dbConnect from '../../../../../mongoose/db-connection';
import User from "../../../../../mongoose/models/user-model";
// import Profile from "../../../../../mongoose/models/profile-model";
import { verifyToken } from "../../../lib/jwt";
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function GET(req: any) {
    try {
        const isValidToken = verifyToken(req);
        await dbConnect();
        const data = await User.findOne({ email: isValidToken.email })
            .populate({
                path: "profile",
                strictPopulate: true,
            })
            .populate({
                path: "subscription",
                strictPopulate: true,
            });
        const { password, ...userData } = data._doc;
        return NextResponse.json({ data: userData, msg: "success" });
        /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (error: any) {
        console.error(error.message);
        return NextResponse.json({ err: error.message }, { status: 401 });
    }
}