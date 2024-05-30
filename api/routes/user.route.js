import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

// call the router method from express
const router = express.Router();

// create a route for the /test endpoint
router.get("/test", test);
router.post("/update/:id", verifyUser, updateUser);

export default router;
