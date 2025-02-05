import dbConnect from "../../../../../../mongoose/db-connection";
import ChatHistory from "../../../../../..//mongoose/models/chat-history-model";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../../../../../app/lib/jwt";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
        const isValidToken = verifyToken(req);
        await dbConnect();
        const { id } = context.params;
        if (!id) {
            return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
        }
        const chatHistory = await ChatHistory.findOne({ user_id: isValidToken.id });
        if (!chatHistory) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }
        const resChat = chatHistory.chats.find((chat: any) => chat._id == id);
        if (!resChat) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }
        return NextResponse.json({ msg: "success.", chat: resChat }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching chat:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    try {
        const isValidToken = verifyToken(req);
        await dbConnect();
        const { id } = context.params;
        if (!id) {
            return NextResponse.json({ error: "Chat ID is required" }, { status: 400 });
        }
        // Find user's chat history
        const chatHistory = await ChatHistory.findOne({ user_id: isValidToken.id });
        if (!chatHistory) {
            return NextResponse.json({ error: "Chat history not found" }, { status: 404 });
        }
        // Filter out the chat with the given ID
        const updatedChats = chatHistory.chats.filter((chat: any) => chat._id.toString() !== id);
        // Check if any chat was removed
        if (updatedChats.length === chatHistory.chats.length) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }
        // Update and save the chat history
        chatHistory.chats = updatedChats;
        await chatHistory.save();
        return NextResponse.json({ msg: "Chat deleted successfully." }, { status: 200 });

    } catch (error: any) {
        console.error("Error deleting chat:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
