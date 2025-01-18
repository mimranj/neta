import { NextResponse } from "next/server";
import dbConnect from '../../../../../mongoose/db-connection';
import User from '../../../../../mongoose/models/user-model';
import Profile from '../../../../../mongoose/models/profile-model';
import bcrypt from 'bcrypt'
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await dbConnect();
    let data = await req.json();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const session = await mongoose.startSession();
    session.startTransaction();
    const user = await User.create([data], { session });
    const profile = await Profile.create(
      [
        {
          user_id: user[0]._id,
          profile_img: "",
          org_name: "",
          address: "",
          dob: ""
        },
      ],
      { session }
    );
    user[0].profile = profile[0]._id;
    await user[0].save({ session });
    await session.commitTransaction();
    session.endSession();
    const { password, ...userData } = user[0]._doc;
    data=password
    return new NextResponse(JSON.stringify({ data: userData, msg: "User created successfully" }), { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}