import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { jwt, twoFactor, username, multiSession, organization } from "better-auth/plugins";
import { prisma } from "./plugins/prisma";
import { notificationService } from "@/services";
import { corsConfig } from "./config";

/**
 * Derives the root domain for cross-subdomain support.
 * For maximum permissiveness in local development, it returns undefined 
 * to allow the browser to manage the default host.
 */
function getCookieDomain(): string | undefined {
  const firstOrigin = corsConfig.origin[0];
  if (!firstOrigin) return undefined;
  try {
    const hostname = new URL(firstOrigin).hostname;
    const parts = hostname.split(".");
    // Ensure we don't apply domain formatting to IP addresses or localhost
    if (parts.length < 2 || /^(?!0)(?!.*\.$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(hostname)) {
      return undefined;
    }
    return "." + parts.slice(-2).join(".");
  } catch {
    return undefined;
  }
}

const cookieDomain = getCookieDomain();

export const auth = betterAuth({
  // Permissive Origin & Host configuration
  trustedOrigins: corsConfig.origin,
  baseURL: process.env.BETTER_AUTH_URL,
  trustHost: true, 

  advanced: {
    // Permissive Cross-Origin/Subdomain Logic
    crossSubDomainCookies: {
      enabled: true,
      domain: cookieDomain,
    },
    // Disabling security checks for maximum compatibility across different clients/origins
    disableOriginCheck: true, 
    disableCSRFCheck: true,
    // Setting cookies to None allows them to be sent in cross-site requests (requires HTTPS)
    cookies: {
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true, // Required if SameSite is "none"
          domain: cookieDomain,
        }
      }
    }
  },

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  
  user: {
    additionalFields: {
      roleSlug: {
        type: "string",
        required: false,
        input: false
      },
      username: {
        type: "string",
        required: false,
        input: true
      },
      preferences: {
        type: "string",
        required: false,
        input: false
      },
      twoFactorEnabled: {
        type: "boolean",
        required: false,
        input: false
      }
    }
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    cookieCache: {
      enabled: false
    },
    // Ensure fresh sessions are always available across windows
    updateAge: 0 
  },

  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          try {
            const user = await prisma.user.findUnique({
              where: { id: session.userId },
              select: { name: true },
            });

            await notificationService.create({
              userId: session.userId,
              title: "Welcome back!",
              message: `Hello ${user?.name || 'there'}! You've successfully signed in to your account.`,
              type: "success"
            });
          } catch (error) {
            console.error("Failed to create login notification:", error);
          }
          return { data: session };
        },
      },
    }
  },

  plugins: [
    jwt(),
    twoFactor({
      issuer: process.env.APP_NAME
    }),
    username({
      usernameValidator: (username) => {
        return /^[a-zA-Z0-9_.-]+$/.test(username);
      }
    }),
    multiSession(),
    organization({
      creatorRole: "owner",
      defaultRole: "member",
      allowUserToCreateOrganization: true
    })
  ],
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session["user"];
export type AuthSession = Session["session"];
