import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, Review } from '../lib/supabase';

export function useProductReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch Reviews (Safe Logic)
  const fetchReviews = useCallback(async () => {
    // If no ID is provided, just reset state but DO NOT return early from the hook itself
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (err) throw err;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      // Fail silently to avoid UI crash
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // 2. Add Review Logic
  const addReview = async (review: Omit<Review, 'id' | 'created_at' | 'is_verified'>) => {
    if (!productId) return null;
    
    try {
      const { data, error: err } = await supabase
        .from('reviews')
        .insert([{ ...review, product_id: productId, is_verified: false }])
        .select()
        .single();

      if (err) throw err;
      setReviews((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add review');
      return null;
    }
  };

  // 3. Initial Fetch
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // 4. Calculate Statistics (Average & Count)
  // This fixes the missing data in QuickViewModal
  const stats = useMemo(() => {
    const count = reviews.length;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = count > 0 ? totalRating / count : 0;
    
    return { count, average };
  }, [reviews]);

  // Return everything the Modal needs
  return { 
    reviews, 
    loading, 
    error, 
    addReview,
    average: stats.average, 
    count: stats.count 
  };
}