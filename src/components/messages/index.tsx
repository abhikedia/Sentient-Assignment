"use client";

import { useEffect, useRef } from "react";
import { useStream } from "@/hooks/useStream";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CodeBlock } from "./codeBlock";
import { cn } from "@/lib/utils";

export function MessageWindow() {
  const { messages, isStreaming } = useStream();
  const containerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-auto p-4 space-y-4">
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
        <div className="text-sm text-gray-500 animate-pulse">
          AI is typing...
        </div>
      )}
    </div>
  );
}

function Message({ message }: { message: { role: string; content: string } }) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg",
        message.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100 mr-auto",
        "max-w-[80%]"
      )}
    >
      <div className="font-semibold mb-2">
        {message.role === "user" ? "You" : "AI"}
      </div>
      <div className="space-y-2">
        {message.content.split("```").map((part, index) =>
          index % 2 === 0 ? (
            <p key={index} className="text-sm">
              {part}
            </p>
          ) : (
            <CodeBlock key={index} code={part} />
          )
        )}
      </div>
    </div>
  );
}
