import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { amount, plan } = await req.json();

        
        return new NextResponse(JSON.stringify({ data: {}, msg: "Created successfully" }), { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}