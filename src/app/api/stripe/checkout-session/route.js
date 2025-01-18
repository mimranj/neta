import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    
    try {
        const { items, success_url, cancel_url } = await req.json();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Add 'card' for cards, or other methods
            mode: 'payment', // 'payment' for one-time payments, 'subscription' for recurring
            line_items: items.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.amount, // Amount in cents
                },
                quantity: item.quantity,
            })),
            success_url,
            cancel_url,
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
