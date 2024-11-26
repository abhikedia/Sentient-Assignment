import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MessageWindow } from "@/components/messages";
import { useStream } from "@/hooks/useStream";
import { useVirtualizer } from "@tanstack/react-virtual";

// Mock the hooks
jest.mock("@/hooks/useStream", () => ({
  useStream: jest.fn(),
}));

jest.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: jest.fn(),
}));

// Mock the CodeBlock component
jest.mock("@/components/messages/codeBlock.tsx", () => ({
  CodeBlock: ({ code }: { code: string }) => (
    <div data-testid="code-block">{code}</div>
  ),
}));

describe("MessageWindow", () => {
  const mockMessages = [
    { role: "user", content: "Hello" },
    { role: "assistant", content: "Hi there!" },
    { role: "user", content: "How are you?" },
    { role: "assistant", content: "I'm doing well, thank you!" },
  ];

  const mockVirtualItems = [
    { index: 0, key: "0", size: 100, start: 0 },
    { index: 1, key: "1", size: 100, start: 100 },
    { index: 2, key: "2", size: 100, start: 200 },
    { index: 3, key: "3", size: 100, start: 300 },
  ];

  beforeEach(() => {
    (useStream as jest.Mock).mockReturnValue({
      messages: mockMessages,
      isStreaming: false,
    });

    (useVirtualizer as jest.Mock).mockReturnValue({
      getVirtualItems: () => mockVirtualItems,
      getTotalSize: () => 400,
    });
  });

  it("renders messages correctly", () => {
    render(<MessageWindow />);

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
    expect(screen.getByText("How are you?")).toBeInTheDocument();
    expect(screen.getByText("I'm doing well, thank you!")).toBeInTheDocument();
  });

  it('shows "AI is typing..." when streaming', () => {
    (useStream as jest.Mock).mockReturnValue({
      messages: mockMessages,
      isStreaming: true,
    });

    render(<MessageWindow />);

    expect(screen.getByText("AI is typing...")).toBeInTheDocument();
  });

  it('does not show "AI is typing..." when not streaming', () => {
    render(<MessageWindow />);

    expect(screen.queryByText("AI is typing...")).not.toBeInTheDocument();
  });

  it("renders the correct number of messages", () => {
    render(<MessageWindow />);

    const messageElements = screen
      .getAllByRole("generic")
      .filter((el) => el.className.includes("rounded-lg"));
    expect(messageElements).toHaveLength(mockMessages.length);
  });

  it("applies correct classes for user and AI messages", () => {
    render(<MessageWindow />);

    const userMessages = screen.getAllByText("You");
    const aiMessages = screen.getAllByText("AI");

    userMessages.forEach((msg) => {
      expect(msg.closest("div")).toHaveClass("font-semibold", "mb-2");
    });

    aiMessages.forEach((msg) => {
      expect(msg.closest("div")).toHaveClass("font-semibold", "mb-2");
    });
  });

  it("renders CodeBlock for content within triple backticks", () => {
    const messagesWithCode = [
      { role: "user", content: "Here is some code: ```const x = 5;```" },
      {
        role: "assistant",
        content: 'Here is some more code: ```console.log("Hello");```',
      },
    ];

    (useStream as jest.Mock).mockReturnValue({
      messages: messagesWithCode,
      isStreaming: false,
    });

    (useVirtualizer as jest.Mock).mockReturnValue({
      getVirtualItems: () => [
        { index: 0, key: "0", size: 100, start: 0 },
        { index: 1, key: "1", size: 100, start: 100 },
      ],
      getTotalSize: () => 200,
    });

    render(<MessageWindow />);

    const codeBlocks = screen.getAllByTestId("code-block");
    expect(codeBlocks).toHaveLength(2);
    expect(codeBlocks[0]).toHaveTextContent("const x = 5;");
    expect(codeBlocks[1]).toHaveTextContent('console.log("Hello");');
  });
});
