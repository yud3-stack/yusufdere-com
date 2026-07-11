"use client";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type CommandMenuTriggerProps = {
  label: string;
  shortcutLabel: string;
  className?: string;
};

export function CommandMenuTrigger({
  label,
  shortcutLabel,
  className,
}: CommandMenuTriggerProps) {
  return (
    <button
      type="button"
      aria-label={shortcutLabel}
      title={shortcutLabel}
      onClick={() => window.dispatchEvent(new Event("open-command-menu"))}
      className={cn(
        "hidden h-9 shrink-0 items-center gap-2 rounded-full border border-border bg-background/45 px-3 text-xs font-medium text-muted-foreground transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background xl:inline-flex",
        className,
      )}
    >
      <Search className="size-3.5" />
      <span className="hidden 2xl:inline">{label}</span>
      <kbd className="rounded-full border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
        ⌘K
      </kbd>
    </button>
  );
}
