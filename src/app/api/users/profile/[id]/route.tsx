import { uploadFileToS3 } from "@/app/lib/aws-bucket";
import dbConnect from "../../../../../../mongoose/db-connection";
import Profile from '../../../../../../mongoose/models/profile-model';
import User from "../../../../../../mongoose/models/user-model";
import { verifyToken } from "../../../../lib/jwt";
import sendMail from "@/app/lib/email";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function PUT(req: any) {
  let receiver_email = 'mimranjafar8@gmail.com'
  let email_subject = 'Account Updates'
  let email_body = 'Your account has been updated'
  try {
    const body = await req.json();
    const { name, email, phone_number, profile_img, address, dob, org_name } = body;
    const isValidToken = verifyToken(req);
    let imageUrl
    if (profile_img.name) {
      imageUrl = await uploadFileToS3(body.profile_img);
    }
    await dbConnect();



    let user = await User.findOne({ _id: isValidToken.id }).populate("profile");
    if (!user) {
      return new Response(JSON.stringify({ msg: "User not found" }), { status: 404 });
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone_number) user.phone_number = phone_number;

    await user.save();

    let profile = await Profile.findOne({ user_id: isValidToken.id });
    if (!profile) {
      return new Response(JSON.stringify({ msg: "Profile not found" }), { status: 404 });
    }
    
    if (profile_img.name) profile.profile_img = imageUrl;
    if (address) profile.address = address;
    if (dob) profile.dob = dob;
    if (org_name) profile.org_name = org_name;
    
    await profile.save();
    await sendMail(receiver_email, email_subject, email_body)
    return new Response(
      JSON.stringify({
        msg: "Profile and User updated successfully",
        data: {
          user: {
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
          },
          profile: {
            profile_img: profile.profile_img,
            address: profile.address,
            dob: profile.dob,
            org_name: profile.org_name,
          },
        },
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user and profile:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}


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
      })
    if (!data) {
      return new Response(JSON.stringify({ msg: "Profile not found" }), { status: 404 });
    }
    const { password, ...userData } = data._doc;
    return new Response(JSON.stringify({ data: {name:userData.name, email:userData.email, phone_number:userData.phone_number, verified:userData.verified,
       profile_img:userData.profile.profile_img, org_name:userData.profile.org_name, subscriptions:userData.subscription.subscription
      }, msg: "success" }), { status: 200 });
  } catch (error: any) {
    console.error("Error getting profile:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

