import bodyParser from "body-parser";
import express from "express";
import env from "./config/envConfig";
import folderRoutes from "./components/folder/routes.folder";
import errorMiddleware from "./middleware/error.middleware";

const app = express();
const port = env.PORT;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("yey");
});

app.use("/folder", folderRoutes);

app.use(errorMiddleware);

app.listen(parseInt(port, 10), "0.0.0.0", () => {
  console.log(`Probnote listening on port ${port}`);
});
