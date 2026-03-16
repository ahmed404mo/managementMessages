"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * حذف رسالة علمية نهائياً
 * سيقوم بحذف الإشراف المرتبط بها تلقائياً بسبب (onDelete: Cascade) في السكيما
 */
export async function deleteThesis(id: string) {
  try {
    await prisma.thesis.delete({
      where: { id },
    });
    revalidatePath("/admin-dashboard/theses");
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, error: "فشل حذف الرسالة" };
  }
}

/**
 * تحديث حالة الرسالة (مثلاً من قيد التجهيز إلى مجازة)
 */
export async function updateThesisStatus(id: string, newStatus: "PENDING" | "IN_PROGRESS" | "APPROVED") {
  try {
    await prisma.thesis.update({
      where: { id },
      data: { status: newStatus },
    });
    revalidatePath("/admin-dashboard/theses");
    return { success: true };
  } catch (error) {
    return { success: false, error: "فشل تحديث الحالة" };
  }
}

/**
 * إضافة رسالة علمية جديدة
 */
export async function createThesis(data: {
  title: string;
  studentName: string;
  type: "MASTER" | "PHD";
  status: "PENDING" | "IN_PROGRESS" | "APPROVED";
}) {
  try {
    const thesis = await prisma.thesis.create({
      data: {
        title: data.title,
        studentName: data.studentName,
        type: data.type,
        status: data.status,
      },
    });
    revalidatePath("/admin-dashboard/theses");
    return { success: true, id: thesis.id };
  } catch (error) {
    return { success: false, error: "فشل إضافة الرسالة" };
  }
}