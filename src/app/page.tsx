import PlaygroundContent from "@/components/playground";
import { ModelProvider } from "@/context/ModelContext";
import { StreamProvider } from "@/context/StreamContext";

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
