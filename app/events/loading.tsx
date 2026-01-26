import { Skeleton } from "@/components/ui/skeleton";
import { EventListSkeleton } from "@/components/events/event-skeleton";

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
        </div>

        {/* Events List Skeleton */}
        <EventListSkeleton count={3} />
      </main>
    </div>
  );
}
