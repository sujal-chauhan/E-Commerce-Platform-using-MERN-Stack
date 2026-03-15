import express from "express";
import userController from "./user.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", userController.getProfile);

router.put("/update", userController.updateProfile);

router.delete("/account", userController.deleteAccount);

export default router;