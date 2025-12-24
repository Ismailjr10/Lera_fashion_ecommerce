interface BadgeProps {
  text: string;
  variant?: 'low-stock' | 'selling-fast' | 'new' | 'verified';
}

export function Badge({ text, variant = 'low-stock' }: BadgeProps) {
  const variants = {
    'low-stock': 'bg-red-100 text-red-700 border border-red-300 animate-pulse',
    'selling-fast': 'bg-orange-100 text-orange-700 border border-orange-300 animate-pulse',
    'new': 'bg-green-100 text-green-700 border border-green-300',
    'verified': 'bg-blue-100 text-blue-700 border border-blue-300',
  };

  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${variants[variant]}`}>
      {text}
    </span>
  );
}
