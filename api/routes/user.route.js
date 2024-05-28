import express from "express";
import { test } from "../controllers/user.controller.js";

// call the router method from express
const router = express.Router();

// create a route for the /test endpoint
router.get("/test", test);

export default router;
