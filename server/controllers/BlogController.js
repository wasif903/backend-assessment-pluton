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

// CREATE BLOG
// METHOD : POST
// ENDPOINT: /api/blog/:userID/create-blog
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

    invalidateCacheGroup("get-blogs", "all");

    res.status(201).json({
      message: "Blog Created Successfully",
      blog: newBlog,
    });
  } catch (err) {
    next(err);
  }
};

// EDIT BLOG
// METHOD : POST
// ENDPOINT: /api/blog/:userID/edit-blog/:blogID
const HandleEditBlog = async (req, res, next) => {
  try {
    const { userID, blogID } = req.params;
    const { title, description, tags } = req.body;
    const featuredImage = req.files?.featuredImage?.[0];

    let normalizedTags = tags;
    if (typeof tags === "string") {
      normalizedTags = [tags];
    }

    const findUser = await UserModel.findById(userID);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const findBlog = await BlogModel.findOne({
      _id: blogID,
      createdBy: userID,
    });

    if (!findBlog) {
      return res.status(404).json({ message: "Invalid Request" });
    }

    if (title) findBlog.title = title;
    if (description) findBlog.description = description;
    if (normalizedTags) findBlog.tags = normalizedTags;

    if (featuredImage) {
      const relativePath = ExtractRelativeFilePath(featuredImage);
      findBlog.featuredImage = relativePath;
    }

    await findBlog.save();

    invalidateCacheGroup("get-blogs", "all");

    res.status(200).json({
      message: "Blog updated successfully",
      blog: findBlog,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE BLOG
// METHOD : POST
// ENDPOINT: /api/blog/:userID/edit-blog/:blogID
const HandleDeleteBlog = async (req, res, next) => {
  try {
    const { userID, blogID } = req.params;

    const findUser = await UserModel.findById(userID);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const findBlog = await BlogModel.findOne({
      _id: blogID,
      createdBy: userID,
    });

    if (!findBlog) {
      return res.status(404).json({ message: "Blog not found or unauthorized" });
    }

    await BlogModel.deleteOne({ _id: blogID });

    invalidateCacheGroup("get-blogs", "all");

    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL BLOGS
// METHOD : GET
// ENDPOINT: /api/blog/get-blogs?search[title]=Test (WITH PAGINATION & FILTER)
const HandleGetAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || {};
    const matchStage = SearchQuery(search);

    const pipeline = [];
    if (matchStage) pipeline.push(matchStage);
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdByDetails",
        },
      },
      { $unwind: "$createdByDetails" },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          featuredImage: 1,
          tags: 1,
          createdAt: 1,
          updatedAt: 1,
          createdBy: 1,
          createdByName: "$createdByDetails.username",
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    const blogs = await BlogModel.aggregate(pipeline);

    const countPipeline = [];
    if (matchStage) countPipeline.push(matchStage);
    countPipeline.push({ $count: "totalItems" });

    const countResult = await BlogModel.aggregate(countPipeline);
    const totalItems = countResult.length > 0 ? countResult[0].totalItems : 0;
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      blogs,
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



export { HandleCreateBlog, HandleGetAllBlogs, HandleEditBlog, HandleDeleteBlog };
