import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ProjectPreview } from "@/content/home";
import { cn } from "@/lib/utils/cn";

const accentClasses: Record<ProjectPreview["accent"], string> = {
  violet: "from-zinc-950 via-violet-950/20 to-zinc-900",
  stone: "from-zinc-950 via-stone-700/20 to-zinc-900",
  slate: "from-zinc-950 via-slate-700/20 to-zinc-900",
};

type ProjectCardProps = {
  project: ProjectPreview;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-surface transition-colors duration-200 hover:border-white/20">
      <div
        className={cn(
          "relative h-36 border-b border-border bg-gradient-to-br",
          accentClasses[project.accent],
        )}
      >
        <div className="absolute inset-x-6 bottom-6 h-px bg-white/15" />
        <div className="absolute bottom-8 left-6 h-10 w-28 rounded-sm border border-white/10 bg-black/20" />
        <div className="absolute bottom-8 right-6 h-16 w-20 rounded-sm border border-white/10 bg-white/5" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-medium tracking-tight text-foreground">
            {project.title}
          </h3>
          <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {project.status}
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {project.description}
        </p>
        <Link
          href={project.href}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity duration-200 hover:opacity-70"
        >
          View project
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}
