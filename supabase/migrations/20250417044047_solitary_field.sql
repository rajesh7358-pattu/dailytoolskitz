/*
  # Fix Categories RLS Policies

  1. Changes
    - Drop existing policies on categories table
    - Add new policies for better access control:
      - Everyone can view categories
      - Only admins can modify categories
*/

-- First, enable RLS if not already enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Only admins can modify categories" ON categories;

-- Create new policies
CREATE POLICY "Enable read access for all users"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for admins"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Enable update for admins"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Enable delete for admins"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Insert some default categories if none exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM categories LIMIT 1) THEN
    INSERT INTO categories (id, name, description, icon, color, gradient, image) VALUES
    ('development', 'Development', 'Programming and development tools', 'Code', '#3B82F6', 'from-blue-500 to-blue-700', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000'),
    ('design', 'Design', 'Design and creative tools', 'Palette', '#10B981', 'from-green-500 to-green-700', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=1000'),
    ('productivity', 'Productivity', 'Tools to boost your workflow', 'LineChart', '#6366F1', 'from-indigo-500 to-indigo-700', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1000');
  END IF;
END $$;