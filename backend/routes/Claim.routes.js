import express from "express";
import {
    createClaimRequest,
    getClaimRequests,
    approveClaimRequest,
    rejectClaimRequest,
    getMyClaim,
    getMyClaims
} from "../controllers/Claim.controller.js";

const router = express.Router();

router.post("/", createClaimRequest);
router.get("/", getClaimRequests)
router.patch("/:id/approve", approveClaimRequest)

router.get("/myclaimed", getMyClaim)
router.get("/my", getMyClaims);

router.patch("/:id/reject", rejectClaimRequest);


export default router;