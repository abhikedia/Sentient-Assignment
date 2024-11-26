import { render, screen, fireEvent } from "@testing-library/react";
import ModelControlCenter from "@/components/controls";
import { useModel } from "@/hooks/useModelConfig";

// Mock the useModel hook
jest.mock("@/hooks/useModelConfig", () => ({
  useModel: jest.fn(),
}));

describe("ModelControlCenter", () => {
  const mockUpdateConfig = jest.fn();
  const mockConfig = {
    temperature: 0.7,
    top_p: 0.9,
  };

  beforeEach(() => {
    (useModel as jest.Mock).mockReturnValue({
      config: mockConfig,
      updateConfig: mockUpdateConfig,
    });
    jest.clearAllMocks();
  });

  it("renders the component with default values", () => {
    render(<ModelControlCenter />);

    expect(screen.getByText("Model Controls")).toBeInTheDocument();
    expect(screen.getByLabelText("Temperature")).toBeInTheDocument();
    expect(screen.getByText("0.7")).toBeInTheDocument();
    expect(screen.getByLabelText("Top P")).toBeInTheDocument();
    expect(screen.getByText("0.9")).toBeInTheDocument();
  });

  it("updates temperature when the slider is changed", () => {
    render(<ModelControlCenter />);

    const temperatureSlider = screen.getByLabelText("Temperature");
    fireEvent.change(temperatureSlider, { target: { value: "1.2" } });

    expect(mockUpdateConfig).toHaveBeenCalledWith({ temperature: 1.2 });
  });

  it("updates top_p when the slider is changed", () => {
    render(<ModelControlCenter />);

    const topPSlider = screen.getByLabelText("Top P");
    fireEvent.change(topPSlider, { target: { value: "0.5" } });

    expect(mockUpdateConfig).toHaveBeenCalledWith({ top_p: 0.5 });
  });
});
