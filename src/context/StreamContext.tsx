"use client";

import {
  createContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { useModel } from "@/hooks/useModelConfig";
import { addMessage, getAllMessages, clearAllMessages } from "@/utils/stream";
import { useChat, Message as AIMessage } from "@ai-sdk/react";

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

export default function StreamProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    tokensPerSecond: 0,
    totalTokens: 0,
    estimatedCompletionTime: 0,
  });
  const { config } = useModel();

  const streamStart = useRef<number>(0);
  const tokenCount = useRef<number>(0);

  const {
    messages: aiMessages,
    append,
    reload,
    stop,
    isLoading,
  } = useChat({
    api: "/api/chat",
  });

  useEffect(() => {
    const loadMessages = async () => {
      const savedMessages = await getAllMessages();
      setMessages(savedMessages);
    };
    loadMessages();
  }, []);

  useEffect(() => {
    setMessages(aiMessages as Message[]);
  }, [aiMessages]);

  const sendMessage = useCallback(
    async (message: string) => {
      const userMessage = { role: "user" as const, content: message };
      await addMessage(userMessage);

      streamStart.current = Date.now();
      tokenCount.current = 0;

      await append(
        {
          role: "user",
          content: message,
        } as AIMessage,
        {
          data: {
            ...config,
          },
        }
      );
    },
    [append, config]
  );

  const cancelGeneration = useCallback(() => {
    stop();
  }, [stop]);

  const clearConversation = useCallback(async () => {
    await clearAllMessages();
    setMessages([]);
    reload();
  }, [reload]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        const elapsedTime = (Date.now() - streamStart.current) / 1000;
        tokenCount.current += 1;
        setMetrics({
          tokensPerSecond: tokenCount.current / elapsedTime,
          totalTokens: tokenCount.current,
          estimatedCompletionTime:
            elapsedTime * (1 - tokenCount.current / (tokenCount.current + 50)),
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <StreamContext.Provider
      value={{
        messages,
        isStreaming: isLoading,
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
