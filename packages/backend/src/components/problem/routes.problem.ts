import { Router } from "express";
import validate from "../../middleware/validate";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  problemsDeleteByFileKeysSchema,
  problemsPostSchema,
} from "./types.problem";
import problemController from "./controller.problem";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.post("/", validate(problemsPostSchema), problemController.postMultiple);
router.delete(
  "/byFileKeys",
  validate(problemsDeleteByFileKeysSchema),
  problemController.deleteMultipleByFileKeys
);

export default router;
