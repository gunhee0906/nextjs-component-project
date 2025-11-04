import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

export function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export function CustomSpinner({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        "bg-white/80 backdrop-blur-sm z-10"
      )}
    >
      <Loader2Icon className="h-10 w-10 animate-spin text-gray-700" />
    </div>
  );
}
