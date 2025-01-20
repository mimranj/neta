import Subscription from "../../../../../mongoose/models/subscription-model";
import dbConnect from "../../../../../mongoose/db-connection";
import { verifyToken } from "../../../../app/lib/jwt";
export async function PUT(req) {
    try {
        const { newSubscription } = await req.json();
        console.log(newSubscription);
        const isValidToken = verifyToken(req);
        await dbConnect();
        await Subscription.updateOne(
            { user_id: isValidToken.id },
            {
                $set: { "subscription.$[].status": "inactive" },
            }
        );
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { user_id: isValidToken.id },
            {
                $push: { subscription: newSubscription },
            },
            { new: true }
        );

        if (!updatedSubscription) {
            throw new Error("Subscription not found for the given user.");
        }

        return new Response(
            JSON.stringify({
                msg: "New subscription added successfully.",
                data: updatedSubscription,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error updating subscription:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400 }
        );
    }
}


export async function GET(req) {
    try {
        const isValidToken = verifyToken(req);
        await dbConnect();
        const subscription = await Subscription.findOne({ user_id: isValidToken.id });
        if (!subscription) {
            throw new Error("Subscription not found for the given user.");
        }
        return new Response(JSON.stringify({ data: subscription }), { status: 200 });
    } catch (error) {
        console.error("Error getting subscription:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}