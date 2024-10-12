import dotenv from "dotenv";
import { Request, Response } from "express";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

dotenv.config();

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error("AWS_REGION and AWS_ACCESS_ KEY must be specified");
}

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  }
});



export const uploadPostFile = async (req: Request, res: Response) => {
  const files = req.file;
  if (!files) {
    res.status(400).json({ error: "File not found" });
    return;
  }

  const params = {
    Bucket: bucketName,
    Key: `${Date.now().toString()}_${files.originalname}`,
    Body: files.buffer,
  };

  try {
    const uploadParallel = new Upload({
      client: s3,
      queueSize: 4,
      partSize: 5 * 1024 * 1024,
      leavePartsOnError: false,
      params,
    });

    uploadParallel.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });

    const result = await uploadParallel.done();
    if (result) {
      res
        .status(200)
        .json({ message: "File uploaded successfully", data: result.Location });
    }
  } catch (e) {
    console.log(e);
  }
};
