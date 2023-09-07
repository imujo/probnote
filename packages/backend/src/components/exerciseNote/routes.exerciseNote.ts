import { Router } from "express";
import validate from "../../middleware/validate";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { exerciseNotePostSchema } from "./types.exerciseNote";
import exerciseNoteController from "./controller.exerciseNote";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.post("/", validate(exerciseNotePostSchema), exerciseNoteController.post);

export default router;
