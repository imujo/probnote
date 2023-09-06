import { NextFunction } from "express";
import messages from "../../messages";
import {
  ExerciseNotePostRequest,
  ExerciseNotePostResposne,
} from "./types.exerciseNote";
import { postExerciseNote } from "./service.exerciseNote";

const post = async (
  req: ExerciseNotePostRequest,
  res: ExerciseNotePostResposne,
  next: NextFunction
) => {
  try {
    const { userId } = req.auth;
    const { label, parentFolderId } = req.body;

    const exerciseNote = await postExerciseNote(label, parentFolderId, userId);

    res.status(200).json({
      message: messages.getSuccess("Exercise note"),
      data: {
        exerciseNoteId: exerciseNote.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  post,
};
