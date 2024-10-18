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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPostFile = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;
if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error("AWS_REGION and AWS_ACCESS_ KEY must be specified");
}
const s3 = new client_s3_1.S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
const uploadFileToS3 = (fileBuffer, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: bucketName,
        Key: `medial/posts/${Date.now().toString()}_${fileName}`,
        Body: fileBuffer,
    };
    try {
        const uploadParallel = new lib_storage_1.Upload({
            client: s3,
            queueSize: 4,
            partSize: 5 * 1024 * 1024,
            leavePartsOnError: false,
            params,
        });
        const result = yield uploadParallel.done();
        if (result)
            return result;
    }
    catch (e) {
        console.log(e);
    }
});
const uploadPostFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const form = (0, formidable_1.default)();
    const [fields, files] = yield form.parse(req);
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
    fs_1.default.readFile(path, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error(err);
            return;
        }
        const buffer = Buffer.from(data);
        if (buffer && myFile) {
            const path = myFile[0].originalFilename;
            const response = yield uploadFileToS3(buffer, path);
            if (response) {
                res.status(200).json({
                    message: "File uploaded to S3 successfully",
                    data: response.Location,
                });
            }
            else {
                res.status(500).json({ error: "Failed to upload file to S3" });
            }
        }
    }));
});
exports.uploadPostFile = uploadPostFile;
