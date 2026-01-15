-- SQL commands to grant permissions to service_role on saac_thingy schema
-- Run these commands in your Supabase SQL Editor

-- Grant usage on the schema
GRANT USAGE ON SCHEMA saac_thingy TO service_role;

-- Grant all privileges on all tables in the schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA saac_thingy TO service_role;

-- Grant all privileges on all sequences in the schema (for auto-increment IDs)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA saac_thingy TO service_role;

-- Grant all privileges on future tables (so new tables automatically get permissions)
ALTER DEFAULT PRIVILEGES IN SCHEMA saac_thingy
  GRANT ALL PRIVILEGES ON TABLES TO service_role;

-- Grant all privileges on future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA saac_thingy
  GRANT ALL PRIVILEGES ON SEQUENCES TO service_role;

-- Specific table grants (if the above doesn't work)
GRANT SELECT, INSERT, UPDATE, DELETE ON saac_thingy.club TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON saac_thingy.event TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON saac_thingy.event_date_preference TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON saac_thingy.budget_request TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON saac_thingy.admin TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON saac_thingy.event_review TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON saac_thingy.collaborator TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON saac_thingy.treasurer TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON saac_thingy.reimbursement TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON saac_thingy.reimbursees TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON saac_thingy.items TO service_role;

-- Optional: If you also want to grant permissions to authenticated users (for client-side operations)
-- GRANT USAGE ON SCHEMA saac_thingy TO authenticated;
-- GRANT SELECT, INSERT ON saac_thingy.club TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON saac_thingy.event TO authenticated;
-- GRANT SELECT, INSERT ON saac_thingy.event_date_preference TO authenticated;
-- GRANT SELECT, INSERT ON saac_thingy.budget_request TO authenticated;

-- Verify permissions (run this to check what was granted)
SELECT
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'saac_thingy'
  AND grantee = 'service_role'
ORDER BY table_name, privilege_type;
