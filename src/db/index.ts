import pg from "pg";
import config from "../config";

const { Pool } = pg;

export const db = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
  try {
    await db.query("SELECT NOW()");
    console.log("Database Connected successfully ");
  } catch (error) {
    console.error("Database not connected", error);
  }
};
