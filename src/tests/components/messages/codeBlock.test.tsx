import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CodeBlock } from "@/components/messages/codeBlock";

// Mock the SyntaxHighlighter component
jest.mock("react-syntax-highlighter", () => ({
  Prism: ({ children }: { children: React.ReactNode }) => (
    <pre data-testid="syntax-highlighter">{children}</pre>
  ),
}));

// Mock the styles import
jest.mock("react-syntax-highlighter/dist/esm/styles/prism", () => ({
  vscDarkPlus: {},
}));

// Mock the Lucide icons
jest.mock("lucide-react", () => ({
  Check: () => <span data-testid="check-icon">Check</span>,
  Copy: () => <span data-testid="copy-icon">Copy</span>,
}));

describe("CodeBlock", () => {
  const sampleCode = 'const greeting = "Hello, World!";';

  beforeEach(() => {
    // Mock the clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the code correctly", () => {
    render(<CodeBlock code={sampleCode} />);
    expect(screen.getByTestId("syntax-highlighter")).toHaveTextContent(
      sampleCode
    );
  });

  it("renders the language selector with default JavaScript option", () => {
    render(<CodeBlock code={sampleCode} />);
    const selector = screen.getByRole("combobox");
    expect(selector).toHaveValue("javascript");
  });

  it("changes the language when a new option is selected", () => {
    render(<CodeBlock code={sampleCode} />);
    const selector = screen.getByRole("combobox");
    fireEvent.change(selector, { target: { value: "python" } });
    expect(selector).toHaveValue("python");
  });

  it("renders the copy button with the correct icon", () => {
    render(<CodeBlock code={sampleCode} />);
    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });

  it("copies the code and shows the check icon when copy button is clicked", async () => {
    render(<CodeBlock code={sampleCode} />);
    const copyButton = screen.getByRole("button");
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(sampleCode);
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("copy-icon")).not.toBeInTheDocument();
  });

  it("trims the code before rendering", () => {
    const untrimmedCode = "  \n  const x = 5;  \n  ";
    render(<CodeBlock code={untrimmedCode} />);
    expect(screen.getByTestId("syntax-highlighter")).toHaveTextContent(
      "const x = 5;"
    );
  });

  it("renders all language options", () => {
    render(<CodeBlock code={sampleCode} />);
    const selector = screen.getByRole("combobox");
    expect(selector).toContainElement(screen.getByText("JavaScript"));
    expect(selector).toContainElement(screen.getByText("Python"));
    expect(selector).toContainElement(screen.getByText("Java"));
    expect(selector).toContainElement(screen.getByText("C++"));
    expect(selector).toContainElement(screen.getByText("C#"));
  });
});
