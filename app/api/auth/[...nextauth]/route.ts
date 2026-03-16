import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("الرجاء إدخال بيانات التسجيل كاملة");
        }

        const user = await prisma.user.findFirst({
          where: { doctorCode: credentials.username }
        });

        if (!user) {
          throw new Error("كود المستخدم غير مسجل بالنظام");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("كلمة المرور غير صحيحة");
        }

        return {
          id: user.id,
          name: user.name,
          role: user.role,
          academicTitle: user.academicTitle, // 👈 التعديل هنا: سحب الحقل الصحيح من الداتابيز
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.academicTitle = (user as any).academicTitle; // 👈 التعديل هنا: حفظه في التوكن
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).academicTitle = token.academicTitle; // 👈 التعديل هنا: تمريره للسيشن
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };