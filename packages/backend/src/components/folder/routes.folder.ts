import { Router } from "express";
import folderController from "./controller.folder";
import validate from "../../middleware/validate";
import {
  folderGetParentsSchema,
  folderGetPinnedSchema,
  folderPostSchema,
  folderPutSchema,
} from "./types.folder";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.get(
  "/pinned",
  validate(folderGetPinnedSchema),
  folderController.getPinned
);
router.get(
  "/parents/:folderId",
  validate(folderGetParentsSchema),
  folderController.getParents
);
router.post("/", validate(folderPostSchema), folderController.post);
router.put("/:folderId", validate(folderPutSchema), folderController.put);

export default router;
