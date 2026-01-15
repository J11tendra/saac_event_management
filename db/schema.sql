-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE saac_thingy.admin (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  email_id text NOT NULL,
  CONSTRAINT admin_pkey PRIMARY KEY (id)
);
CREATE TABLE saac_thingy.budget_request (
  budget_amt numeric NOT NULL,
  purpose text NOT NULL,
  approved_budget numeric,
  event_id uuid NOT NULL DEFAULT gen_random_uuid(),
  approval_date date,
  approval_comments text,
  CONSTRAINT budget_request_pkey PRIMARY KEY (event_id),
  CONSTRAINT budget_request_event_id_fkey FOREIGN KEY (event_id) REFERENCES saac_thingy.event(id)
);
CREATE TABLE saac_thingy.club (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  club_name text NOT NULL UNIQUE,
  club_email text NOT NULL UNIQUE,
  CONSTRAINT club_pkey PRIMARY KEY (id)
);
CREATE TABLE saac_thingy.collaborator (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  club_id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  CONSTRAINT collaborator_pkey PRIMARY KEY (id),
  CONSTRAINT collaborator_club_id_fkey FOREIGN KEY (club_id) REFERENCES saac_thingy.club(id),
  CONSTRAINT collaborator_event_id_fkey FOREIGN KEY (event_id) REFERENCES saac_thingy.club(id)
);
CREATE TABLE saac_thingy.event (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  club_id uuid NOT NULL,
  event_name text NOT NULL,
  event_descriptions text NOT NULL,
  approval_status USER-DEFINED NOT NULL DEFAULT 'pending'::saac_thingy.approval_status,
  accepted_date_preference_id uuid UNIQUE,
  approval_date timestamp with time zone,
  CONSTRAINT event_pkey PRIMARY KEY (id),
  CONSTRAINT event_club_id_fkey FOREIGN KEY (club_id) REFERENCES saac_thingy.club(id),
  CONSTRAINT event_accepted_date_preference_id_fkey FOREIGN KEY (accepted_date_preference_id) REFERENCES saac_thingy.event_date_preference(id)
);
CREATE TABLE saac_thingy.event_date_preference (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  event_id uuid NOT NULL,
  date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  proposer_role USER-DEFINED NOT NULL DEFAULT 'club'::saac_thingy.user_role,
  CONSTRAINT event_date_preference_pkey PRIMARY KEY (id),
  CONSTRAINT event_date_preference_event_id_fkey FOREIGN KEY (event_id) REFERENCES saac_thingy.event(id)
);
CREATE TABLE saac_thingy.event_review (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  event_id uuid NOT NULL,
  admin_id uuid,
  comment text NOT NULL,
  club_id uuid,
  CONSTRAINT event_review_pkey PRIMARY KEY (id),
  CONSTRAINT event_review_event_id_fkey FOREIGN KEY (event_id) REFERENCES saac_thingy.event(id),
  CONSTRAINT event_review_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES saac_thingy.admin(id),
  CONSTRAINT event_review_club_id_fkey FOREIGN KEY (club_id) REFERENCES saac_thingy.club(id)
);
CREATE TABLE saac_thingy.items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  amount numeric NOT NULL,
  reimbursement_id uuid NOT NULL,
  CONSTRAINT items_pkey PRIMARY KEY (id),
  CONSTRAINT items_reimbursement_id_fkey FOREIGN KEY (reimbursement_id) REFERENCES saac_thingy.reimbursement(id)
);
CREATE TABLE saac_thingy.reimbursees (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  student_id character varying NOT NULL,
  student_name text NOT NULL,
  reimbursement_id uuid NOT NULL,
  CONSTRAINT reimbursees_pkey PRIMARY KEY (id),
  CONSTRAINT reimbursees_reimbursement_id_fkey FOREIGN KEY (reimbursement_id) REFERENCES saac_thingy.reimbursement(id)
);
CREATE TABLE saac_thingy.reimbursement (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  id uuid NOT NULL,
  treasurer_id uuid NOT NULL,
  CONSTRAINT reimbursement_pkey PRIMARY KEY (id),
  CONSTRAINT reimbursement_id_fkey FOREIGN KEY (id) REFERENCES saac_thingy.budget_request(event_id),
  CONSTRAINT reimbursement_treasurer_id_fkey FOREIGN KEY (treasurer_id) REFERENCES saac_thingy.treasurer(id)
);
CREATE TABLE saac_thingy.treasurer (
  id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  student_id text NOT NULL UNIQUE,
  student_name text NOT NULL,
  account_holder_name text NOT NULL,
  account_number text NOT NULL UNIQUE,
  bank_name text NOT NULL,
  branch_name text NOT NULL,
  ifsc_code text NOT NULL,
  club_id uuid NOT NULL,
  CONSTRAINT treasurer_pkey PRIMARY KEY (id),
  CONSTRAINT treasurer_club_id_fkey FOREIGN KEY (club_id) REFERENCES saac_thingy.club(id)
);