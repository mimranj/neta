import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(req) {
    try {
        const { amount, currency = 'usd' } = await req.json();

        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents
            currency,
            payment_method_types: ['card'],
        });
        return new NextResponse(JSON.stringify({ paymentIntent: paymentIntent, msg: "Created successfully" }), { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}