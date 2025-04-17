import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  image: string;
};

export type Tool = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image: string;
  affiliate_link: string;
  price: string;
  features: string[];
};

export type Profile = {
  id: string;
  is_admin: boolean;
  created_at: string;
};