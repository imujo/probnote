import { Router } from "express";
import validate from "../../middleware/validate";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  problemsDeleteByFileKeysSchema,
  problemsGetSchema,
  problemsPostSchema,
} from "./types.problem";
import problemController from "./controller.problem";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.get(
  "/multiple/:exerciseNoteId",
  validate(problemsGetSchema),
  problemController.getMultiple
);
router.post("/", validate(problemsPostSchema), problemController.postMultiple);
router.delete(
  "/byFileKeys",
  validate(problemsDeleteByFileKeysSchema),
  problemController.deleteMultipleByFileKeys
);

export default router;
