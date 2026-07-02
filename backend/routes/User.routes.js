import express from 'express'
import {register,
        login,
        getUsers,
        changeUsername
} from "../controllers/User.controller.js";


const router = express.Router()

router.post("/register", register)
router.post("/login", login)

router.get("/", getUsers)

router.put("/username", changeUsername)
export default router
