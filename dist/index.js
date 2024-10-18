"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const userController_1 = require("./controller/userController");
const fileUploadsController_1 = require("./controller/fileUploadsController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
app.get("/", (req, res) => {
    console.log("server started");
    res.json({ message: "Server started" });
});
app.post("/api/v1/addNewUser", userController_1.createUser);
app.post("/api/v1/addNewPost", userController_1.createPost);
app.post("/api/v1/uploadPostFile", upload.single('file'), fileUploadsController_1.uploadPostFile);
app.post("/api/v1/getPostFile", fileUploadsController_1.getPostFile);
app.get("/api/v1/getAllPost", userController_1.getAllPostData);
app.listen(3000, () => {
    console.log("Server started listening on port " + 3000);
});
