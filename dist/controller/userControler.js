"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPostData = exports.createPost = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    if (!userData)
        res.status(401).json({ error: "Invalid User data provided" });
    try {
        const isExist = yield prisma.user.findUnique({
            where: {
                email: userData.email,
            },
        });
        if (isExist) {
            res.status(201).json({ error: "User already exist" });
            return;
        }
        const response = yield prisma.user.create({
            data: {
                id: userData.id,
                fistName: userData.fistName,
                lastName: userData.lastName,
                email: userData.email,
                imageUrl: userData.imageUrl,
                createdAt: userData.createdAt,
            },
        });
        if (response) {
            console.log(response);
            res.status(200).json({
                message: "User created successfully",
            });
        }
    }
    catch (e) {
        console.log(e);
    }
});
exports.createUser = createUser;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postData = req.body;
    if (!postData)
        res.status(401).json({ error: "Invalid Post data provided" });
    if (!postData.userId)
        res.status(402).json({ error: "userId is required" });
    try {
        const response = yield prisma.post.create({
            data: {
                pod: postData.pod,
                image: postData.imageUrl,
                caption: postData.postText,
                User: {
                    connect: {
                        id: postData.userId
                    }
                }
            }
        });
        if (!response) {
            res.status(400).json({ error: "Failed to create Post" });
            return;
        }
        res.status(200).json({
            message: "Post created successfully",
        });
    }
    catch (er) {
        console.log(er);
    }
});
exports.createPost = createPost;
const getAllPostData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma.post.findMany();
        if (response) {
            res.status(200).json(response);
        }
        else {
            res.status(400).json({ error: "Failed to get Post" });
        }
    }
    catch (e) {
        console.log(e);
    }
});
exports.getAllPostData = getAllPostData;
