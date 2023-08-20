import express from "express";
import env from "./config/envConfig";

const app = express();
const port = env.PORT;

app.listen(parseInt(port), "0.0.0.0", () => {
  console.log(`Probnote listening on port ${port}`);
});
