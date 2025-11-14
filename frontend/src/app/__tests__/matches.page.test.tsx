import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import MatchesPage from "@/app/matches/page";

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ matches: [] }),
});

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/matches",
}));

jest.mock("@/lib/analytics", () => ({
  track: jest.fn(),
}));

jest.mock("@/components/matches/JobCardStack", () => ({
  JobCardStack: ({ jobs }: { jobs: any[] }) => (
    <div data-testid="job-card-stack">Stack ({jobs.length})</div>
  ),
}));

jest.mock("@/components/matches/FiltersDrawer", () => ({
  FiltersDrawer: () => <div data-testid="filters-drawer">Drawer</div>,
}));

describe("MatchesPage", () => {
  it("shows login banner for unauthenticated users", async () => {
    await act(async () => {
      render(<MatchesPage />);
    });

    expect(screen.getByText(/SIGN IN TO SYNC YOUR MATCHES/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute("href", "/login");
  });

  it("renders hero content", async () => {
    await act(async () => {
      render(<MatchesPage />);
    });

    expect(screen.getByText(/THE JOBS THAT DON’T SUCK/i)).toBeInTheDocument();
    expect(screen.getByTestId("job-card-stack")).toBeInTheDocument();
  });
});
