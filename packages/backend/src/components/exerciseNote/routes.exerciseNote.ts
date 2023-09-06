import { Router } from "express";
import validate from "../../middleware/validate";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { exerciseNotePostSchema } from "./types.exerciseNote";
import exerciseNoteController from "./controller.exerciseNote";
import { generateMultipleSignedUploadUrls } from "../../utils/upload";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.post("/", validate(exerciseNotePostSchema), exerciseNoteController.post);

router.post("/upload", async (req, res) => {
  const signedUrls = await generateMultipleSignedUploadUrls([
    "fileA.jpg",
    "fileB.jpg",
    "fileC.jpg",
    "fileD.jpg",
  ]);

  res.json(signedUrls);
});

export default router;
