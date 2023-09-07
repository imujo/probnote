import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import CloudFlareClient from "../../config/cloudflare.config";
import env from "../../config/env.config";

const EXPIERS_IN = 3600;
export type SignedUploadUrl = {
  signedUploadUrl: string;
  fileKey: string;
};

export const generateSingedUploadUrl = async (
  fileName: string,
  uniqeString?: string
) => {
  const unique = uniqeString || new Date().getTime().toString();
  const fileKey = unique + fileName;

  const url = await getSignedUrl(
    CloudFlareClient,
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: fileKey,
    }),
    { expiresIn: EXPIERS_IN }
  );

  return {
    signedUploadUrl: url,
    fileKey,
  };
};

export const deleteCloudflareObjects = async (fileKeys: string[]) => {
  return await CloudFlareClient.send(
    new DeleteObjectsCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Delete: {
        Objects: fileKeys.map((fileKey) => ({
          Key: fileKey,
        })),
      },
    })
  );
};

export const generateMultipleSignedUploadUrls = async (fileNames: string[]) => {
  let data: { [key: string]: SignedUploadUrl } | null = null;
  const date = new Date().getTime();

  for (let i = 0; i < fileNames.length; i++) {
    const fileName = fileNames[i];
    if (!data) data = {};
    data[fileName] = await generateSingedUploadUrl(fileName, `${date + i}`);
  }

  return data;
};
