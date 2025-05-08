/*
  # Update users table

  1. Schema Updates
    - Add department_id foreign key
    - Add position field
    - Add name field
    - Add metadata fields

  2. Security
    - Keep existing RLS policies
*/

-- Add new columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS department_id uuid REFERENCES departments(id),
ADD COLUMN IF NOT EXISTS position text CHECK (position IN ('employee', 'manager')),
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Create index for department_id
CREATE INDEX IF NOT EXISTS idx_users_department_id ON users(department_id);

-- Update existing users with default values
UPDATE users
SET 
  name = COALESCE(name, email),
  position = COALESCE(position, 'employee'),
  metadata = COALESCE(metadata, '{}'::jsonb)
WHERE name IS NULL OR position IS NULL OR metadata IS NULL; 