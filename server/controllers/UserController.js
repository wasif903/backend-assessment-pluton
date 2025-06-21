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

// REGISTER USER
// METHOD : POST
// ENDPOINT: /api/user/register-user
const HandleRegisterUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const { email } = normalizeFields(req.body, ["email"]);
        const existingUser =
            (await AdminModel.findOne({
                $or: [{ username }, { email }],
            })) ||
            (await UserModel.findOne({
                $or: [{ username }, { email }],
            }));
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Username or email already taken" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        newUser.refreshToken = refreshToken;
        await newUser.save();

        invalidateCacheGroup("get-users", "all")

        const userDetails = {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            _id: newUser._id,
        };

        // Return tokens
        res.status(201).json({
            message: "User registered successfully",
            accessToken,
            refreshToken,
            user: userDetails,
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


export { HandleRegisterUser, HandleGetAllUsers }