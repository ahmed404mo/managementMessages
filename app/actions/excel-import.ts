"use server";

import prisma from "@/lib/prisma"; // تأكد من مسار Prisma Client الخاص بك
import { revalidatePath } from "next/cache";

// بناءً على الصور المرفقة، هذه هي بنية البيانات المتوقعة من الإكسل
interface ExcelUserRow {
  "User Id": string | number;
  "Dr Name": string;
  "Password": string | number;
}

export async function importUsers(data: ExcelUserRow[]) {
  try {
    // 1. تجهيز البيانات لتتناسب مع الـ Prisma Schema الخاص بك
    const usersToInsert = data.map((row) => ({
      userId: String(row["User Id"]), 
      name: row["Dr Name"],
      // يُفضل تشفير البلوورد هنا باستخدام bcrypt إذا كنت تستخدم credentials في NextAuth
      password: String(row["Password"]), 
      role: "DOCTOR", // أو أي دور افتراضي
    }));

    // 2. إدخال البيانات دفعة واحدة (Bulk Insert)
    // نستخدم skipDuplicates لتجنب الأخطاء إذا كان اليوزر موجود مسبقاً
    const result = await prisma.user.createMany({
      data: usersToInsert,
      skipDuplicates: true, 
    });

    // 3. تحديث مسار صفحة الأدمن لتظهر البيانات الجديدة فوراً
    revalidatePath("/admin-dashboard/doctors");

    return { success: true, count: result.count };
  } catch (error) {
    console.error("Error importing users:", error);
    return { success: false, error: "حدث خطأ أثناء استيراد البيانات" };
  }
}
