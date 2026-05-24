import Router from "express";
import { issueController } from "./issues.controller";
import { authGuard } from "../../middlewares/auth";

const router = Router();

router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.post("/", authGuard, issueController.createIssue);
router.patch("/:id", authGuard, issueController.updateIssue);
router.delete("/:id", authGuard, issueController.deleteIssue);

export const issuesRoute = router;
