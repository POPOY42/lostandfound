import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },

    claimant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    proof: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    rejectionReason: {
        type: String,
        default: ""
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    reviewedAt: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});

const Claim = mongoose.model("Claim", claimSchema);

export default Claim;