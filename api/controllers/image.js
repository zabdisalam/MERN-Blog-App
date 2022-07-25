import dotenv from "dotenv";
dotenv.config();
import S3 from "aws-sdk/clients/s3.js";
import fs from "fs";

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  bucketRegion,
  accessKeyId,
  secretAccessKey,
});

export const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};

// downloads a file from s3
export const getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
};

export const deleteFile = (fileKey) => {
  const deleteParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  s3.deleteObject(deleteParams, (err, data) => {
    if (err) return err;
    return data;
  });
};
