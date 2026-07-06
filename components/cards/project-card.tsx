import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ProjectPreview } from "@/content/home";
import { cn } from "@/lib/utils/cn";

const accentClasses: Record<ProjectPreview["accent"], string> = {
  violet: "from-zinc-950 via-violet-950/20 to-zinc-900",
  stone: "from-zinc-950 via-stone-700/20 to-zinc-900",
  slate: "from-zinc-950 via-slate-700/20 to-zinc-900",
};

type ProjectCardProps = {
  project: ProjectPreview;
  variant?: "default" | "highlight";
  className?: string;
};

export function ProjectCard({
  project,
  variant = "default",
  className,
}: ProjectCardProps) {
  const isHighlight = variant === "highlight";
  const techPreview = project.techStack.slice(0, isHighlight ? 5 : 3);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-lg border border-border bg-surface transition-colors duration-200 hover:border-white/20",
        isHighlight && "grid lg:grid-cols-[0.95fr_1.05fr]",
        className,
      )}
    >
      <div
        className={cn(
          "relative border-b border-border bg-gradient-to-br",
          isHighlight ? "min-h-72 lg:border-b-0 lg:border-r" : "h-36",
          accentClasses[project.accent],
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(255,255,255,0.11),transparent_34%)]" />
        <div
          className={cn(
            "absolute inset-x-6 bottom-6 h-px bg-white/15",
            isHighlight && "inset-x-10 bottom-10",
          )}
        />
        <div
          className={cn(
            "absolute bottom-8 left-6 h-10 w-28 rounded-sm border border-white/10 bg-black/20",
            isHighlight && "bottom-14 left-10 h-16 w-40",
          )}
        />
        <div
          className={cn(
            "absolute bottom-8 right-6 h-16 w-20 rounded-sm border border-white/10 bg-white/5",
            isHighlight && "bottom-14 right-10 h-24 w-28",
          )}
        />
      </div>
      <div className={cn("p-6", isHighlight && "p-7 sm:p-9")}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{project.status}</Badge>
          {project.category ? (
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {project.category}
            </span>
          ) : null}
          {project.featured ? (
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-medium text-foreground">
              Featured
            </span>
          ) : null}
        </div>
        <div className={cn(isHighlight ? "mt-8" : "mt-5")}>
          <h3
            className={cn(
              "font-medium tracking-tight text-foreground",
              isHighlight ? "text-3xl sm:text-4xl" : "text-lg",
            )}
          >
            {project.title}
          </h3>
        </div>
        <p
          className={cn(
            "mt-4 leading-7 text-muted-foreground",
            isHighlight ? "max-w-xl text-base" : "text-sm",
          )}
        >
          {project.description}
        </p>
        {techPreview.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {techPreview.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-background/30 px-3 py-1 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}
        <Link
          href={project.href}
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity duration-200 hover:opacity-70"
        >
          View project
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
