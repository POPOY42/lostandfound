import express from "express"
import multer from "multer"
import {createItem,
        getItems,
        rejectItem,
        approveItem,
        getClaimedItems,
        getMyItems,
        updateItem,
        deleteItem
        
} from "../controllers/Item.controller.js"
import { get } from "mongoose";

const router = express.Router()



const upload = multer({
    dest: "uploads/"
});


router.get("/", getItems)
router.post("/", upload.single("image"), createItem);

router.patch("/:id/reject", rejectItem)
router.patch("/:id/approve", approveItem)

router.get("/claimed", getClaimedItems)

router.get("/myitems", getMyItems)

router.patch("/:id", upload.single("image"), updateItem);

router.delete("/:id", deleteItem)

export default router