import { Router } from "express";
const router = Router();
import folderController from "./controller.folder";

router.get("/:id", folderController.get);
router.get("/parents/:id", folderController.getParents);
router.post("/", folderController.post);
router.put("/:id", folderController.put);
router.delete("/:id", (req, res, next) => {});

export default router;
