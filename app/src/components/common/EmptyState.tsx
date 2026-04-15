import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: 'default' | 'search';
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const isSearch = variant === 'search';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center mx-auto max-w-md',
        isSearch
          ? 'rounded-xl border border-dashed border-border bg-muted/30 p-12'
          : 'rounded-xl border border-border bg-background p-12',
        className
      )}
      role="status"
    >
      {Icon ? (
        <div
          className={cn(
            'flex items-center justify-center mb-4',
            isSearch
              ? 'rounded-full bg-background ring-1 ring-border p-3'
              : 'h-20 w-20 rounded-full bg-muted ring-1 ring-border'
          )}
          aria-hidden="true"
        >
          <Icon
            className={cn(
              'text-muted-foreground',
              isSearch ? 'h-6 w-6' : 'h-10 w-10'
            )}
          />
        </div>
      ) : null}
      <h3
        className={cn(
          'font-semibold tracking-tight text-foreground',
          isSearch ? 'text-lg' : 'text-xl'
        )}
      >
        {title}
      </h3>
      {description ? (
        <p className="text-sm text-muted-foreground mt-2 mb-6 leading-relaxed">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
