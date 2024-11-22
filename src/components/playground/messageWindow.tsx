"use client";

import { useEffect, useRef } from "react";
import { useStream } from "@/hooks/useStream";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CodeBlock } from "./codeBlock";

export function MessageWindow() {
  const { messages, isStreaming } = useStream();
  const containerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  useEffect(() => {
    rowVirtualizer.scrollToIndex(messages.length - 1);
  }, [messages.length, rowVirtualizer]);

  return (
    <div ref={containerRef} className="flex-1 overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <Message message={messages[virtualItem.index]} />
          </div>
        ))}
      </div>
      {isStreaming && (
        <div className="p-2 text-gray-500">AI is generating a response...</div>
      )}
    </div>
  );
}

function Message({ message }: { message: { role: string; content: string } }) {
  return (
    <div
      className={`p-2 ${message.role === "user" ? "bg-gray-100" : "bg-white"}`}
    >
      <strong>{message.role === "user" ? "You:" : "AI:"}</strong>
      <div className="mt-1">
        {message.content
          .split("```")
          .map((part, index) =>
            index % 2 === 0 ? (
              <p key={index}>{part}</p>
            ) : (
              <CodeBlock key={index} code={part} />
            )
          )}
      </div>
    </div>
  );
}
