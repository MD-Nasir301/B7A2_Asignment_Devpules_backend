import express, { type Request, type Response } from "express";
import config from "./config/index";
import { initDB } from "./db";
import app from "./app";

const main = () => {
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
};
initDB();
main();
