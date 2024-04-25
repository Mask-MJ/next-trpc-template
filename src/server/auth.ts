import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { appConfig } from "@/config/app";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { Client } from "postmark";

import { env } from "@/env";
import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
const postmarkClient = new Client(env.POSTMARK_API_TOKEN);

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    EmailProvider({
      from: env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const user = await db.user.findUnique({
          where: { email: identifier },
          select: { emailVerified: true },
        });

        const templateId = user?.emailVerified
          ? env.POSTMARK_SIGN_IN_TEMPLATE
          : env.POSTMARK_ACTIVATION_TEMPLATE;
        if (!templateId) {
          throw new Error("Missing template id");
        }

        const result = await postmarkClient.sendEmailWithTemplate({
          TemplateId: parseInt(templateId),
          To: identifier,
          From: provider.from,
          TemplateModel: { action_url: url, product_name: appConfig.name },
          Headers: [
            { Name: "X-Entity-Ref-ID", Value: new Date().getTime() + "" },
          ],
        });

        if (result.ErrorCode) {
          throw new Error(result.Message);
        }
      },
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      httpOptions: { timeout: 40000 },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
