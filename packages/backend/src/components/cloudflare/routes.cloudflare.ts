import { Router } from "express";
import validate from "../../middleware/validate";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

import cloudflareController from "./controller.cloudflare";
import {
  cloudflareDeleteObjectsSchema,
  cloudflareGetUploadUrlsSchema,
} from "./types.cloudflare";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.post(
  "/uploadUrls",
  validate(cloudflareGetUploadUrlsSchema),
  cloudflareController.getUploadUrls
);
router.delete(
  "/files",
  validate(cloudflareDeleteObjectsSchema),
  cloudflareController.deleteObjects
);

export default router;
