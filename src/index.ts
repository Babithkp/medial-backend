import express from "express";import cors from "cors";
import multer from "multer";
import {
  createPost,
  createUser,
  getAllPostData,
} from "./controller/userController";
import { uploadPostFile } from "./controller/fileUploadsController";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });


app.get("/", (req, res) => {
  res.json({ message: "Server started" });
});


app.post("/api/v1/addNewUser", createUser);
app.post("/api/v1/addNewPost", createPost);
app.post("/api/v1/uploadPostFile",upload.single('file'),uploadPostFile);

app.get("/api/v1/getAllPost", getAllPostData);

app.listen(3000, () => {
  console.log("Server started listening on port " + 3000);
});
