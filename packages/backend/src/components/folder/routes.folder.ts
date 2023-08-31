import { Router } from "express";
import folderController from "./controller.folder";
import validate from "../../middleware/validate";
import {
  folderDeleteSchema,
  folderGetBaseChildrenSchema,
  folderGetParentsSchema,
  folderGetPinnedSchema,
  folderGetSchema,
  folderPostSchema,
  folderPutPinnedSchema,
  folderPutSchema,
} from "./types.folder";

const router = Router();

router.get(
  "/base/children",
  validate(folderGetBaseChildrenSchema),
  folderController.getBaseChildren
);
router.get("/pin", validate(folderGetPinnedSchema), folderController.getPinned);
router.put(
  "/pin/:id",
  validate(folderPutPinnedSchema),
  folderController.putPinned
);
router.get(
  "/:id/children",
  validate(folderGetSchema),
  folderController.getChildren
);
router.get(
  "/parents/:id",
  validate(folderGetParentsSchema),
  folderController.getParents
);
router.post("/", validate(folderPostSchema), folderController.post);
router.put("/:id", validate(folderPutSchema), folderController.put);
router.delete("/:id", validate(folderDeleteSchema), folderController.del);

export default router;
