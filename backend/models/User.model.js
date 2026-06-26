import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    surname: {
        type: String,
        required: true,
        trim: true
    },

    studentId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: "student"
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema)

export default User