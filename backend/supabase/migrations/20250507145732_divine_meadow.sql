/*
  # Setup Authentication and User Management

  1. Schema Updates
    - Add auth schema extensions
    - Create users table with proper constraints
    - Add RLS policies for secure access

  2. Initial Data
    - Create admin and test user accounts
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Insert initial users
INSERT INTO auth.users (
  email,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmed_at
) VALUES 
  ('admin@example.com', '{"role":"admin"}', now(), now(), now()),
  ('user@example.com', '{"role":"user"}', now(), now(), now())
ON CONFLICT (email) DO NOTHING;