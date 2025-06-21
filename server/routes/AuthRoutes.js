import express from "express";
import { login, logout, refreshToken, register } from "../controllers/AuthController.js";
import validate from "../middlewares/ValidationHandler.js";
import { loginSchema, adminSchema, userSchema } from "../validations/AuthValidations.js";

const router = express.Router();




router.post("/register", validate(adminSchema), register);

router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);




export default router;