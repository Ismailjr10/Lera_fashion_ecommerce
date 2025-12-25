import { createClient } from '@supabase/supabase-js';

// Default to empty strings to prevent the "undefined" crash
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create the client if we have a valid URL, otherwise create a "dummy" client
// This prevents the white screen of death
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Log a clear warning if keys are missing so you know why data isn't loading
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('🚨 Supabase Keys are missing! Check your .env file.');
}
 
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