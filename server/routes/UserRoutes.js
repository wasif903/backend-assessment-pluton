import express from "express";
import { HandleGetAllUsers, HandleRegisterUser } from "../controllers/UserController.js";
import validate from "../middlewares/ValidationHandler.js";
import { userSchema } from "../validations/AuthValidations.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import AccessMiddleware from "../middlewares/AccessMiddleware.js";
import CacheMiddleware from "../middlewares/CacheMiddleware.js";

const router = express.Router();


router.post("/register-user",
    validate(userSchema),
    HandleRegisterUser
);


router.get(
    "/get-users",
    AuthMiddleware,
    AccessMiddleware(["Admin",]),
    CacheMiddleware('get-users', (req) => 'all', 120),
    HandleGetAllUsers
);


export default router;

