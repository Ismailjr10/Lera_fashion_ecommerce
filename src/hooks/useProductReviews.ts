import { useState, useEffect, useCallback } from 'react';
import { supabase, Review } from '../lib/supabase';

export function useProductReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    // 🛑 STOP: If there is no ID, don't fetch!
    if (!productId) {
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
      // We don't set the error state here to avoid crashing the UI
      // just because reviews failed to load. We fail silently.
    } finally {
      setLoading(false);
    }
  }, [productId]);

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

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, addReview };
}