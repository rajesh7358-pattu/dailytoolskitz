/*
  # Create profiles and categories tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `is_admin` (boolean)
      - `created_at` (timestamp)
    - `categories`
      - `id` (text, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `color` (text)
      - `gradient` (text)
      - `image` (text)
    - `tools`
      - `id` (uuid, primary key)
      - `category_id` (text, references categories)
      - `name` (text)
      - `description` (text)
      - `image` (text)
      - `affiliate_link` (text)
      - `price` (text)
      - `features` (text[])

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admins
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create categories table
CREATE TABLE categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon text,
  color text,
  gradient text,
  image text
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create tools table
CREATE TABLE tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id text REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image text,
  affiliate_link text,
  price text,
  features text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tools are viewable by everyone"
  ON tools FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify tools"
  ON tools FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );