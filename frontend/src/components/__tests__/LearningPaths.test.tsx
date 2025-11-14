import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import LearningPathsPage from "@/app/learning-paths/page";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/learning-paths",
}));

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
      expect(screen.getByText(/No learning paths yet/i)).toBeInTheDocument();
    });
  });
});


