import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { JobCard, type JobMatch } from "@/components/matches/JobCard";

const job: JobMatch = {
  id: "j1",
  title: "Senior Frontend Engineer",
  company: "Vortex",
  location: "Remote",
  salary: "$150k",
  headline: "Make pixels dance and ship absurdly smooth UI.",
  type: "remote",
  difficulty: "senior",
  match_score: 88,
  required_skills: ["React", "TypeScript"],
  preferred_skills: ["GraphQL"],
  match_reasons: ["Strong React experience", "Culture fit looks aligned"],
  skill_gaps: [],
  culture_fit: { score: 82, summary: "Fast-paced, collaborative", highlights: ["Matches remote-first preference"], watchouts: [] },
  market_intelligence: {
    salary_comparison: { position: "above_average", industry_average: 140000, job_max: 180000 },
    competition_level: "medium",
    success_probability: 74,
    time_to_hire: "4-6 weeks",
  },
  growth_potential: { score: 80, narrative: "Series C rocket", metrics: { momentum: "rocket" } },
  negotiation_plan: {
    salary_anchor: "$185,000",
    counter_floor: "$175,000",
    leverage_points: ["You cover every core framework"],
    risk_flags: [],
    closing_move: "Ask for equity refresh at six months",
  },
  score_breakdown: {
    skills: 92,
    experience: 85,
    culture: 78,
    growth: 80,
    compensation: 75,
    total: 88,
  },
  culture_analysis: { work_style: "fast_paced" },
  location_alignment: true,
  interest_alignment: true,
  remote: true,
};

describe("JobCard interactions", () => {
  it("invokes onSwipe via keyboard arrows for top card", () => {
    const onSwipe = jest.fn();
    render(
      <JobCard
        job={job}
        index={0}
        isTop={true}
        onSwipe={onSwipe}
        onOpen={() => {}}
        onSave={() => {}}
        isSaved={false}
        isApplied={false}
      />
    );
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(onSwipe).toHaveBeenCalledWith("right");
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(onSwipe).toHaveBeenCalledWith("left");
  });

  it("opens detail on double click", () => {
    const onOpen = jest.fn();
    const { getByText } = render(
      <JobCard
        job={job}
        index={0}
        isTop={true}
        onSwipe={() => {}}
        onOpen={onOpen}
        onSave={() => {}}
        isSaved={false}
        isApplied={false}
      />
    );
    fireEvent.doubleClick(getByText(/Senior Frontend Engineer/i));
    expect(onOpen).toHaveBeenCalled();
  });
});


