import dbConnect from "../../../../../../mongoose/db-connection";
import Profile from '../../../../../../mongoose/models/profile-model';
import User from "../../../../../../mongoose/models/user-model";
import { verifyToken } from "../../../../lib/jwt";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function PUT(req: any) {
  try {
    const isValidToken = verifyToken(req); 
    await dbConnect();

    const body = await req.json();
    const { name, email, phone_number, profile_img, address, dob, org_name } = body;

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

    if (profile_img) profile.profile_img = profile_img;
    if (address) profile.address = address;
    if (dob) profile.dob = dob;
    if (org_name) profile.org_name = org_name;

    await profile.save();

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

// export async function PUT(req: any) {
//   try {
//     const isValidToken = verifyToken(req);
//     await dbConnect();
//     const { profile_img, address, dob, org_name } = await req.json();
//     let profile = await Profile.findOne({ user_id: isValidToken.id });
//     if (!profile) {
//       return new Response(JSON.stringify({ msg: "Profile not found" }), { status: 404 });
//     }
//     /* eslint-disable  @typescript-eslint/no-explicit-any */
//     let profileBody: any = {}
//     profileBody["profile_img"] = profile_img || profile.profile_img;
//     profileBody["address"] = address || profile.address;
//     profileBody["dob"] = dob || profile.dob;
//     profileBody["org_name"] = org_name || profile.org_name;
//     profile = await Profile.findOneAndUpdate({ user_id: isValidToken.id }, profileBody, { new: true });
//     return new Response(JSON.stringify({ msg: "Profile updated successfully", data: profile }), { status: 200 });
//     /* eslint-disable  @typescript-eslint/no-explicit-any */
//   } catch (error: any) {
//     console.error("Error updating profile:", error);
//     return new Response(JSON.stringify({ error: error.message }), { status: 400 });
//   }
// }

export async function GET(req: any) {
  try {
    const isValidToken = verifyToken(req);
    await dbConnect();
    const data = await User.findOne({ email: isValidToken.email })
      .populate({
        path: "profile",
        strictPopulate: true,
      })
    if (!data) {
      return new Response(JSON.stringify({ msg: "Profile not found" }), { status: 404 });
    }
    const { password, ...userData } = data._doc;
    return new Response(JSON.stringify({ data: userData, msg: "success" }), { status: 200 });
  } catch (error: any) {
    console.error("Error getting profile:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

