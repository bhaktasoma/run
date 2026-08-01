import type { ReactNode } from "react";

const TOKEN_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function formatText(text: string): ReactNode {
  if (!text.includes("*")) return text;

  return text.split(TOKEN_PATTERN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
