import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  href?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  href,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface px-6 py-12 text-center sm:px-10",
        className,
      )}
    >
      <div className="mx-auto mb-7 h-px w-24 bg-border" />
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
        {description}
      </p>
      {actionLabel && href ? (
        <div className="mt-8">
          <Button href={href} variant="secondary">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
