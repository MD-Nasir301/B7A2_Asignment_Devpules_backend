import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  connection_string: process.env.CONNECTIONSTRING,
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
};
