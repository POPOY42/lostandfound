import Item from "../models/Item.model.js";
import User from "../models/User.model.js";

const getDashboardStats = async (req, res) => {
    try {

        const lost = await Item.countDocuments({
            type: "lost",
            status: "approved",
        });

        const found = await Item.countDocuments({
            type: "found",
            status: "approved",
        });

        const claimed = await Item.countDocuments({
            status: "claimed",
        });

        const users = await User.countDocuments();

        return res.status(200).json({
            lost,
            found,
            claimed,
            users,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getRecentPosts = async (req, res) => {
    try {

        const recentPosts = await Item.find({
            status: {
                $in: ["approved", "claimed"],
            },
        })
            .populate("reportedBy", "name surname")
            .sort({ createdAt: -1 })
            .limit(5);

        return res.status(200).json(recentPosts);

    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export {
    getDashboardStats,
    getRecentPosts,
};