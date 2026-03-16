"use server";
import { prisma } from "@/lib/prisma";

export async function updateProfileImage(userId: string, imageBase64: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { image: imageBase64 } 
    });
    return { success: true };
  } catch (error) {
    return { error: "فشل تحديث الصورة" };
  }
}

// 👈 الدالة الجديدة دي اللي هنسحب بيها الصورة بأمان
export async function getUserProfileImage(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true }
    });
    return user?.image || null;
  } catch (error) {
    return null;
  }
}