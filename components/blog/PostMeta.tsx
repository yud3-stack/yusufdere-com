import { CalendarDays, Clock3 } from "lucide-react";
import { formatDate } from "@/lib/format";

export function PostMeta({ date, minutes }: { date: string | null; minutes?: number }) {
  if (!date && !minutes) return null;

  return (
    <div className="post-meta">
      {date ? <span><CalendarDays size={14} aria-hidden="true" /><time dateTime={date}>{formatDate(date)}</time></span> : null}
      {minutes && minutes > 0 ? <span><Clock3 size={14} aria-hidden="true" />{minutes} dk okuma</span> : null}
    </div>
  );
}
