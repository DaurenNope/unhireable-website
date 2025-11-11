import { POST } from "@/app/api/newsletter/route";

function makeRequest(body: any) {
  return new Request("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as any;
}

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


