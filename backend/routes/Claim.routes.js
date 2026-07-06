import express from "express";
import {
    createClaimRequest
} from "../controllers/Claim.controller.js";

const router = express.Router();

router.post("/", createClaimRequest);


export default router;