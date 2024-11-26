"use client";

import { useModel } from "@/hooks/useModelConfig";

const ModelControlCenter = () => {
  const { config, updateConfig } = useModel();

  return (
    <div className="p-4 border rounded-md">
      <h1 className="text-lg font-semibold mb-4">Model Controls</h1>

      {/* Temperature Slider */}
      <div className="mb-4">
        <label
          htmlFor="temperature-slider"
          className="block text-sm font-medium mb-1"
        >
          Temperature
        </label>
        <input
          id="temperature-slider"
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={config.temperature}
          onChange={(e) =>
            updateConfig({ temperature: parseFloat(e.target.value) })
          }
          className="w-full"
        />
        <span className="block text-sm text-gray-600 mt-1">
          {config.temperature}
        </span>
      </div>

      {/* Top P Slider */}
      <div>
        <label
          htmlFor="top-p-slider"
          className="block text-sm font-medium mb-1"
        >
          Top P
        </label>
        <input
          id="top-p-slider"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={config.top_p}
          onChange={(e) => updateConfig({ top_p: parseFloat(e.target.value) })}
          className="w-full"
        />
        <span className="block text-sm text-gray-600 mt-1">{config.top_p}</span>
      </div>
    </div>
  );
};

export default ModelControlCenter;
