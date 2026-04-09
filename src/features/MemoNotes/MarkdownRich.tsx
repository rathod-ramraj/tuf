/**
 * Renders Markdown plus a small allowlist-style HTML subset via rehype-raw (`<u>`, `<mark>`, etc.).
 * Content is user-authored local data only; for shared/multi-tenant input, add rehype-sanitize.
 */
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const MARKDOWN_PROSE =
  "prose max-w-none font-body text-foreground " +
  "prose-p:leading-relaxed " +
  "prose-strong:font-semibold prose-strong:text-foreground " +
  "prose-mark:bg-yellow-200/60 prose-mark:text-foreground prose-mark:rounded-sm prose-mark:px-1 " +
  "dark:prose-mark:bg-yellow-300/25 dark:prose-mark:text-foreground " +
  "prose-u:underline prose-u:underline-offset-4 prose-u:decoration-primary/50";

type Props = {
  text: string;
  className?: string;
  /** `sm` for note cards, `sm` with tight paragraphs for reminder rows */
  variant?: "note" | "reminder";
};

export function MarkdownRich({ text, className, variant = "note" }: Props) {
  return (
    <div
      className={cn(
        MARKDOWN_PROSE,
        variant === "note" && "prose-sm leading-relaxed",
        variant === "reminder" && "prose-sm [&_p]:mb-2 [&_p]:last:mb-0",
        className,
      )}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ children }) => (
            <p className={variant === "reminder" ? "mb-2 text-sm font-medium last:mb-0" : "mb-3 last:mb-0"}>
              {children}
            </p>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

export const NOTE_MARKDOWN_PLACEHOLDER_HINT =
  'Supports **bold**, <u>underline</u>, and <mark>highlight</mark>.';
