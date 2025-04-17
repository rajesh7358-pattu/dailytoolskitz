/*
  # Add admin user trigger and function

  1. New Functions
    - `handle_new_user`: Creates a profile for new users
  
  2. New Triggers
    - `on_auth_user_created`: Automatically creates profile when a new user signs up

  3. Security
    - Function is set to be executed with security definer rights
*/

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, is_admin, created_at)
  VALUES (new.id, false, now());
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();