import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import LearningPathsPage from "@/app/learning-paths/page";

describe("LearningPathsPage", () => {
  beforeEach(() => {
    // Mock fetch to return empty paths
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ paths: [] }),
    });
    // Mock localStorage
    // @ts-ignore
    global.localStorage = {
      getItem: () => "test-user",
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    };
  });

  it("renders header and empty state prompt", async () => {
    render(<LearningPathsPage />);
    expect(screen.getByText(/LEARNING PATHS/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/NO LEARNING PATHS YET/i)).toBeInTheDocument();
    });
  });
});


