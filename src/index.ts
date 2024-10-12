import express from "express";
import cors from "cors";
import { createPost, createUser, getAllPostData } from "./controller/userControler";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



app.get("/", (req, res) => {
  res.json({ message: "Server started" });
});

app.post('/api/v1/addNewUser', createUser);

app.post('/api/v1/addNewPost', createPost)

app.get("/api/v1/getAllPost", getAllPostData)

app.listen(3000, () => {
  console.log("Server started listening on port " + 3000);
});
