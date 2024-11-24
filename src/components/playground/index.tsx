"use client";

import { useStream } from "@/hooks/useStream";
import { useState } from "react";
import { MessageWindow } from "../messages";
import { Button } from "@/components/ui/button";
import ModelControlCenter from "../controls";

const PlaygroundContent = () => {
  const [input, setInput] = useState("");
  const { sendMessage, isStreaming, clearConversation } = useStream();

  const handleSend = () => {
    if (input.trim() && !isStreaming) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleClearConversation = () => {
    clearConversation();
    setInput("");
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
          <Button
            onClick={handleClearConversation}
            variant="outline"
            className="mr-2"
            disabled={isStreaming}
          >
            Clear Conversation
          </Button>
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
          <Button className="mt-2" onClick={handleSend} disabled={isStreaming}>
            {isStreaming ? "Generating..." : "Send"}
          </Button>
        </div>
      </div>
      <ModelControlCenter />
    </div>
  );
};

export default PlaygroundContent;
