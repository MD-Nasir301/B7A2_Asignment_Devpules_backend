import bcrypt from "bcryptjs";
import { db } from "../../db";
import type { IUser } from "./auth.interface";

const registerUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role = "contributor" } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(
    `
    INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *
    `,
    [name, email, hashedPassword, role],
  );

  delete result.rows[0].password;
  return result;
};

export const authService = {
  registerUserIntoDB,
};
