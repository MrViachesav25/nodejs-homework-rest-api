import { Schema, model } from 'mongoose';

import { handleSaveError, runValidateAtUpdate } from './hooks.js';
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = Schema({
    email: {
        type: String,
        match: emailRegexp,
        required: [true, 'Email is required'],
        unique: true,
    },

    password: {
        type: String,
        required: [true, 'Set password for user'],
        minlength: 7,
    },

    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },

    token: {
        type: String,
        default: '',
    },

    avatarURL: {
        type: String,
        required: true,
    }

}, {versionKey: false, timestamps: true});

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", runValidateAtUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

const User = model('user', userSchema);

export default User;