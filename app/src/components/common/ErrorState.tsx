import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = "We couldn't load your data. Please try again.",
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center text-center mx-auto max-w-md rounded-xl border border-destructive/20 bg-destructive/5 p-8"
    >
      <AlertCircle className="h-10 w-10 text-destructive mb-3" aria-hidden="true" />
      <h3 className="text-lg font-semibold tracking-tight text-destructive">
        {title}
      </h3>
      <p className="text-sm text-destructive/80 mt-2 mb-5 leading-relaxed">
        {description}
      </p>
      {onRetry ? (
        <Button variant="destructive" onClick={onRetry} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
