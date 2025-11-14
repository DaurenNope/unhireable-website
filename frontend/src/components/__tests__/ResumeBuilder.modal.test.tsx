import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ResumeBuilder } from "@/components/resume/ResumeBuilder";

describe("ResumeBuilder email modal + newsletter flow", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    // @ts-ignore
    global.localStorage = {
      getItem: jest.fn(() => null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0,
    };

    window.open = jest.fn(() => ({
      document: {
        open: jest.fn(),
        write: jest.fn(),
        close: jest.fn(),
      },
    })) as any;

    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = jest.fn();
  });

  it("prompts for email on first download and submits", async () => {
    render(<ResumeBuilder />);

    fireEvent.click(screen.getByRole("button", { name: /download pdf/i }));
    expect(screen.getByText(/Get Your Download/i)).toBeInTheDocument();

    // invalid email
    fireEvent.change(screen.getByPlaceholderText(/you@domain.com/i), { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(await screen.findByText(/Enter a valid email/i)).toBeInTheDocument();

    // valid email
    fireEvent.change(screen.getByPlaceholderText(/you@domain.com/i), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/newsletter",
        expect.objectContaining({ method: "POST" })
      );
    });
  });
});


