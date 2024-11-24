"use client";

import { useModel } from "@/hooks/useModelConfig";

const ModelControlCenter = () => {
  const { config, updateConfig } = useModel();

  return (
    <div className="w-64 p-4 border-l">
      <h2 className="text-lg font-bold mb-4">Model Controls</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Temperature
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature}
            onChange={(e) =>
              updateConfig({ temperature: parseFloat(e.target.value) })
            }
            className="w-full"
          />
          <span>{config.temperature.toFixed(1)}</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Top P
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={config.top_p}
            onChange={(e) =>
              updateConfig({ top_p: parseFloat(e.target.value) })
            }
            className="w-full"
          />
          <span>{config.top_p.toFixed(2)}</span>
        </div>
        {/* Add more controls for frequency_penalty and presence_penalty */}
      </div>
    </div>
  );
};

export default ModelControlCenter;
