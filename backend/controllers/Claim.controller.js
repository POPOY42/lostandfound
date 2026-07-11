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


const getClaimRequests = async (req, res) => {
    try {
        const requests = await Claim.find()
            .populate("item")
            .populate("claimant")
            .sort({createdAt: -1})

        const validRequests = requests.filter(
            (request) => request.item !== null
        );

        return res.status(200).json(requests);
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: error.message
        });
    }
};



const approveClaimRequest = async (req,res) =>{

    try {
        const { id } = req.params;

        const claim = await Claim.findByIdAndUpdate(
            id,
            {status: "approved"},
            {new : true}
        )

        if(!claim){
        return res.status(404).json({
                message: "Item not found!"
        })
        }

        const item = await Item.findByIdAndUpdate(
            claim.item,
            {
                status: "claimed",
                claimedBy: claim.claimant,
                claimedAt: new Date()
            },
            {
                new: true
            }
        );
        return res.status(200).json({
            message: "Your claim approved",
            claim,
            messageToTheUser: "Pls come to the barangay to claim your item"
        })
    } 
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getMyClaim = async (req, res) => {
    try {
        const { claimant } = req.query;

        const claims = await Claim.find({
            claimant,
            status: "approved"
        })
            .populate("item")
            .sort({ createdAt: -1 });

        const items = claims
            .filter(claim => claim.item)
            .map(claim => ({
                ...claim.item.toObject(),
                claimedDate: claim.reviewedAt || claim.updatedAt
            }));

        return res.status(200).json(items);

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export { createClaimRequest,
         getClaimRequests,
         approveClaimRequest,
         getMyClaim
};