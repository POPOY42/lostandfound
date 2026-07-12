import express from 'express'
import {register,
        login,
        getUsers,
        changeUsername,
        changePhoneNumber,
        changePassword,
        findUser,
        verifyContact,
        resetPassword
} from "../controllers/User.controller.js";


const router = express.Router()

router.post("/register", register)
router.post("/login", login)

router.get("/", getUsers)

router.put("/username", changeUsername)

router.put("/contact-number", changePhoneNumber)

router.put("/password", changePassword)

router.post("/forgot-password/find-user", findUser);
router.post("/forgot-password/verify-contact", verifyContact);
router.post("/forgot-password/reset", resetPassword);
export default router
