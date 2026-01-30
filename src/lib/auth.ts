import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: true,
      },
      phone_number: {
        type: "string",
        required: false,
      },
      date_of_birth: {
        type: "string",
        required: true,
      },
      default_shipping_address: {
        type: "string",
        required: true,
      },
      blood_type: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [
    // admin({
    //   defaultRole: "CUSTOMER",
    // }),
  ],
  emailAndPassword: {
    enabled: true,
  },
});
