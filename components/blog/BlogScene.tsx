import { BlogSceneView } from "@/components/blog/BlogSceneView";
import type { JournalEntry } from "@/components/blog/JournalShowcase";

export function BlogScene({
  posts,
  error,
}: {
  posts: JournalEntry[];
  error: boolean;
}) {
  return <BlogSceneView posts={posts} error={error} />;
}
