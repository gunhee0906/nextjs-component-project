import { Check, Copy } from "lucide-react";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
  language,
  children,
}: {
  language: string;
  children: string;
}) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group max-w-full overflow-x-auto my-4">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          maxWidth: "100%",
          overflowX: "auto",
        }}
        codeTagProps={{
          style: {
            whiteSpace: "pre",
            wordBreak: "normal",
          },
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
