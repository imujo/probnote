import { NextFunction } from "express";
import messages from "../../messages";
import {
  RegularNotePostRequest,
  RegularNotePostResposne,
  RegularNoteGetRequest,
  RegularNoteGetResposne,
  RegularNotePutRequest,
  RegularNotePutResposne,
} from "./types.regularNote";
import {
  getRegularNote,
  postRegularNote,
  putRegularNote,
} from "./service.regularNote";
import { Prisma } from "@prisma/client";
import CustomError from "../../utils/CustomError";

const get = async (
  req: RegularNoteGetRequest,
  res: RegularNoteGetResposne,
  next: NextFunction
) => {
  try {
    const regularNoteId = parseInt(req.params.regularNoteId);
    const { userId } = req.auth;

    const regularNote = await getRegularNote(regularNoteId, userId);

    if (!regularNote)
      throw new CustomError(messages.notFound("Regular note"), 404);

    res.status(200).json({
      message: messages.putSuccess("Regular note", regularNote.id),
      data: {
        id: regularNote.id,
        canvas: JSON.stringify(regularNote.canvas),
        parentFolderId: regularNote.Note.FolderItem.parentFolderId,
      },
    });
  } catch (error) {
    next(error);
  }
};

const post = async (
  req: RegularNotePostRequest,
  res: RegularNotePostResposne,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const { label, parentFolderId } = req.body;

    const regularNote = await postRegularNote(label, parentFolderId, userId);

    res.status(200).json({
      message: messages.getSuccess("Regular note"),
      data: {
        regularNoteId: regularNote.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const put = async (
  req: RegularNotePutRequest,
  res: RegularNotePutResposne,
  next: NextFunction
) => {
  try {
    const { canvas } = req.body;
    const regularNoteId = parseInt(req.params.regularNoteId);
    const { userId } = req.auth;

    const regularNote = await putRegularNote(
      regularNoteId,
      userId,
      canvas as Prisma.InputJsonObject
    );

    res.status(200).json({
      message: messages.putSuccess("Regular note", regularNote.id),
      data: {
        id: regularNote.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  get,
  post,
  put,
};
