import { NextResponse } from 'next/server';
import dbConnect from '../../../../../mongoose/db-connection';
import User from "../../../../../mongoose/models/user-model";
import bcrypt from "bcrypt"

export async function POST(req: any) {
    try {
        const body = await req.json();
        await dbConnect();
        // let userData
        let data = await User.findOne({ email: body.email })
        if (!data) {
            return NextResponse.json({ msg: "User not found" }, { status: 404 });
        }

        if (body.otp === data.verification_otp) {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            data.password = hashedPassword;
            data.verification_otp = null;
            await data.save();
            return NextResponse.json({ msg: "success" });
        } else {
            return NextResponse.json({ msg: "Invalid OTP" }, { status: 401 });
        }
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ err: error.message }, { status: 401 });
    }
}