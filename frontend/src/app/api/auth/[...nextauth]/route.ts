import NextAuth, { type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const NETWORK_ERROR_INDICATORS = [
  "fetch",
  "network",
  "econnrefused",
  "enotfound",
  "econnreset",
  "etimedout",
  "timeout",
];

type BackendUser = {
  id: number;
  email: string;
  full_name?: string | null;
};

type TokenResponse = {
  access_token?: string;
  token_type?: string;
};

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.clone().json();
    if (typeof data === "string") {
      return data;
    }
    if (data && typeof data === "object") {
      const candidates = [data.detail, data.message, data.error, data.error_description];
      for (const candidate of candidates) {
        if (typeof candidate === "string" && candidate.trim()) {
          return candidate.trim();
        }
      }
      return JSON.stringify(data);
    }
  } catch (error) {
    // Ignore and fall back to text
  }

  const fallback = (await response.text().catch(() => "")).trim();
  if (fallback) {
    return fallback;
  }

  if (response.status) {
    return `Request failed with status ${response.status}`;
  }

  return "Request failed";
}

async function parseTokenResponse(response: Response): Promise<TokenResponse> {
  try {
    return (await response.clone().json()) as TokenResponse;
  } catch (error) {
    const message = await extractErrorMessage(response);
    console.error("Auth: Failed to parse token response", error);
    throw new Error(message || "Invalid response from authentication service");
  }
}

async function fetchBackendUser(accessToken: string): Promise<BackendUser> {
  const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userRes.ok) {
    const message = await extractErrorMessage(userRes);
    console.error("Auth: Failed to fetch user info", userRes.status, message);
    throw new Error(message || "Failed to load user profile from backend");
  }

  try {
    return await userRes.json();
  } catch (error) {
    console.error("Auth: Failed to parse user info", error);
    throw new Error("Failed to parse user profile from backend");
  }
}

async function buildSessionUser(tokenResponse: TokenResponse) {
  if (!tokenResponse?.access_token) {
    throw new Error("Authentication succeeded but no access token was returned.");
  }

  const userData = await fetchBackendUser(tokenResponse.access_token);

  return {
    id: String(userData.id),
    email: userData.email,
    name: userData.full_name || userData.email,
    accessToken: tokenResponse.access_token,
    backendUserId: userData.id,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Only include OAuth providers if credentials are configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
    ...(process.env.LINKEDIN_ID && process.env.LINKEDIN_SECRET
      ? [
          LinkedIn({
            clientId: process.env.LINKEDIN_ID,
            clientSecret: process.env.LINKEDIN_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        full_name: { label: "Full Name", type: "text", required: false },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Auth: Missing email or password");
          return null;
        }
        
        if (!BACKEND_URL) {
          console.error("Auth: BACKEND_URL is not configured");
          throw new Error("Backend URL is not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.");
        }
        
        try {
          // Try login first
          const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (loginRes.ok) {
            const loginData = await parseTokenResponse(loginRes);
            return await buildSessionUser(loginData);
          }

          const loginMessage = await extractErrorMessage(loginRes);

          // If login fails and we have full_name, try registration
          if (credentials.full_name && loginRes.status === 401) {
            const registerRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                full_name: credentials.full_name,
              }),
            });

            if (registerRes.ok) {
              const registerData = await parseTokenResponse(registerRes);
              return await buildSessionUser(registerData);
            }

            const registerMessage = await extractErrorMessage(registerRes);
            console.error("Auth: Registration failed", registerRes.status, registerMessage);
            throw new Error(registerMessage || "Registration failed");
          }

          console.error("Auth: Login failed", loginRes.status, loginMessage);
          throw new Error(loginMessage || "Invalid email or password");
        } catch (error) {
          console.error("Auth error:", error);
          if (error instanceof Error) {
            const message = error.message.toLowerCase();
            if (NETWORK_ERROR_INDICATORS.some((indicator) => message.includes(indicator))) {
              throw new Error(`Cannot connect to backend at ${BACKEND_URL}. Please check if the backend is running.`);
            }
            throw error;
          }
          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.backendUserId = (user as any).backendUserId;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      
      // OAuth providers - create/link account in backend
      if (account && user && account.provider !== "credentials") {
        try {
          // Create or get user in backend
          const oauthEmail = user.email;
          const oauthName = user.name || oauthEmail;
          
          if (!oauthEmail) {
            console.error("OAuth: No email provided");
            return token;
          }

          // Use OAuth endpoint to create or get user
          const oauthRes = await fetch(`${BACKEND_URL}/api/auth/oauth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: oauthEmail,
              name: oauthName,
              provider: account.provider,
            }),
          });

          if (oauthRes.ok) {
            const oauthData = await oauthRes.json();
            token.accessToken = oauthData.access_token;
            token.provider = account.provider;
            
            // Get user info to store backendUserId
            const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
              headers: { Authorization: `Bearer ${oauthData.access_token}` },
            });
            if (userRes.ok) {
              const userData = await userRes.json();
              token.backendUserId = userData.id;
            }
          } else {
            const errorText = await oauthRes.text().catch(() => "");
            console.error("OAuth: Failed to create/get user in backend", oauthRes.status, errorText);
          }
        } catch (error) {
          console.error("OAuth error:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session as any).accessToken = token.accessToken;
        (session as any).backendUserId = token.backendUserId;
        (session as any).id = token.id;
        if (token.email) session.user.email = token.email as string;
        if (token.name) session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  secret: process.env.AUTH_SECRET || "your-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


