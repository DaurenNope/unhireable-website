import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { JobCardStack } from "@/components/matches/JobCardStack";

jest.mock("../../matches/JobCard", () => {
  const Actual = jest.requireActual("../../matches/JobCard");
  return {
    ...Actual,
    JobCard: ({ job }: any) => (
      <div data-testid="job-card">{job.title}</div>
    ),
  };
});

describe("JobCardStack", () => {
  it("renders cards by default", () => {
    render(<JobCardStack filters={{ role: "", level: null, location: "", remote: null, tech: [] }} />);
    expect(screen.getAllByTestId("job-card").length).toBeGreaterThan(0);
  });

  it("shows empty state when no matches", () => {
    render(<JobCardStack filters={{ role: "nonexistent", level: null, location: "", remote: null, tech: [] }} />);
    expect(screen.getByText(/No matches yet/i)).toBeInTheDocument();
  });
});


