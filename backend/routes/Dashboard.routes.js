import express from "express";
import {
    getDashboardStats,
    getRecentPosts
} from "../controllers/Dashboard.controller.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/recent-posts", getRecentPosts);

export default router;