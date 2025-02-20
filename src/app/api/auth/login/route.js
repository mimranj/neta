import dbConnect from '../../../../../mongoose/db-connection';
import User from '../../../../../mongoose/models/user-model';
import bcrypt from 'bcrypt'
import { signToken } from "../../../lib/jwt";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }
    let first_login = false
    if (user.first_login) {
      first_login = true
      user.first_login = false
      await user.save()
    }

    const token = signToken({ id: user._id, email: user.email });
    const responseObj = { msg: 'Login successful', token };
    if (first_login) {
      responseObj.first_login = first_login;
    }
    return new Response(JSON.stringify(responseObj),{ status: 200 });
  } catch (error) {
    console.error('Error logging in:', error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
  }
}