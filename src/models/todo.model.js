import mongoose, { Schema } from 'mongoose';

const todoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
        default: null,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'Medium',
    },
    category: {
        type: String,
        enum: ['Personal', 'Work', 'Finance', 'Grocery', 'Gym', 'Health', 'Travel'],
        default: 'Personal',
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedDate: {
        type: Date,
        default: null,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    order: {
        type: Number,
        default: 0,
        required: true,
    }
}, { timestamps: true });

export const Todo = mongoose.model("Todo", todoSchema);