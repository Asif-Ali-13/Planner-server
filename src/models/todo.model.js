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
        type: Date | null,
        default: null,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
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
        type: Date | null,
        default: null,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

export const Todo = mongoose.model("Todo", todoSchema);