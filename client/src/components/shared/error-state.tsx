import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <p className="text-lg font-medium text-foreground mb-2">{message}</p>
      <p className="text-sm text-muted-foreground mb-4">
        Please try again or contact support if the issue persists.
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
