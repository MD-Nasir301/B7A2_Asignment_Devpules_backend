import { runInNewContext } from "vm";
import { db } from "../../db";
import type {
  IIssueFilters,
  IIssuesInput,
  IIssueUpdate,
} from "./issues.interface";

export async function createIssueInDB(payload: IIssuesInput) {
  const { title, description, type } = payload;

  const reporter_id = payload.reporter_id;

  const result = await db.query(
    `
    INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *
     `,
    [title, description, type, reporter_id],
  );

  return result.rows[0];
}

const getAllIssuesFromDB = async (filters: IIssueFilters) => {
  const { sort = "newest", type, status } = filters;

  let query = `SELECT * FROM issues WHERE 1=1`;
  const values = [];
  let counter = 1;

  if (type) {
    query += ` AND type = $${counter}`;
    values.push(type);
    counter++;
  }

  if (status) {
    query += ` AND status = $${counter}`;
    values.push(status);
    counter++;
  }

  if (sort === "newest") {
    query += ` ORDER BY created_at DESC`;
  } else if (sort === "oldest") {
    query += ` ORDER BY created_at ASC`;
  }

  const result = await db.query(query, values);
  return result.rows;
};

const getSingleIssueFromDB = async (id: string) => {
  const result = await db.query(`SELECT * FROM issues WHERE id = $1;`, [id]);
  const issue = result.rows[0];

  if (!issue) {
    return null;
  }

  const reporterDetails = await db.query(`SELECT * FROM users WHERE id = $1;`, [
    issue.reporter_id,
  ]);
  const reporter = reporterDetails.rows[0];

  const issueWithReporter = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: {
      id: reporter?.id ?? "Reporter ID Not Found in Database",
      name: reporter?.name ?? "Unknown Reporter",
      role: reporter?.role ?? "Unknown Role",
    },
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
  return issueWithReporter;
};

const updateIssueInDB = async (id: string, payload: IIssueUpdate) => {
  const { title, description, type } = payload;

  const query = `
      UPDATE issues 
      SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description), 
      type = COALESCE($3, type),
      updated_at = NOW()
      WHERE id = $4 RETURNING *;
`;
  const values = [title, description, type, id];
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteIssueFromDB = async (id: string) => {
  const result = await db.query(
    `DELETE FROM issues WHERE id = $1 RETURNING *;`,
    [id],
  );
  return result.rows[0];
};

export const issuesService = {
  createIssueInDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
  deleteIssueFromDB
};
