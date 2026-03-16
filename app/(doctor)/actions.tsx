"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// جلب العدد (موجودة مسبقاً)
export async function getUnreadNotificationsCount() {
  try {
    return await prisma.notification.count({
      where: { read: false },
    });
  } catch { return 0; }
}

// الدالة الجديدة: تحديث كل الإشعارات لتصبح "مقروءة"
export async function markAllNotificationsAsRead() {
  try {
    await prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });
    return { success: true };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false };
  }
}