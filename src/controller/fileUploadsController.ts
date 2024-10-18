import dotenv from "dotenv";import { Request, Response } from "express";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import formidable, { errors as formidableErrors } from "formidable";
import fs from "fs";

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
  },
});

const uploadFileToS3 = async (fileBuffer: Buffer, fileName: string) => {
  const params = {
    Bucket: bucketName,
    Key: `medial/posts/${Date.now().toString()}_${fileName}`,
    Body: fileBuffer,
  };

  try {
    const uploadParallel = new Upload({
      client: s3,
      queueSize: 4,
      partSize: 5 * 1024 * 1024,
      leavePartsOnError: false,
      params,
    });

    const result = await uploadParallel.done();
    if (result) return result;
  } catch (e) {
    console.log(e);
  }
};



export const uploadPostFile = async (req: Request, res: Response) => {
  const form = formidable();
  const [fields, files] = await form.parse(req);
  if (!files) {
    res.status(400).json({ error: "File not found" });
    return;
  }
  const myFile = files.file;
  if (!myFile) {
    res.status(400).json({ error: "File not found" });
    return;
  }
  const path = myFile[0].filepath;
  fs.readFile(path, async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const buffer = Buffer.from(data);

    if (buffer && myFile) {
      const path = myFile[0].originalFilename;
      const response = await uploadFileToS3(buffer, path as string);
      if (response) {
        res.status(200).json({
          message: "File uploaded to S3 successfully",
          data: response.Location,
        });
      } else {
        res.status(500).json({ error: "Failed to upload file to S3" });
      }
    }
  });
};
