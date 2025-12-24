import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
}

export function StarRating({ rating, size = 'md', showCount = false, count = 0 }: StarRatingProps) {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const sizeClass = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  const displayRating = Math.round(rating * 10) / 10;

  return (
    <div className="flex items-center gap-2">
      <div className={`flex ${sizeClass[size]}`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={sizes[size]}
            className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-sm text-gray-600">
          {displayRating} ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}
