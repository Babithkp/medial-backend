import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface User {
  id: string;
  fistName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  createdAt: Date;
}

export const createUser = async (req: Request, res: Response) => {
  const userData: User = req.body;
  if (!userData) res.status(401).json({ error: "Invalid User data provided" });


  try {
    const isExist = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    })

    if (isExist) {
      res.status(201).json({ error: "User already exist" });
      return
    }


    const response = await prisma.user.create({
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
  } catch (e) {
    console.log(e);
  }
};


export const createPost = async (req: Request, res: Response) => {
  const postData = req.body;
  if (!postData) res.status(401).json({ error: "Invalid Post data provided" });
  if(!postData.userId) res.status(402).json({ error: "userId is required" });
  try{
    const response = await prisma.post.create({
      data: {
        pod: postData.pod,
        image: postData.imageUrl,
        caption: postData.postText,
        User:{
          connect:{
            id: postData.userId
          }
        }
      } 
    })
    if(!response) {
      res.status(400).json({ error: "Failed to create Post" });
      return
    }
    res.status(200).json({
      message: "Post created successfully",
    });

  }catch(er){
    console.log(er);
    
  }
}
