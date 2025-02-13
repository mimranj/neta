import dbConnect from "../../../../../mongoose/db-connection";
import ChatHistory from "../../../../../mongoose/models/chat-history-model"
import { NextRequest, NextResponse } from 'next/server';

import { verifyToken } from "../../../../app/lib/jwt";

export async function PUT(req: NextRequest) {
    try {
        const { chat } = await req.json(); // Get new messages from request body
        const isValidToken = verifyToken(req);
        if (!isValidToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect(); // Connect to database

        let chatHistory = await ChatHistory.findOne({ user_id: isValidToken.id });
        if (!chatHistory) {
            return NextResponse.json({ error: "something went wrong" }, { status: 400 });
        }
        chatHistory.chats.push({
            title: chat[0].text.response,
            messages: chat.map((msg: any) => ({
                id: msg.id, // Generate unique message ID
                text: msg.text,
                sender: msg.sender,
                // timestamp: new Date(),
            }))
        });
        await chatHistory.save(); // Save changes
        return NextResponse.json({ msg: "Chat history updated successfully." }, { status: 201 });
    } catch (error: any) {
        console.error("Error updating chat history:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



export async function GET(req: any) {
    try {
        const isValidToken = verifyToken(req);
        await dbConnect();
        const chatHistory = await ChatHistory.findOne({ user_id: isValidToken.id });
        if (!chatHistory) {
        }
        // Transforming data to return only required fields
        const chats = chatHistory.chats.map((chat: any) => ({
            _id: chat._id,
            title: chat.title,
            timestamp: chat.timestamp,
        })).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return new Response(JSON.stringify({ data: { _id: chatHistory._id, user_id: chatHistory.user_id, chats } }), { status: 200 });
    } catch (error: any) {
        console.error("Error getting subscription:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}