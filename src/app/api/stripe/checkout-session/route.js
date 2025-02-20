import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    try {
        const { item, success_url, cancel_url } = await req.json();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Add more methods like 'google_pay' if needed
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: item.amount, // Amount in cents
                    },
                    quantity: item.quantity,
                },
            ],
            success_url,
            cancel_url,
        });

        return new NextResponse(
            JSON.stringify({ sessionId: session.id, msg: "Created successfully" }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating session:", error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
