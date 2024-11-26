import React from "react";
import { render, act, screen } from "@testing-library/react";
import { StreamProvider, StreamContext } from "@/context/StreamContext";
import { useModel } from "@/hooks/useModelConfig";
import { getAllMessages } from "@/utils/stream";
import { useChat } from "@ai-sdk/react";

// Mock dependencies
jest.mock("@/hooks/useModelConfig", () => ({
  useModel: jest.fn(),
}));
jest.mock("@/utils/stream", () => ({
  addMessage: jest.fn(),
  getAllMessages: jest.fn(),
  clearAllMessages: jest.fn(),
}));
jest.mock("@ai-sdk/react", () => ({
  useChat: jest.fn(),
}));

describe("StreamProvider", () => {
  const mockUseModel = useModel as jest.Mock;
  const mockGetAllMessages = getAllMessages as jest.Mock;
  const mockUseChat = useChat as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks
    mockUseModel.mockReturnValue({ config: { mockConfig: true } });
    mockGetAllMessages.mockResolvedValue([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there!" },
    ]);
    mockUseChat.mockReturnValue({
      messages: [],
      append: jest.fn(),
      reload: jest.fn(),
      stop: jest.fn(),
      isLoading: false,
    });
  });

  const renderProvider = () =>
    render(
      <StreamProvider>
        <StreamContext.Consumer>
          {(value) =>
            value && (
              <>
                <div data-testid="messages">
                  {value.messages.map((msg, index) => (
                    <div key={index}>
                      {msg.role}: {msg.content}
                    </div>
                  ))}
                </div>
                <button onClick={() => value.sendMessage("Test message")}>
                  Send Message
                </button>
                <button onClick={value.cancelGeneration}>Cancel</button>
                <button onClick={value.clearConversation}>Clear</button>
              </>
            )
          }
        </StreamContext.Consumer>
      </StreamProvider>
    );

  it("loads messages on mount", async () => {
    await act(async () => {
      renderProvider();
    });

    const messages = screen.getByTestId("messages");
    expect(messages).toHaveTextContent("user: Hello");
    expect(messages).toHaveTextContent("assistant: Hi there!");
    expect(mockGetAllMessages).toHaveBeenCalled();
  });

  it("calculates metrics while streaming", async () => {
    jest.useFakeTimers();
    const mockSetInterval = jest.spyOn(global, "setInterval");
    const mockClearInterval = jest.spyOn(global, "clearInterval");

    mockUseChat.mockReturnValueOnce({
      messages: [],
      append: jest.fn(),
      reload: jest.fn(),
      stop: jest.fn(),
      isLoading: true,
    });

    await act(async () => {
      renderProvider();
    });

    expect(mockSetInterval).toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(mockClearInterval).toHaveBeenCalled();
    jest.useRealTimers();
  });
});
