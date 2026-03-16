// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // التوكن اللي بيحتوي على بيانات اليوزر (بما فيها الـ role)
    const token = req.nextauth.token;
    // الرابط اللي اليوزر بيحاول يدخل عليه
    const path = req.nextUrl.pathname;

    // 1. حماية مسارات الأدمن: لو الرابط فيه admin واليوزر مش أدمن
    if (path.startsWith("/admin-dashboard") && token?.role !== "ADMIN") {
      // نطرده ونرجعه لصفحة الدكتور
      return NextResponse.redirect(new URL("/doctor-dashboard", req.url));
    }

    // 2. حماية مسارات الدكتور: لو الرابط فيه doctor واليوزر مش دكتور (مثلاً لو حبيت تمنع الأدمن)
    // لو حابب تخلي الأدمن يشوف كل حاجة، ممكن تلغي الشرط ده
    if (path.startsWith("/doctor-dashboard") && token?.role !== "DOCTOR") {
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }
  },
  {
    callbacks: {
      // الشرط الأساسي: لازم يكون معاه توكن (يعني مسجل دخول) عشان يدخل المسارات المحمية
      authorized: ({ token }) => !!token,
    },
  }
);

// تحديد المسارات اللي الـ Middleware هيتطبق عليها
export const config = {
  matcher: ["/admin-dashboard/:path*", "/doctor-dashboard/:path*"],
};