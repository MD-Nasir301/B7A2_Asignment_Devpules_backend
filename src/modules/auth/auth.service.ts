import bcrypt from "bcryptjs";
import { db } from "../../db";
import type { ILogingInput, IRegisterInput } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

const registerUserIntoDB = async (payload: IRegisterInput) => {
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

const loginUserFromDB = async (payload: ILogingInput) => {
  const { email, password } = payload;

  const result = await db.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email],
  );

  if (result.rows[0].length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Wrong Password, try again");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: config.jwt_expires_in as `${number}d`,
  });

  delete result.rows[0].password;
  return { result, token };
};

export const authService = {
  registerUserIntoDB,
  loginUserFromDB,
};
