import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { JobCard, type Job } from "@/components/matches/JobCard";

const job: Job = {
  id: "j1",
  title: "Senior Frontend Engineer",
  company: "Vortex",
  location: "Remote",
  remote: true,
  level: "Senior",
  tech: ["React", "TypeScript"],
  blurb: "Make pixels dance.",
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


