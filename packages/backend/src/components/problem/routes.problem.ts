import { Router } from "express";
import validate from "../../middleware/validate";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  problemGetSchema,
  problemPutSchema,
  problemsDeleteByFileKeysSchema,
  problemsGetSchema,
  problemsPostSchema,
} from "./types.problem";
import problemController from "./controller.problem";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.get("/:problemId", validate(problemGetSchema), problemController.get);
router.put("/:problemId", validate(problemPutSchema), problemController.put);

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
