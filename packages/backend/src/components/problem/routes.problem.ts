import { Router } from "express";
import validate from "../../middleware/validate";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  cloudflareObjectsDeleteSchema,
  problemGetUploadUrlsSchema,
  problemsPostSchema,
} from "./types.problem";
import problemController from "./controller.problem";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.post("/", validate(problemsPostSchema), problemController.postMultiple);
router.post(
  "/uploadUrls",
  validate(problemGetUploadUrlsSchema),
  problemController.getUploadUrls
);

router.delete(
  "/files",
  validate(cloudflareObjectsDeleteSchema),
  problemController.deleteCloudflareObject
);

export default router;
