import express from "express"
import multer from "multer"
import {createItem,
        getItems,
        rejectItem,
        approveItem
        
} from "../controllers/Item.controller.js"

const router = express.Router()



const upload = multer({
    dest: "uploads/"
});


router.get("/", getItems)
router.post("/", upload.single("image"), createItem);

router.patch("/:id/reject", rejectItem)
router.patch("/:id/approve", approveItem)

export default router