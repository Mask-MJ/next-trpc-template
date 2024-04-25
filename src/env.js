import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const CheckString = z
  .string()
  .min(1, { message: 'Must be 1 or more characters long' })

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    // Database
    POSTGRES_DB: CheckString,
    POSTGRES_USER: CheckString,
    POSTGRES_PASSWORD: CheckString,
    DATABASE_PORT: CheckString,
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes('YOUR_POSTGRES_URL_HERE'),
        'You forgot to change the default URL'
      ),

    // Next Auth https://next-auth.js.org/deployment.
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url()
    ),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string()
        : z.string().optional(),

    // Email (Postmark)
    SMTP_FROM: CheckString,
    POSTMARK_API_TOKEN: CheckString,
    POSTMARK_SIGN_IN_TEMPLATE: CheckString,
    POSTMARK_ACTIVATION_TEMPLATE: CheckString,

    // Github Provider
    GITHUB_CLIENT_ID: CheckString,
    GITHUB_CLIENT_SECRET: CheckString,
    // GITHUB_ACCESS_TOKEN: CheckString,

    // Google Provider
    GOOGLE_CLIENT_ID: CheckString,
    GOOGLE_CLIENT_SECRET: CheckString,

    // Discord
    DISCORD_CLIENT_ID: CheckString,
    DISCORD_CLIENT_SECRET: CheckString,
  },
  client: {
    // NEXT_PUBLIC_APP_URL: CheckString,
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,

    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_URL: process.env.DATABASE_URL,

    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

    SMTP_FROM: process.env.SMTP_FROM,
    POSTMARK_API_TOKEN: process.env.POSTMARK_API_TOKEN,
    POSTMARK_SIGN_IN_TEMPLATE: process.env.POSTMARK_SIGN_IN_TEMPLATE,
    POSTMARK_ACTIVATION_TEMPLATE: process.env.POSTMARK_ACTIVATION_TEMPLATE,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
