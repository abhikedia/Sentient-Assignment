import { render, act } from "@testing-library/react";
import {
  ModelProvider,
  ModelContext,
  ModelContextType,
} from "@/context/ModelContext";
import { useContext } from "react";

const mockDefaultConfig = {
  temperature: 0.7,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

const mockUpdatedConfig = {
  temperature: 1.0,
  top_p: 0.8,
  frequency_penalty: 0.5,
  presence_penalty: 0.3,
};

describe("ModelProvider", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("provides the default configuration when localStorage is empty", () => {
    let receivedConfig: ModelContextType | null = null;

    // Test component to consume context
    function TestComponent() {
      const context = useContext(ModelContext);
      receivedConfig = context; // Assign the context value
      return null;
    }

    render(
      <ModelProvider>
        <TestComponent />
      </ModelProvider>
    );

    // Assert that the context has the default config
    expect((receivedConfig as unknown as ModelContextType)?.config).toEqual(
      mockDefaultConfig
    );
  });

  it("rehydrates configuration from localStorage", () => {
    const savedConfig = JSON.stringify(mockUpdatedConfig);
    localStorage.setItem("modelConfig", savedConfig);

    let receivedConfig: ModelContextType | null = null;

    function TestComponent() {
      const context = useContext(ModelContext);
      receivedConfig = context; // Assign the context value
      return null;
    }

    render(
      <ModelProvider>
        <TestComponent />
      </ModelProvider>
    );

    // Assert that the context has the updated config
    expect((receivedConfig as unknown as ModelContextType)?.config).toEqual(
      mockUpdatedConfig
    );
  });

  it("updates configuration and persists to localStorage", () => {
    let contextValue: ModelContextType | null = null;

    function TestComponent() {
      contextValue = useContext(ModelContext); // Get the context value
      return null;
    }

    render(
      <ModelProvider>
        <TestComponent />
      </ModelProvider>
    );

    // Act: Update the configuration
    act(() => {
      contextValue?.updateConfig({ temperature: 1.2 });
    });

    // Assert: Check updated configuration in context
    expect(
      (contextValue as unknown as ModelContextType)?.config.temperature
    ).toBe(1.2);

    // Assert: Verify localStorage was updated
    const storedConfig = JSON.parse(localStorage.getItem("modelConfig")!);
    expect(storedConfig.temperature).toBe(1.2);
  });

  it("merges new configuration updates correctly", () => {
    let contextValue: ModelContextType | null = null;

    function TestComponent() {
      contextValue = useContext(ModelContext); // Get the context value
      return null;
    }

    render(
      <ModelProvider>
        <TestComponent />
      </ModelProvider>
    );

    act(() => {
      contextValue?.updateConfig({ top_p: 0.5, frequency_penalty: 0.3 });
    });

    // Assert the updated config with merged values
    expect((contextValue as unknown as ModelContextType)?.config).toEqual({
      ...mockDefaultConfig,
      top_p: 0.5,
      frequency_penalty: 0.3,
    });
  });

  it("persists multiple updates to localStorage", () => {
    let contextValue: ModelContextType | null = null;

    function TestComponent() {
      contextValue = useContext(ModelContext); // Get the context value
      return null;
    }

    render(
      <ModelProvider>
        <TestComponent />
      </ModelProvider>
    );

    act(() => {
      contextValue?.updateConfig({ temperature: 1.1 });
      contextValue?.updateConfig({ presence_penalty: 0.4 });
    });

    // Verify that the updates are reflected in localStorage
    const storedConfig = JSON.parse(localStorage.getItem("modelConfig")!);
    expect(storedConfig).toEqual({
      ...mockDefaultConfig,
      temperature: 1.1,
      presence_penalty: 0.4,
    });
  });
});
