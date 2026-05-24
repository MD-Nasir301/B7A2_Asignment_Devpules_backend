import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import type { IIssueFilters } from "./issues.interface";
import { db } from "../../db";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;
    const reporter_id = req.user?.id;

    if (!reporter_id) {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized to create issue",
      });
      return;
    }
    const issue = await issuesService.createIssueInDB({
      title,
      description,
      type,
      reporter_id,
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create issue";
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: errorMessage,
      data: error,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const filters = {
      sort: req.query.sort as "newest" | "oldest",
      type: req.query.type as "bug" | "feature_request",
      status: req.query.status as "open" | "in_progress" | "resolved",
    };

    const issues = await issuesService.getAllIssuesFromDB(filters);

    if (issues.length > 0) {
      const reporterIds = issues.map((issue) => issue.reporter_id);
      const reporterUniqeIds = [...new Set(reporterIds)];

      const result = await db.query(
        `
        SELECT * FROM users WHERE id = ANY($1)
        `,
        [reporterUniqeIds],
      );
      const users = result.rows;

      const issuesWithReporter = issues.map((issue) => {
        const reporter = users.find((u) => u.id === issue.reporter_id);

        return {
          id: issue.id,
          title: issue.title,
          description: issue.description,
          type: issue.type,
          status: issue.status,
          reporter: reporter
            ? {
                id: reporter.id,
                name: reporter.name,
                role: reporter.role,
              }
            : null,
          created_at: issue.created_at,
          updated_at: issue.updated_at,
        };
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        data: issuesWithReporter,
      });
      return;
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "No issues found",
      data: [],
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch issues";
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: errorMessage,
      data: error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const issueId = req.params.id;
    const issue = await issuesService.getSingleIssueFromDB(issueId as string);

    if (!issue) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
      return;
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: issue,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch issue";
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: errorMessage,
      data: error,
    });
  }
};

export const issueController = {
  getAllIssues,
  createIssue,
   getSingleIssue,
};
