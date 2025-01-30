import { NextResponse } from 'next/server';
import dbConnect from '../../../../../mongoose/db-connection';
import User from "../../../../../mongoose/models/user-model";
import sendMail from '@/app/lib/email';
export async function POST(req: any) {
    
    try {
        const body = await req.json();
        await dbConnect();
        // let userData
        let data = await User.findOne({ email: body.email })
        if (!data) {
            return NextResponse.json({ msg: "User not found" }, { status: 404 });
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        data.verification_otp = otp;
        await data.save();
        await sendMail(body.email, "OTP Verification", `Your OTP is ${otp}`);
        return NextResponse.json({ msg: "success", email: body.email });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ err: error.message }, { status: 401 });
    }
}