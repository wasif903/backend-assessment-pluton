import express from "express";
import validate from "../middlewares/ValidationHandler.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import AccessMiddleware from "../middlewares/AccessMiddleware.js";
import CacheMiddleware from "../middlewares/CacheMiddleware.js";
import {
  HandleCreateBlog,
  HandleDeleteBlog,
  HandleEditBlog,
  HandleGetAllBlogs,
} from "../controllers/BlogController.js";
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

router.patch(
  "/:userID/edit-blog/:blogID",
  AuthMiddleware,
  AccessMiddleware(["User"]),
  CreateUploadMiddleware([{ name: "featuredImage", isMultiple: false }]),
  HandleEditBlog
);

router.delete(
  "/:userID/delete-blog/:blogID",
  AuthMiddleware,
  AccessMiddleware(["User", "Admin"]),
  HandleDeleteBlog
);

router.get(
  "/get-blogs",
  // AuthMiddleware,
  // AccessMiddleware(["Admin", "User"]),
  CacheMiddleware("get-blogs", (req) => "all"),
  HandleGetAllBlogs
);




export default router;
