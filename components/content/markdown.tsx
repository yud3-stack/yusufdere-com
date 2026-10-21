import { Children, isValidElement } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function safeHref(href: string | undefined) {
  if (!href) {
    return undefined;
  }

  if (href.startsWith("/") || href.startsWith("#") || href.startsWith("mailto:")) {
    return href;
  }

  try {
    const url = new URL(href);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return href;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function markdownComponents(article: boolean): Components {
  const heading = article
    ? "mt-12 mb-4 text-[1.625rem] leading-snug font-semibold tracking-[-0.03em] break-words text-[#111827] first:mt-0 sm:mt-14 sm:mb-5 sm:text-[1.75rem] sm:first:mt-0"
    : "mt-8 text-2xl font-semibold tracking-[-0.03em] text-[#111827]";
  const h2 = article
    ? heading
    : "mt-8 text-xl font-semibold tracking-[-0.03em] text-[#111827]";
  const h3 = article
    ? "mt-10 mb-3 text-[1.25rem] leading-snug font-semibold tracking-[-0.02em] break-words text-[#111827] first:mt-0 sm:first:mt-0"
    : "mt-6 text-lg font-semibold text-[#111827]";

  return {
  h1: ({ children }) => <h2 className={heading}>{children}</h2>,
  h2: ({ children }) => <h2 className={h2}>{children}</h2>,
  h3: ({ children }) => <h3 className={h3}>{children}</h3>,
  p: ({ children }) => {
    const nodes = Children.toArray(children);
    const onlyImage =
      nodes.length === 1 &&
      isValidElement(nodes[0]) &&
      (nodes[0].type === "figure" || nodes[0].type === "span");

    if (onlyImage) {
      return <>{children}</>;
    }

    return <p className={article ? "mt-6 first:mt-0" : "mt-4"}>{children}</p>;
  },
  strong: ({ children }) => <strong className="font-semibold text-[#111827]">{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  a: ({ href, children }) => {
    const safe = safeHref(href);

    if (!safe) {
      return <span>{children}</span>;
    }

    const external = safe.startsWith("http");

    return (
      <a
        href={safe}
        className="underline decoration-[#F59E0B] underline-offset-2"
        rel={external ? "noreferrer noopener" : undefined}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className={article ? "mt-6 list-disc space-y-2 pl-5" : "mt-4 list-disc space-y-1 pl-5"}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className={article ? "mt-6 list-decimal space-y-2 pl-5" : "mt-4 list-decimal space-y-1 pl-5"}>{children}</ol>
  ),
  li: ({ children }) => <li className={article ? "leading-[1.75]" : undefined}>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote
      className={
        article
          ? "mt-6 border-l-2 border-[#F59E0B] pl-4 text-[#4B5563]"
          : "mt-4 border-l-2 border-[#F59E0B] pl-4 text-[#4B5563]"
      }
    >
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre
      className={
        article
          ? "mt-6 max-w-full overflow-x-auto rounded-xl bg-[#111827] p-4 text-sm leading-6 text-[#F9FAFB]"
          : "mt-4 overflow-x-auto rounded-xl bg-[#111827] p-4 text-sm leading-6 text-[#F9FAFB]"
      }
    >
      {children}
    </pre>
  ),
  code: ({ className, children }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code
        className={
          article
            ? "rounded-md bg-[#F3F4F6] px-1.5 py-0.5 text-[0.9em] text-[#111827]"
            : "rounded bg-[#F3F4F6] px-1 py-0.5 text-[0.92em] text-[#111827]"
        }
      >
        {children}
      </code>
    ),
  table: ({ children }) => (
    <div className={article ? "mt-6 max-w-full overflow-x-auto" : "mt-4 overflow-x-auto"}>
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 font-medium text-[#111827]">{children}</th>
  ),
  td: ({ children }) => <td className="border border-[#E5E7EB] px-3 py-2">{children}</td>,
  img: ({ src, alt, title }) => {
    const safe = safeHref(typeof src === "string" ? src : undefined);

    if (!safe || safe.startsWith("#") || safe.startsWith("mailto:")) {
      return null;
    }

    const image = (
      // Markdown images may be Storage URLs or older external URLs.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={safe} alt={alt ?? ""} className="h-auto max-w-full w-full rounded-xl border border-[#E5E7EB]" />
    );

    if (!title) {
      return <span className={article ? "mt-6 block" : "mt-4 block"}>{image}</span>;
    }

    return (
      <figure className={article ? "mt-6" : "mt-4"}>
        {image}
        <figcaption className={article ? "mt-2 text-[13px] leading-5 text-[#6B7280]" : "mt-2 text-sm text-[#6B7280]"}>
          {title}
        </figcaption>
      </figure>
    );
  },
  };
}

export function Markdown({
  markdown,
  className = "text-base leading-8 text-[#374151]",
  variant = "default",
}: {
  markdown: string;
  className?: string;
  variant?: "default" | "article";
}) {
  if (!markdown.trim()) {
    return null;
  }

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={markdownComponents(variant === "article")}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
