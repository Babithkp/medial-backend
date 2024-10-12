"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userControler_1 = require("./controller/userControler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.json({ message: "Server started" });
});
app.post('/api/v1/addNewUser', userControler_1.createUser);
app.post('/api/v1/addNewPost', userControler_1.createPost);
app.get("/api/v1/getAllPost", userControler_1.getAllPostData);
app.listen(3000, () => {
    console.log("Server started listening on port " + 3000);
});
