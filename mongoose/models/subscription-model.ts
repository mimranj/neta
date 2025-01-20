import mongoose from 'mongoose';
import { start } from 'repl';

const subscriptionSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        subscription: [
            {
                intent_id: { type: String, default: "" },
                name: { type: String, default: "" },
                price: { type: Number, default: 0 },
                status: { type: String, default: "inactive" },
                start_date: { type: Date, default: Date.now },
                end_date: { type: Date, default: null },
            },
        ],
    },
    { timestamps: true }
);

const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
