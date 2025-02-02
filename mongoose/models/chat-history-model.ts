import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid'; // Import UUID generator

const chatHistorySchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        chats: [
            {
                timestamp: { type: Date, default: Date.now }, // Chat session timestamp
                messages: [  // Renaming "chats" to "messages" for clarity
                    {
                        id: { type: Number, required: true }, // Auto-generate message ID
                        text: { type: String, required: true }, // Message content
                        sender: { type: String, required: true }, // false = user, true = AI
                        timestamp: { type: Date, default: Date.now }, // Message timestamp
                    },
                ],
            },
        ],
    },
    { timestamps: true } // Mongoose will automatically add createdAt & updatedAt
);

// Ensure `chatId` is unique within `chats`
// chatHistorySchema.pre('save', function (next) {
//     this.chats.forEach((chat) => {
//         if (!chat.chatId) {
//             chat.chatId = uuidv4(); // Generate unique ID if missing
//         }
//     });
//     next();
// });

const ChatHistory = mongoose.models.ChatHistory || mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;
