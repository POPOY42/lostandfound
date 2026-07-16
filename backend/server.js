import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

import userRouter from "./routes/User.routes.js"
import itemRouter from "./routes/Item.routes.js"
import dashboardRoutes from "./routes/Dashboard.routes.js";
import claimRoutes from "./routes/Claim.routes.js";

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);


app.use("/api/users", userRouter)
app.use("/api/item", itemRouter)
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/claim-request", claimRoutes);



mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => console.log(err));