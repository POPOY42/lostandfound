import Claim from "../models/Claim.model.js";
import Item from "../models/Item.model.js";

const createClaimRequest = async (req, res) => {
    try {
        const { itemId, claimedBy, ownershipDetails } = req.body;

        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({
                message: "Item not found."
            });
        }

        if (item.status === "claimed") {
            return res.status(400).json({
                message: "This item has already been claimed."
            });
        }

        const existingClaim = await Claim.findOne({
            item: itemId,
            claimant: claimedBy,
            status: "pending"
        });

        if (existingClaim) {
            return res.status(400).json({
                message: "You already submitted a claim request."
            });
        }

        const claim = new Claim({
            item: itemId,
            claimant: claimedBy,
            proof: ownershipDetails
        });

        await claim.save();

        return res.status(201).json({
            message: "Claim request submitted successfully.",
            claim
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

export { createClaimRequest };