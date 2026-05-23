import express, {
  type Application,
  type ErrorRequestHandler,
  type Request,
  type Response,
} from "express";
import { authRoute } from "./modules/auth/auth.router";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth/", authRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to DevPulse",
  });
});

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err,
  });
};
app.use(globalErrorHandler);
export default app;
