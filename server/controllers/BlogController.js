import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/TokenGenerator.js";
import AdminModel from "../models/AdminSchema.js";
import UserModel from "../models/UserSchema.js";
import { normalizeFields } from "../utils/NormalizeString.js";
import mongoose from "mongoose";
import SearchQuery from "../utils/SearchQuery.js";
import invalidateCacheGroup from "../utils/RedisCache.js";
import BlogModel from "../models/BlogSchema.js";
import ExtractRelativeFilePath from "../utils/ExtractRelativePath.js";

// REGISTER USER
// METHOD : POST
// ENDPOINT: /api/:userID/create-blog
const HandleCreateBlog = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const { title, description, tags } = req.body;
    const featuredImage = req.files?.featuredImage?.[0];
    console.log(req.files?.featuredImage?.[0]); // ✅ First uploaded file

    if (!featuredImage) {
      return res.status(400).json({ message: "Featured image is required" });
    }

    const relativePath = ExtractRelativeFilePath(featuredImage);

    const newBlog = new BlogModel({
      title,
      description,
      featuredImage: relativePath,
      tags,
      createdBy: userID,
    });

    await newBlog.save();

    invalidateCacheGroup("blogs", userID);

    res.status(201).json({
      message: "Blog Created Successfully",
        blog: newBlog,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL USERS
// METHOD : GET
// ENDPOINT: /api/user/get-users?search[firstName]=john (WITH PAGINATION & FILTER)
const HandleGetAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || {};
    const matchStage = SearchQuery(search);

    const pipeline = [];

    if (matchStage) pipeline.push(matchStage);
    pipeline.push({ $sort: { companyCode: -1 } });

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const users = await UserModel.aggregate(pipeline);

    const countPipeline = [];
    if (matchStage) countPipeline.push(matchStage);
    countPipeline.push({ $count: "totalItems" });

    const countResult = await UserModel.aggregate(countPipeline);
    const totalItems = countResult.length > 0 ? countResult[0].totalItems : 0;
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      users,
      meta: {
        totalItems,
        totalPages,
        page,
        limit,
      },
    });
  } catch (err) {
    console.log(err, "--------");
    next(err);
  }
};

export { HandleCreateBlog, HandleGetAllUsers };
