
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://itechsolution.vercel.app",
  ],

  emailAndPassword: {
    enabled: true,
  },

  plugins: [bearer()],
});
