import NextAuth, { type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
            const loginData = await loginRes.json();
            if (!loginData.access_token) {
              console.error("Auth: No access_token in login response", loginData);
              return null;
            }
            
            // Get user info from backend
            const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
              headers: {
                Authorization: `Bearer ${loginData.access_token}`,
              },
            });
            
            if (userRes.ok) {
              const userData = await userRes.json();
              return {
                id: String(userData.id),
                email: userData.email,
                name: userData.full_name || userData.email,
                accessToken: loginData.access_token,
                backendUserId: userData.id,
              };
            } else {
              console.error("Auth: Failed to fetch user info", userRes.status, await userRes.text().catch(() => ""));
            }
          } else {
            const errorText = await loginRes.text().catch(() => "");
            console.error("Auth: Login failed", loginRes.status, errorText);
          }

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
              const registerData = await registerRes.json();
              if (!registerData.access_token) {
                console.error("Auth: No access_token in register response", registerData);
                return null;
              }
              
              // Get user info from backend
              const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
                headers: {
                  Authorization: `Bearer ${registerData.access_token}`,
                },
              });
              
              if (userRes.ok) {
                const userData = await userRes.json();
                return {
                  id: String(userData.id),
                  email: userData.email,
                  name: userData.full_name || userData.email,
                  accessToken: registerData.access_token,
                  backendUserId: userData.id,
                };
              }
            } else {
              // Registration failed - email might already exist
              const errorData = await registerRes.json().catch(() => ({}));
              console.error("Auth: Registration failed", registerRes.status, errorData);
              throw new Error(errorData.detail || "Registration failed");
            }
          }

          // Login failed and no registration attempted
          const errorText = await loginRes.text().catch(() => "");
          console.error("Auth: Login failed - no registration attempted", loginRes.status, errorText);
          throw new Error(errorText || "Invalid email or password");
        } catch (error) {
          console.error("Auth error:", error);
          if (error instanceof Error && error.message.includes("fetch")) {
            console.error("Auth: Network error - is backend running?", BACKEND_URL);
            throw new Error(`Cannot connect to backend at ${BACKEND_URL}. Please check if the backend is running.`);
          }
          if (error instanceof Error) {
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

          // Try to get existing user or create new one
          let backendToken = null;
          let backendUserId = null;

          // First, try to login (user might already exist)
          const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: oauthEmail,
              password: "oauth_user_no_password", // Dummy password for OAuth users
            }),
          });

          if (loginRes.ok) {
            const loginData = await loginRes.json();
            backendToken = loginData.access_token;
            
            // Get user info
            const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
              headers: { Authorization: `Bearer ${backendToken}` },
            });
            if (userRes.ok) {
              const userData = await userRes.json();
              backendUserId = userData.id;
            }
          } else {
            // User doesn't exist, create new one
            const registerRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: oauthEmail,
                password: `oauth_${account.provider}_${Date.now()}`, // Generate unique password
                full_name: oauthName,
              }),
            });

            if (registerRes.ok) {
              const registerData = await registerRes.json();
              backendToken = registerData.access_token;
              
              // Get user info
              const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${backendToken}` },
              });
              if (userRes.ok) {
                const userData = await userRes.json();
                backendUserId = userData.id;
              }
            } else {
              console.error("OAuth: Failed to create user in backend", await registerRes.text().catch(() => ""));
            }
          }

          // Store backend token and user ID
          if (backendToken && backendUserId) {
            token.accessToken = backendToken;
            token.backendUserId = backendUserId;
            token.provider = account.provider;
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


