import { Router } from "express";
import validate from "../../middleware/validate";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import regularNoteController from "./controller.regularNote";
import {
  regularNoteGetSchema,
  regularNotePostSchema,
  regularNotePutSchema,
} from "./types.regularNote";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.get(
  "/:regularNoteId",
  validate(regularNoteGetSchema),
  regularNoteController.get
);
router.post("/", validate(regularNotePostSchema), regularNoteController.post);
router.put(
  "/:regularNoteId",
  validate(regularNotePutSchema),
  regularNoteController.put
);

export default router;
