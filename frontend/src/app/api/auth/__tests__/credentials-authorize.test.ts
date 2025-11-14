process.env.NEXT_PUBLIC_BACKEND_URL = "http://backend.test";
process.env.AUTH_SECRET = "test-secret";

jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next-auth/providers/google", () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock("next-auth/providers/github", () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock("next-auth/providers/linkedin", () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock("next-auth/providers/credentials", () => ({
  __esModule: true,
  default: (config: any) => ({ id: "credentials", ...config }),
}));

import type { NextAuthOptions } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

const mockFetch = global.fetch as unknown as jest.Mock;

type AuthorizeFn = (
  credentials: Record<string, unknown> | undefined,
  req: any
) => Promise<any>;

function getCredentialsAuthorize(options: NextAuthOptions): AuthorizeFn {
  const provider = options.providers.find(
    (item: any) => item.id === "credentials"
  ) as { authorize?: AuthorizeFn } | undefined;

  if (!provider || typeof provider.authorize !== "function") {
    throw new Error("Credentials provider not configured");
  }

  return provider.authorize as AuthorizeFn;
}

function createFetchResponse({
  status,
  body,
  contentType,
}: {
  status: number;
  body: any;
  contentType?: string;
}) {
  const headerValue =
    contentType || (typeof body === "string" ? "text/plain" : "application/json");
  const headers = {
    get(name: string) {
      return name.toLowerCase() === "content-type" ? headerValue : null;
    },
  };

  const textValue =
    typeof body === "string" ? body : JSON.stringify(body ?? {});

  const json = jest.fn(async () => {
    if ((headers.get("Content-Type") || "").includes("json")) {
      if (typeof body === "string") {
        return JSON.parse(body || "{}");
      }
      return body;
    }
    throw new Error("Invalid JSON");
  });

  const text = jest.fn(async () => textValue);

  const response: any = {
    ok: status >= 200 && status < 300,
    status,
    headers,
    json,
    text,
    clone: jest.fn(() =>
      createFetchResponse({ status, body, contentType: headers.get("Content-Type") || undefined })
    ),
  };

  return response;
}

describe("Credentials authorize", () => {
  let authorize: AuthorizeFn;

  beforeAll(() => {
    authorize = getCredentialsAuthorize(authOptions);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logs in successfully with credentials", async () => {
    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({ status: 200, body: { access_token: "token-123" } })
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          status: 200,
          body: {
            id: 42,
            email: "user@example.com",
            full_name: "Test User",
            is_active: true,
          },
        })
      );

    const result = await authorize(
      {
        email: "user@example.com",
        password: "secret",
      },
      undefined as any
    );

    expect(result).toEqual({
      id: "42",
      email: "user@example.com",
      name: "Test User",
      accessToken: "token-123",
      backendUserId: 42,
    });

    expect(mockFetch).toHaveBeenNthCalledWith(
      1,
      "http://backend.test/api/auth/login",
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(mockFetch).toHaveBeenNthCalledWith(
      2,
      "http://backend.test/api/auth/me",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token-123" }),
      })
    );
  });

  it("registers a new user when login returns 401 and full name provided", async () => {
    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          status: 401,
          body: { detail: "Invalid credentials" },
        })
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          status: 200,
          body: { access_token: "token-new" },
        })
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          status: 200,
          body: {
            id: 7,
            email: "new@example.com",
            full_name: "New User",
          },
        })
      );

    const result = await authorize(
      {
        email: "new@example.com",
        password: "secret",
        full_name: "New User",
      },
      undefined as any
    );

    expect(result).toEqual({
      id: "7",
      email: "new@example.com",
      name: "New User",
      accessToken: "token-new",
      backendUserId: 7,
    });

    expect(mockFetch).toHaveBeenNthCalledWith(1, "http://backend.test/api/auth/login", expect.any(Object));
    expect(mockFetch).toHaveBeenNthCalledWith(2, "http://backend.test/api/auth/register", expect.any(Object));
  });

  it("throws an error when registration fails", async () => {
    mockFetch
      .mockResolvedValueOnce(
        createFetchResponse({
          status: 401,
          body: { detail: "Invalid credentials" },
        })
      )
      .mockResolvedValueOnce(
        createFetchResponse({
          status: 400,
          body: { detail: "Email already registered" },
        })
      );

    await expect(
      authorize(
        {
          email: "existing@example.com",
          password: "secret",
          full_name: "Existing User",
        },
        undefined as any
      )
    ).rejects.toThrow("Email already registered");
  });

  it("throws a helpful error when backend returns non-JSON text", async () => {
    mockFetch.mockResolvedValueOnce(
      createFetchResponse({
        status: 500,
        body: "Internal Server Error",
        contentType: "text/plain",
      })
    );

    await expect(
      authorize(
        {
          email: "user@example.com",
          password: "secret",
        },
        undefined as any
      )
    ).rejects.toThrow("Internal Server Error");
  });

  it("throws a network error when fetch fails", async () => {
    mockFetch.mockRejectedValueOnce(new Error("connect ECONNREFUSED"));

    await expect(
      authorize(
        {
          email: "user@example.com",
          password: "secret",
        },
        undefined as any
      )
    ).rejects.toThrow("Cannot connect to backend");
  });
});
