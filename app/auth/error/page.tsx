import { Suspense } from "react";
import { AuthErrorContent } from "@/components/auth/auth-error-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function AuthErrorFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Error</CardTitle>
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
      <Suspense fallback={<AuthErrorFallback />}>
        <AuthErrorContent />
      </Suspense>
    </div>
  );
}
