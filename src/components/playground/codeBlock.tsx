"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export function CodeBlock({ code }: { code: string }) {
  const [language, setLanguage] = useState("javascript");

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="absolute top-2 right-2 z-10"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {code}
      </SyntaxHighlighter>
      <button
        onClick={() => navigator.clipboard.writeText(code)}
        className="absolute bottom-2 right-2 px-2 py-1 bg-gray-800 text-white rounded"
      >
        Copy
      </button>
    </div>
  );
}
