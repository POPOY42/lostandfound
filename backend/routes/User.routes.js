import express from 'express'
import {register,
        login,
        getUsers,
        changeUsername,
        changePhoneNumber,
        changePassword
} from "../controllers/User.controller.js";


const router = express.Router()

router.post("/register", register)
router.post("/login", login)

router.get("/", getUsers)

router.put("/username", changeUsername)

router.put("/contact-number", changePhoneNumber)

router.put("/password", changePassword)
export default router
