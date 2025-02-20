import dbConnect from "../../../../../mongoose/db-connection";
import Subscription from "../../../../../mongoose/models/subscription-model"
import { verifyToken } from "../../../../app/lib/jwt";
export async function PUT(req) {
    try {
        const { newSubscription } = await req.json();
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

        const subscriptions = await Subscription.findOne({ user_id: isValidToken.id });
        if (!subscriptions) {
            throw new Error("Subscription not found for the given user.");
        }
        let activePlan = subscriptions.subscription.find((plan) => plan.status === "active");
        if (!activePlan || new Date(activePlan.end_date) < new Date()) {
            await Subscription.updateOne(
                { user_id: isValidToken.id },
                {
                    $set: { "subscription.$[].status": "inactive" },
                }
            );
            const now = new Date();
            const end_date = new Date(now.getFullYear(), now.getMonth() + 12, now.getDate());
            const newSubscription = {
                intent_id: "",
                name: "Electrician Free Tier",
                price: 0,
                status: "active",
                start_date: new Date(),
                end_date: end_date
            }
            const plans = await Subscription.findOneAndUpdate(
                { user_id: isValidToken.id },
                {
                    $push: { subscription: newSubscription },
                },
                { new: true }
            );
            activePlan = plans.subscription.find((plan) => plan.status === "active");
        }

        return new Response(JSON.stringify({ data: activePlan }), { status: 200 });
    } catch (error) {
        console.error("Error getting subscription:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}