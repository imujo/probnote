import { ErrorResponse } from "@probnote/backend/src/globalTypes";
import { ExerciseNotePost } from "@probnote/backend/src/components/exerciseNote/types.exerciseNote";
import env from "@/config/env.config";
import { GetToken } from "@clerk/types";
import ResponseError from "utils/ResponseError";
import { FolderId } from "utils/types.global";

export const postExerciseNote = async (
  label: string,
  parentFolderId: FolderId,
  getAuthToken: GetToken,
) => {
  const response = await fetch(`${env.NEXT_PUBLIC_SERVER}/exerciseNote`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAuthToken()}`,
    },
    body: JSON.stringify({
      label,
      parentFolderId:
        parentFolderId === null ? null : parseFloat(parentFolderId.toString()),
    }),
    cache: "no-store",
  });

  const responseJson = await response.json();
  const data = responseJson as ExerciseNotePost;

  if (!response.ok) {
    const error = responseJson as ErrorResponse;
    throw new ResponseError(error.message, response.status);
  }

  return data;
};
