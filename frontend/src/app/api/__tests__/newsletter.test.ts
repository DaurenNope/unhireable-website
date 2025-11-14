jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: ResponseInit) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

import { POST } from "@/app/api/newsletter/route";

const makeRequest = (body: any) => ({
  json: async () => body,
}) as any;

describe("newsletter API route", () => {
  it("rejects invalid email", async () => {
    const res = await POST(makeRequest({ email: "bad" }));
    expect(res.status).toBe(400);
  });

  it("accepts valid email", async () => {
    const res = await POST(makeRequest({ email: "ok@example.com" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});


