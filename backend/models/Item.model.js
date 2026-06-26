import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    image: {
        type: String,
        default: ""
    },

    type: {
        type: String,
        enum: ["lost", "found"],
        required: true
    },

    status: {   
        type: String,
        enum: ["pending", "approved", "rejected", "claimed"],
        default: "pending"
    },

    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true  
    },
    

    dateLost: {
        type: Date,
        default: Date.now
    },

    dateFound: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Item = mongoose.model("Item", itemSchema);

export default Item;