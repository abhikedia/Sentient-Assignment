"use client";

import { createContext, useState, useCallback, useRef, useEffect } from "react";
import { useModel } from "@/hooks/useModelConfig";
import { addMessage, getAllMessages, clearAllMessages } from "@/utils/stream";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Metrics = {
  tokensPerSecond: number;
  totalTokens: number;
  estimatedCompletionTime: number;
};

type StreamContextType = {
  messages: Message[];
  isStreaming: boolean;
  metrics: Metrics;
  sendMessage: (message: string) => void;
  cancelGeneration: () => void;
  clearConversation: () => void;
};

export const StreamContext = createContext<StreamContextType | null>(null);

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    tokensPerSecond: 0,
    totalTokens: 0,
    estimatedCompletionTime: 0,
  });
  const { config } = useModel();

  const streamStart = useRef<number>(0);
  const tokenCount = useRef<number>(0);

  useEffect(() => {
    const loadMessages = async () => {
      const savedMessages = await getAllMessages();
      setMessages(savedMessages);
    };

    loadMessages();
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      const userMessage = { role: "user" as const, content: message };
      await addMessage(userMessage);
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      setIsStreaming(true);
      streamStart.current = Date.now();
      tokenCount.current = 0;

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: message,
            ...config,
          }),
        });

        if (!response.ok) {
          throw new Error("API request failed");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let aiMessage = "";

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          const chunk = decoder.decode(value);
          aiMessage += chunk;
          tokenCount.current += chunk.split(" ").length; // Rough estimate of tokens

          const elapsedTime = (Date.now() - streamStart.current) / 1000;
          setMetrics({
            tokensPerSecond: tokenCount.current / elapsedTime,
            totalTokens: tokenCount.current,
            estimatedCompletionTime:
              elapsedTime *
              (1 - tokenCount.current / (tokenCount.current + 50)), // Rough estimate
          });

          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { role: "assistant", content: aiMessage },
          ]);
        }

        await addMessage({ role: "assistant", content: aiMessage });
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = {
          role: "assistant" as const,
          content: "Sorry, an error occurred. Please try again.",
        };
        await addMessage(errorMessage);
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsStreaming(false);
      }
    },
    [config]
  );

  const cancelGeneration = useCallback(() => {
    setIsStreaming(false);
  }, []);

  const clearConversation = useCallback(async () => {
    await clearAllMessages();
    setMessages([]);
  }, []);

  return (
    <StreamContext.Provider
      value={{
        messages,
        isStreaming,
        metrics,
        sendMessage,
        cancelGeneration,
        clearConversation,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}
