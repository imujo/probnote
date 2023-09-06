import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import env from "./config/env.config";
import folderRoutes from "./components/folder/routes.folder";
import folderItemRoutes from "./components/folderItem/routes.folderItem";
import exerciseNoteRoutes from "./components/exerciseNote/routes.exerciseNote";
import problemRoutes from "./components/problem/routes.problem";
import errorMiddleware from "./middleware/error.middleware";
import { StrictAuthProp } from "@clerk/clerk-sdk-node";

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

const app = express();
const port = env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("yey");
});

app.use("/folder", folderRoutes);
app.use("/folderItem", folderItemRoutes);
app.use("/exerciseNote", exerciseNoteRoutes);
app.use("/problem", problemRoutes);

app.use(errorMiddleware);

app.listen(parseInt(port, 10), "0.0.0.0", () => {
  console.log(`Probnote listening on port ${port}`);
});
