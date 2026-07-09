import express from "express";
import {
    createClaimRequest,
    getClaimRequests,
    approveClaimRequest
} from "../controllers/Claim.controller.js";

const router = express.Router();

router.post("/", createClaimRequest);
router.get("/", getClaimRequests)
router.patch("/:id/approve", approveClaimRequest)


export default router;