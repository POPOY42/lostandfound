import Item from "../models/Item.model.js"


const createItem = async (req,res) =>{
    try{
        const {itemName, description, category,  location, dateLost, type, image, reportedBy} = req.body


        const newItem = new Item({
            itemName,
            description,
            category,
            location,
            dateLost,
            type,
            reportedBy,
            image: req.file ? req.file.path : ""
        });

        await newItem.save()

        return res.status(201).json({
            message: "Successfully Created"
        })

    }
    catch(error){
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
}


const getItems = async (req, res) => {
    try {
        const { type, status } = req.query;

        const filter = {};

        if (type) {
            filter.type = type;
        }

        if (status) {
            filter.status = status;
        } else {
            filter.status = { $ne: "claimed" };
        }

        const items = await Item.find(filter)
            .sort({createdAt: -1})
            .populate("reportedBy", "name surname");

        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};



const rejectItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findByIdAndUpdate(
            id,
            { status: "rejected" },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        return res.status(200).json({
            message: "Item rejected successfully",
            item
        });
    }
    catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}


const approveItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findByIdAndUpdate(
            id,
            { status: "approved" },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        return res.status(200).json({
            message: "Item approved",
            item
        });
    }
    catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
}


const getClaimedItems = async (req,res) =>{
    try {

        const claimedItems = await Item.find({
            status: "claimed"
        })
        .populate("reportedBy", "name surname")
        .sort({updatedAt: -1})

        return res.status(200).json(claimedItems)

    }
     catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export {createItem,
        getItems,
        rejectItem,
        approveItem,
        getClaimedItems
}