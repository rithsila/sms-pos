import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface ListSkeletonProps {
  rows?: number;
}

export function ListSkeleton({ rows = 3 }: ListSkeletonProps) {
  return (
    <Card aria-busy="true" aria-label="Loading list">
      <CardContent className="p-0 divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
            <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface StatsSkeletonProps {
  count?: number;
}

export function StatsSkeleton({ count = 4 }: StatsSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      aria-busy="true"
      aria-label="Loading stats"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
