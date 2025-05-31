import mongoose, { Schema } from 'mongoose';

const reminderSchema = new Schema({
    todoId: {
        type: Schema.Types.ObjectId,
        ref: 'Todo',
        required: true,
    },
    reminderDate: {
        type: Date,
        required: true,
    },
    reminderTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(v); // Matches HH:mm format
            },
            message: props => `${props.value} is not a valid time! Use HH:mm format.`
        }
    },
    message: {
        type: String,
        default: "",
    },

}, { timestamps: true });

export const Reminder = mongoose.model("Reminder", reminderSchema);
