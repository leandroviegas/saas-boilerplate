import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { jwt, twoFactor, username, multiSession } from "better-auth/plugins";
import { prisma } from "./plugins/prisma";
import { notificationService } from "@/services";
import { organization } from "better-auth/plugins";
import { corsConfig } from "./config";

export const auth = betterAuth({
  trustedOrigins: corsConfig.origin,
  baseURL: process.env.BETTER_AUTH_URL,
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
    }
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
  trustHost: true,
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session["user"];
export type AuthSession = Session["session"];
