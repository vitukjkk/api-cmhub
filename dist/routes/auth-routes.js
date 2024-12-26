import { Router } from "express";
import { AuthController } from "../controllers/auth-controllers.js";
export const authRoutes = Router();
const authController = new AuthController();
authRoutes.post("/login", authController.login);
authRoutes.post("/register", authController.register);
