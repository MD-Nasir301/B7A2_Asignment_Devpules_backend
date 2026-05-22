import express, { type Request, type Response } from "express";
import config from "./config";
import { initDB } from "./db";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("DevPules Server is runing on port 5000");
});

const main = ()=>{
  app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
}
initDB()
main()



