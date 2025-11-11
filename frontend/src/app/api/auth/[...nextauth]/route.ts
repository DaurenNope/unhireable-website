import NextAuth, { type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHub({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_ID || "",
      clientSecret: process.env.LINKEDIN_SECRET || "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        full_name: { label: "Full Name", type: "text", required: false },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
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
            }
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
              throw new Error(errorData.detail || "Registration failed");
            }
          }

          // Login failed and no registration attempted
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
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
          // For OAuth, we need to create or link the account in our backend
          // For now, we'll just store the OAuth info
          // TODO: Implement OAuth user creation/linking in backend
          token.accessToken = account.access_token;
          token.provider = account.provider;
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


