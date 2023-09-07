import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import env from "@/config/env.config";
import { GetToken } from "@clerk/types";
import ResponseError from "utils/ResponseError";
import {
  CloudflareDeleteObjects,
  CloudflareGetUploadUrls,
} from "@probnote/backend/src/components/cloudflare/types.cloudflare";

export const getUploadUrls = async (
  fileNames: string[],
  getAuthToken: GetToken,
) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_SERVER}/cloudflare/uploadUrls`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({
        fileNames,
      }),
      cache: "no-store",
    },
  );

  const responseJson = await response.json();
  const data = responseJson as CloudflareGetUploadUrls;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};

export const deleteCloudflareFiles = async (
  fileKeys: string[],
  getAuthToken: GetToken,
) => {
  const response = await fetch(`${env.NEXT_PUBLIC_SERVER}/cloudflare/files`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAuthToken()}`,
    },
    body: JSON.stringify({
      fileKeys: fileKeys,
    }),
    cache: "no-store",
  });

  const responseJson = await response.json();
  const data = responseJson as CloudflareDeleteObjects;

  console.log(data);

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};
