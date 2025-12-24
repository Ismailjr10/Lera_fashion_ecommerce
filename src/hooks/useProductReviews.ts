import { useState, useEffect } from 'react';
import { Review, supabase } from '../lib/supabase';

interface ReviewStats {
  average: number;
  count: number;
  reviews: Review[];
}

export function useProductReviews(productId: string) {
  const [stats, setStats] = useState<ReviewStats>({ average: 0, count: 0, reviews: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { data } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId);

        if (data && data.length > 0) {
          const average = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
          setStats({
            average,
            count: data.length,
            reviews: data,
          });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [productId]);

  return { ...stats, loading };
}
