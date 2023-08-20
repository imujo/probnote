import { Router } from "express";
const router = Router();
import folderController from "./controller.folder";

router.get("/:id", folderController.get);
router.post("/", (req, res, next) => {});
router.put("/:id", (req, res, next) => {});
router.delete("/:id", (req, res, next) => {});

export default router;
