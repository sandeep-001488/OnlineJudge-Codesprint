export function MarkdownPreview({ text, className = "" }) {
  if (!text) {
    return (
      <p className="text-muted-foreground italic">No content provided...</p>
    );
  }

  return (
    <div
      className={`prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 ${className}`}
    >
      {text.split("\n").map((line, i) => {
        if (line.startsWith("# ")) {
          return (
            <h1
              key={i}
              className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100"
            >
              {line.slice(2)}
            </h1>
          );
        } else if (line.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200"
            >
              {line.slice(3)}
            </h2>
          );
        } else if (line.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200"
            >
              {line.slice(4)}
            </h3>
          );
        } else if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-semibold mb-2">
              {line.slice(2, -2)}
            </p>
          );
        } else if (line.includes("**")) {
          const parts = line.split("**");
          return (
            <p key={i} className="mb-2 leading-relaxed">
              {parts.map((part, idx) =>
                idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
              )}
            </p>
          );
        } else if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <li key={i} className="mb-1 ml-4 list-disc">
              {line.slice(2)}
            </li>
          );
        } else if (line.trim() === "") {
          return <br key={i} />;
        } else {
          return (
            <p
              key={i}
              className="mb-2 leading-relaxed text-gray-700 dark:text-gray-300"
            >
              {line}
            </p>
          );
        }
      })}
    </div>
  );
}
