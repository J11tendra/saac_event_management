export type ApprovalStatus = "pending" | "accepted" | "rejected";
export type UserRole = "club" | "admin";

export interface Club {
  id: string;
  created_at?: string;
  club_name: string;
  club_email: string;
}

export interface Admin {
  id: string;
  created_at?: string;
  name: string;
  email_id: string;
}

export interface EventDatePreference {
  id: string;
  created_at?: string;
  event_id?: string;
  date: string;
  start_time: string;
  end_time: string;
  proposer_role?: UserRole | string;
}

export interface BudgetRequest {
  budget_amt: number;
  purpose: string;
  approved_budget: number | null;
  event_id: string;
  approval_date: string | null;
  approval_comments: string | null;
}

export interface EventReview {
  id: string;
  created_at: string;
  event_id?: string;
  admin_id: string | null;
  club_id: string | null;
  comment: string;
  admin?: Admin | null;
  club?: Club | null;
}

// Event with all related data (used in queries)
export interface Event {
  id: string;
  created_at: string;
  club_id?: string;
  event_name: string;
  event_descriptions: string;
  approval_status: ApprovalStatus | string;
  accepted_date_preference_id: string | null;
  approval_date: string | null;
  event_date_preference: EventDatePreference[];
  budget_request: BudgetRequest | null;
  event_review?: EventReview[];
}

export interface CreateEventData {
  club_id: string;
  event_name: string;
  event_descriptions: string;
  datePreferences: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  budgetAmount?: string;
  budgetPurpose?: string;
}

export interface Collaborator {
  id: string;
  created_at: string;
  club_id: string;
  event_id: string;
}

export interface Treasurer {
  id: string;
  student_id: string;
  student_name: string;
  account_holder_name: string;
  account_number: string;
  bank_name: string;
  branch_name: string;
  ifsc_code: string;
  club_id: string;
}

export interface Reimbursement {
  created_at: string;
  id: string;
  treasurer_id: string;
}

export interface Reimbursees {
  id: string;
  created_at: string;
  student_id: string;
  student_name: string;
  reimbursement_id: string;
}

export interface Items {
  id: string;
  created_at: string;
  name: string;
  amount: number;
  reimbursement_id: string;
}
