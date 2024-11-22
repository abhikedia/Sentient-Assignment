'use client';

import { useStream } from "@/hooks/useStream";
import { useState } from "react";
import { MessageWindow } from "./messageWindow";

const PlaygroundContent = () => {
  const [input, setInput] = useState("");
  const { sendMessage, isStreaming, clearConversation } = useStream();

  const handleSend = () => {
    if (input.trim() && !isStreaming) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4">
          {/* <Metrics 
            tokensPerSecond={metrics.tokensPerSecond}
            totalTokens={metrics.totalTokens}
            estimatedCompletionTime={metrics.estimatedCompletionTime}
          /> */}
          <button onClick={clearConversation}>Clear Conversation</button>
        </div>
        <MessageWindow />
        <div className="p-4 border-t">
          <textarea
            className="w-full p-2 border rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your message here..."
            disabled={isStreaming}
          />
          <button className="mt-2" onClick={handleSend} disabled={isStreaming}>
            {isStreaming ? "Generating..." : "Send"}
          </button>
        </div>
      </div>
      {/* <ModelControlCenter /> */}
    </div>
  );
};

export default PlaygroundContent;
