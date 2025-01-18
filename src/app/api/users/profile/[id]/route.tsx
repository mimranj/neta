import dbConnect from "../../../../../../mongoose/db-connection";
import Profile from '../../../../../../mongoose/models/profile-model';
import { verifyToken } from "../../../../lib/jwt";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function PUT(req: any) {
  try {
    const isValidToken = verifyToken(req);
    await dbConnect();
    const { profile_img, address, dob, org_name } = await req.json();
    let profile = await Profile.findOne({ user_id: isValidToken.id });
    if (!profile) {
      return new Response(JSON.stringify({ msg: "Profile not found" }), { status: 404 });
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    let profileBody: any = {}
    profileBody["profile_img"] = profile_img || profile.profile_img;
    profileBody["address"] = address || profile.address;
    profileBody["dob"] = dob || profile.dob;
    profileBody["org_name"] = org_name || profile.org_name;
    profile = await Profile.findOneAndUpdate({ user_id: isValidToken.id }, profileBody, { new: true });
    return new Response(JSON.stringify({ msg: "Profile updated successfully", data: profile }), { status: 200 });
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

