import express from "express";
import env from "./config/envConfig";
import folderRoutes from "./components/folder/routes.folder";

const app = express();
const port = env.PORT;
app.get("/", (req, res) => {
  res.send("yey");
});

app.use("/folder", folderRoutes);

app.listen(parseInt(port), "0.0.0.0", () => {
  console.log(`Probnote listening on port ${port}`);
});
