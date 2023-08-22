import { Router } from "express";
import folderController from "./controller.folder";
import validate from "../../middleware/validate";
import {
  folderDeleteSchema,
  folderGetBaseSchema,
  folderGetParentsSchema,
  folderGetSchema,
  folderPostSchema,
  folderPutSchema,
} from "./types.folder";

const router = Router();

router.get("/base", validate(folderGetBaseSchema), folderController.getBase);
router.get("/:id", validate(folderGetSchema), folderController.get);
router.get(
  "/parents/:id",
  validate(folderGetParentsSchema),
  folderController.getParents
);
router.post("/", validate(folderPostSchema), folderController.post);
router.put("/:id", validate(folderPutSchema), folderController.put);
router.delete("/:id", validate(folderDeleteSchema), folderController.del);

export default router;
