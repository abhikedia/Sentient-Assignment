"use client";

import { ModelProvider } from "@/context/ModelContext";
import dynamic from "next/dynamic";
const StreamProvider = dynamic(() => import("@/context/StreamContext"), {
  ssr: false,
});
const PlaygroundContent = dynamic(() => import("@/components/playground"), {
  ssr: false,
});

const Playground = () => {
  return (
    <ModelProvider>
      <StreamProvider>
        <PlaygroundContent />
      </StreamProvider>
    </ModelProvider>
  );
};

export default Playground;
