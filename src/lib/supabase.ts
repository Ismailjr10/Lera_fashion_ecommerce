import { createClient } from '@supabase/supabase-js';

// 1. Get the keys (or use empty strings)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 2. CRASH PREVENTION: Only create the real client if keys exist.
// If keys are missing, we create a fake one so the app loads (and you can see the error).
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// 3. Log a warning so you know if it's working
if (!supabaseUrl) console.error('🚨 Supabase URL is missing!');

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Abaya' | 'Kaftan' | 'Hijab';
  colors: string[];
  sizes: string[];
  images: string[];
  stock_quantity: number;
  is_low_stock: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  rating: number;
  reviewer_name: string;
  comment: string;
  is_verified: boolean;
  created_at: string;
}