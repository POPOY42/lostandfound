import express from "express"
import multer from "multer"
import {createItem,
        getItems,
        rejectItem,
        approveItem,
        getClaimedItems
        
} from "../controllers/Item.controller.js"

const router = express.Router()



const upload = multer({
    dest: "uploads/"
});


router.get("/", getItems)
router.post("/", upload.single("image"), createItem);

router.patch("/:id/reject", rejectItem)
router.patch("/:id/approve", approveItem)

router.get("/claimed", getClaimedItems)

export default router