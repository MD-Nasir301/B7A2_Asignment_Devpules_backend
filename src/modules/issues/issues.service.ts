import { db } from "../../db";
import type { IIssueFilters, IIssuesInput } from "./issues.interface";

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

const getIssueByIdFromDB = async (id: string) => {
  const result = await db.query(`SELECT * FROM issues WHERE id = $1;`, [id]);
  return result.rows[0];
};

export const issuesService = {
  createIssueInDB,
  getAllIssuesFromDB,
  getIssueByIdFromDB,
};
