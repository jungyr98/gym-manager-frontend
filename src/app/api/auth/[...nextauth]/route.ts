import NextAuth, { NextAuthOptions } from "next-auth";
import { cookies } from "next/headers";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_VERSION, SERVER_API_URL } from "../../../../utils/global";

const authOptions: NextAuthOptions = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "아이디", type: "text", placeholder: "아이디" },
        pw: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.id || !credentials?.pw) {
          return null;
        }

        // 로그인 API

        const data = await fetch(
          `${SERVER_API_URL}/${API_VERSION}/auth/signin`,
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: credentials.id,
              pw: credentials.pw,
            }),
            credentials: "include",
          }
        )
          .then((res) => {
            return res.json();
          })
          .catch((e) => {
            console.error(e);
            return e;
          });

        if (data.status !== 200) {
          console.error(`로그인 실패 - `, data);
          throw new Error(data.status);
        }

        const user = data?.result?.account;
        const userToken = data?.result?.token;

        return {
          ...user,
          ...userToken,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token as any;
      return {
        ...session,
      };
    },
    async jwt({ token, user }) {
      const cookieStore = cookies();
      if (user) {
        if (cookieStore.getAll("accessToken").length === 0) {
          // ** NextAuth 사용 시, 해당 route.ts 에서 토큰에 대한 쿠키 최초 설정 필요 **
          cookieStore.set("accessToken", user.accessToken.toString());
          cookieStore.set("refreshToken", user.refreshToken.toString() ?? "", {
            path: "/",
            secure: false,
            sameSite: "lax",
            httpOnly: true,
          });
        }
      }

      if (user) return { ...token, ...user };
      else return token;
    },
  },
  pages: {
    signIn: `${process.env.NEXT_PUBLIC_NEXT_HOST}`,
    signOut: `${process.env.NEXT_PUBLIC_NEXT_HOST}`,
    error: `${process.env.NEXT_PUBLIC_NEXT_HOST}`,
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {},
});

export { authOptions as GET, authOptions as POST };
