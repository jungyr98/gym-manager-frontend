import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: User;
  }
}
