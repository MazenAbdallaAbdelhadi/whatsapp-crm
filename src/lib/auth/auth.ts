import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, twoFactor, organization } from "better-auth/plugins";

import prisma from "@/lib/prisma";

import { sendDeleteAccountVerificationEmail } from "@/lib/mail/delete-account-verification";
import { sendOrganizationInviteEmail } from "@/lib/mail/organization-invite-email";
import { sendEmailVerificationEmail } from "@/lib/mail/verification-email";
import { sendPasswordResetEmail } from "@/lib/mail/password-reset-email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await sendEmailVerificationEmail({
          user: { ...user, email: newEmail },
          url,
        })
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerificationEmail({ user, url })
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url })
    },
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({ user, url })
    },
  },

  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },

    discord: {
      enabled: true,
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  plugins: [
    nextCookies(),
    twoFactor(),
    admin({ defaultRole: "user" }),
    organization({
      sendInvitationEmail: async ({
        email,
        organization,
        inviter,
        invitation,
      }) => {
        await sendOrganizationInviteEmail({
          invitation,
          inviter: inviter.user,
          organization,
          email,
        })
      },
    })
  ],
  
  databaseHooks: {
    session: {
      create: {
        before: async (userSession) => {
          const membership = await prisma.member.findFirst({
            where: {
              userId: userSession.userId
            },
            orderBy: {
              createdAt: "desc"
            },
            select: { organizationId: true },
          })

          return {
            data: {
              ...userSession,
              activeOrganizationId: membership?.organizationId,
            },
          }
        }
      }
    }
  }
});
