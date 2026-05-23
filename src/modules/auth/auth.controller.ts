import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";
import type { IUser } from "./auth.interface";

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "User registration failed";
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: message,
      data: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { result, token } = await authService.loginUserFromDB(req.body);
    const user = result.rows[0];

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: { token, user },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login Failed";
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: message,
      data: error,
    });
  }
};

export const authController = {
  registerUser,
  loginUser,
};
