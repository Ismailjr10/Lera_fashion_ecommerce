import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, Review } from '../lib/supabase';

export function useProductReviews(productId: string) {
  // 1. Always declare ALL state hooks at the top
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false); // Default to false to prevent UI flicker
  const [error, setError] = useState<string | null>(null);

  // 2. Define the fetch function
  const fetchReviews = useCallback(async () => {
    // 🛑 SAFETY CHECK: If ID is empty, clear data and stop.
    // But we are INSIDE the callback, so this is safe.
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
      // Don't crash the UI for review errors
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // 3. Define the Add Review function
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

  // 4. Run the Effect (This must always run)
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // 5. Calculate Stats
  const stats = useMemo(() => {
    const count = reviews.length;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = count > 0 ? totalRating / count : 0;
    
    return { count, average };
  }, [reviews]);

  return { 
    reviews, 
    loading, 
    error, 
    addReview,
    average: stats.average, 
    count: stats.count 
  };
}