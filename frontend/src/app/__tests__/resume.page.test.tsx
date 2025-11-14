import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ResumePage from "@/app/resume/page";

const mockUseSession = jest.fn(() => ({ data: null, status: "unauthenticated" }));

jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/resume",
}));

jest.mock("@/lib/analytics", () => ({
  track: jest.fn(),
}));

jest.mock("@/components/resume/ResumeBuilder", () => ({
  ResumeBuilder: ({ onDownload }: any) => (
    <div>
      <button onClick={() => onDownload?.({ data: {}, download: () => {} })}>Mock Download</button>
    </div>
  ),
}));

describe("ResumePage", () => {
  afterEach(() => {
    mockUseSession.mockReset();
  });

  it("shows login banner when unauthenticated", () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
    render(<ResumePage />);

    expect(
      screen.getByText(/EXPORTS STAY LOCAL UNTIL YOU SIGN IN/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute("href", "/login");
  });

  it("renders builder without login banner when authenticated", () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: "test@example.com" } },
      status: "authenticated",
    });

    render(<ResumePage />);

    expect(screen.queryByText(/EXPORTS STAY LOCAL/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Build a Resume the Agent Can Sell/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mock Download/i })).toBeInTheDocument();
  });
});
