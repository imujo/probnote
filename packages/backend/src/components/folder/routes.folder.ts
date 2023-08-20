import { Router } from "express";
const router = Router();
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

router.get("/base", validate(folderGetBaseSchema), folderController.getBase);
router.get(
  "/parents/:id",
  validate(folderGetParentsSchema),
  folderController.getParents
);
router.get("/:id", validate(folderGetSchema), folderController.get);
router.post("/", validate(folderPostSchema), folderController.post);
router.put("/:id", validate(folderPutSchema), folderController.put);
router.delete("/:id", validate(folderDeleteSchema), folderController.del);

export default router;
