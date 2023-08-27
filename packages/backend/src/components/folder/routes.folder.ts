import { Router } from "express";
import folderController from "./controller.folder";
import validate from "../../middleware/validate";
import {
  folderDeleteSchema,
  folderGetBaseChildrenSchema,
  folderGetParentsSchema,
  folderGetSchema,
  folderPostSchema,
  folderPutSchema,
} from "./types.folder";

const router = Router();

router.get(
  "/base/children",
  validate(folderGetBaseChildrenSchema),
  folderController.getBaseChildren
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
