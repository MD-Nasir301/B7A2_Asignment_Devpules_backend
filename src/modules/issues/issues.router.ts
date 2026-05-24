import Router from "express";
import { issueController } from "./issues.controller";
import { authGuard } from "../../middlewares/auth";

const router = Router();

router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.post("/", authGuard, issueController.createIssue);

export const issuesRoute = router;
