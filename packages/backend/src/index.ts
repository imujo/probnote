import bodyParser from "body-parser";
import express from "express";
import env from "./config/envConfig";
import folderRoutes from "./components/folder/routes.folder";
import folderItemRoutes from "./components/folderItem/routes.folderItem";
import errorMiddleware from "./middleware/error.middleware";
import cors from "cors";

const app = express();
const port = env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("yey");
});

app.use("/folder", folderRoutes);
app.use("/folderItem", folderItemRoutes);

app.use(errorMiddleware);

app.listen(parseInt(port, 10), "0.0.0.0", () => {
  console.log(`Probnote listening on port ${port}`);
});
