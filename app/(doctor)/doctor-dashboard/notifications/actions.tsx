"use server";
import { prisma } from "@/lib/prisma"; // تأكد من مسار ملف الـ prisma client عندك

export async function getNotifications() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc' // الأحدث أولاً
      },
      take: 20 // جلب آخر 20 تنبيه فقط
    });
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}