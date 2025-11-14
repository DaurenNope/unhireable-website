import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatbotContainer } from '../assessment/ChatbotContainer';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn();

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    };
  },
}));

describe.skip('ChatbotContainer', () => {
  const mockOnAssessmentComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <ChatbotContainer 
        userId="test-user" 
        onAssessmentComplete={mockOnAssessmentComplete} 
      />
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders chat interface after loading', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        questions: [
          {
            id: "test-question",
            type: "single_choice",
            question: "Test question?",
            options: ["Option 1", "Option 2"],
            required: true
          }
        ]
      })
    });

    render(
      <ChatbotContainer 
        userId="test-user" 
        onAssessmentComplete={mockOnAssessmentComplete} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test question?')).toBeInTheDocument();
    });
  });

  it('handles answer submission', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        questions: [
          {
            id: "test-question",
            type: "single_choice",
            question: "Test question?",
            options: ["Option 1", "Option 2"],
            required: true
          }
        ]
      })
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        answer_saved: true,
        next_question: {
          id: "next-question",
          type: "text_input",
          question: "Next question?",
          required: true
        }
      })
    });

    render(
      <ChatbotContainer 
        userId="test-user" 
        onAssessmentComplete={mockOnAssessmentComplete} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test question?')).toBeInTheDocument();
    });

    // Select an option and submit
    fireEvent.click(screen.getByText('Option 1'));
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/assessments/answer',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('test-question')
        })
      );
    });
  });

  it('handles assessment completion', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        questions: [
          {
            id: "test-question",
            type: "single_choice",
            question: "Test question?",
            options: ["Option 1", "Option 2"],
            required: true
          }
        ]
      })
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        answer_saved: true,
        assessment_complete: true
      })
    });

    render(
      <ChatbotContainer 
        userId="test-user" 
        onAssessmentComplete={mockOnAssessmentComplete} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('SURVIVED THE TORTURE!')).toBeInTheDocument();
    });

    expect(mockOnAssessmentComplete).toHaveBeenCalledWith({
      "test-question": "Option 1"
    });
  });

  it('handles API errors gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({
        questions: [
          {
            id: "test-question",
            type: "single_choice",
            question: "Test question?",
            options: ["Option 1", "Option 2"],
            required: true
          }
        ]
      })
    });

    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(
      <ChatbotContainer 
        userId="test-user" 
        onAssessmentComplete={mockOnAssessmentComplete} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test question?')).toBeInTheDocument();
    });

    // Select an option and submit
    fireEvent.click(screen.getByText('Option 1'));
    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(screen.getByText('Failed to save answer')).toBeInTheDocument();
    });
  });
});