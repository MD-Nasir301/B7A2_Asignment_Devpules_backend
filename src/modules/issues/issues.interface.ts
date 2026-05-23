export interface IIssuesInput {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  reporter_id: number;
}

export interface IIssue extends IIssuesInput {
  id: number;
  status: "open" | "in_progress" | "resolved";
  created_at: Date;
  updated_at: Date;
}

export interface IIssueFilters {
  sort?: 'newest' | 'oldest';
  type?: 'bug' | 'feature_request';
  status?: 'open' | 'in_progress' | 'resolved';
}
