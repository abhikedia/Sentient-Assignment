import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlaygroundContent from '@/components/playground';
import { useStream } from '@/hooks/useStream';

// Mock the useStream hook
jest.mock('@/hooks/useStream', () => ({
  useStream: jest.fn(),
}));

// Mock the MessageWindow component
jest.mock('@/components/messages', () => ({
  MessageWindow: () => <div data-testid="message-window">Message Window</div>,
}));

// Mock the ModelControlCenter component
jest.mock('@/components/controls', () => ({
  __esModule: true,
  default: () => <div data-testid="model-control-center">Model Control Center</div>,
}));

describe('PlaygroundContent', () => {
  const mockSendMessage = jest.fn();
  const mockClearConversation = jest.fn();

  beforeEach(() => {
    (useStream as jest.Mock).mockReturnValue({
      sendMessage: mockSendMessage,
      isStreaming: false,
      clearConversation: mockClearConversation,
    });
  });

  it('renders correctly', () => {
    render(<PlaygroundContent />);
    
    expect(screen.getByText('Clear Conversation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your message here...')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByTestId('message-window')).toBeInTheDocument();
    expect(screen.getByTestId('model-control-center')).toBeInTheDocument();
  });

  it('handles input change', () => {
    render(<PlaygroundContent />);
    const input = screen.getByPlaceholderText('Enter your message here...');
    
    fireEvent.change(input, { target: { value: 'Hello, AI!' } });
    expect(input).toHaveValue('Hello, AI!');
  });

  it('sends message when Send button is clicked', () => {
    render(<PlaygroundContent />);
    const input = screen.getByPlaceholderText('Enter your message here...');
    const sendButton = screen.getByText('Send');
    
    fireEvent.change(input, { target: { value: 'Hello, AI!' } });
    fireEvent.click(sendButton);
    
    expect(mockSendMessage).toHaveBeenCalledWith('Hello, AI!');
    expect(input).toHaveValue('');
  });

  it('clears conversation when Clear Conversation button is clicked', () => {
    render(<PlaygroundContent />);
    const clearButton = screen.getByText('Clear Conversation');
    
    fireEvent.click(clearButton);
    
    expect(mockClearConversation).toHaveBeenCalled();
  });

  it('disables input and buttons when streaming', () => {
    (useStream as jest.Mock).mockReturnValue({
      sendMessage: mockSendMessage,
      isStreaming: true,
      clearConversation: mockClearConversation,
    });

    render(<PlaygroundContent />);
    
    expect(screen.getByPlaceholderText('Enter your message here...')).toBeDisabled();
    expect(screen.getByText('Clear Conversation')).toBeDisabled();
    expect(screen.getByText('Generating...')).toBeDisabled();
  });
});

