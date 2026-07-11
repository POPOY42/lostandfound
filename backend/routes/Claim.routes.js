import express from "express";
import {
    createClaimRequest,
    getClaimRequests,
    approveClaimRequest,
    getMyClaim
} from "../controllers/Claim.controller.js";

const router = express.Router();

router.post("/", createClaimRequest);
router.get("/", getClaimRequests)
router.patch("/:id/approve", approveClaimRequest)

router.get("/myclaimed", getMyClaim)


export default router;