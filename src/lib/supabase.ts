import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
