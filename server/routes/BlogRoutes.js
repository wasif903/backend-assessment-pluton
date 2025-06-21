import express from "express";
import { HandleGetAllUsers } from "../controllers/UserController.js";
import validate from "../middlewares/ValidationHandler.js";
import { userSchema } from "../validations/AuthValidations.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import AccessMiddleware from "../middlewares/AccessMiddleware.js";
import CacheMiddleware from "../middlewares/CacheMiddleware.js";
import { HandleCreateBlog } from "../controllers/BlogController.js";
import { blogSchema } from "../validations/BlogValidations.js";
import { CreateUploadMiddleware } from "../middlewares/MulterMiddleware.js";

const router = express.Router();

router.post(
  "/:userID/create-blog",
  AuthMiddleware,
  AccessMiddleware(["Admin", "User"]),
  CreateUploadMiddleware([{ name: "featuredImage", isMultiple: false }]),
  validate(blogSchema),
  HandleCreateBlog
);

router.get(
  "/get-users",
  AuthMiddleware,
  AccessMiddleware(["Admin"]),
  CacheMiddleware("get-users", (req) => "all"),
  HandleGetAllUsers
);

export default router;
