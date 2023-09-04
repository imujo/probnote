import "dotenv/config";
import { Router } from "express";
import folderItemController from "./controller.folderItem";
import validate from "../../middleware/validate";
import {
  folderItemDeleteSchema,
  folderItemsGetSchema,
  folderItemPutSchema,
} from "./types.folderItem";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.use(ClerkExpressRequireAuth());

router.get(
  "/:parentFolderId",
  validate(folderItemsGetSchema),
  folderItemController.get
);
router.put(
  "/:folderItemId",
  validate(folderItemPutSchema),
  folderItemController.put
);
router.delete(
  "/:folderItemId",
  validate(folderItemDeleteSchema),
  folderItemController.del
);

export default router;
