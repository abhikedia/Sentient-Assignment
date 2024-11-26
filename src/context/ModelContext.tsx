"use client";

import { createContext, useState, useEffect } from "react";

type ModelConfig = {
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
};

export type ModelContextType = {
  config: ModelConfig;
  updateConfig: (newConfig: Partial<ModelConfig>) => void;
};

export const ModelContext = createContext<ModelContextType | null>(null);

const defaultConfig: ModelConfig = {
  temperature: 0.7,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ModelConfig>(() => {
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("modelConfig");
      return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
    }
    return defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem("modelConfig", JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<ModelConfig>) => {
    setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  };

  return (
    <ModelContext.Provider value={{ config, updateConfig }}>
      {children}
    </ModelContext.Provider>
  );
}
