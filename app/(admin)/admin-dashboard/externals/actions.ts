"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. إضافة مناقش جديد
export async function addExternalAction(formData: FormData) {
  const name = formData.get("name") as string;
  const academicTitle = formData.get("academicTitle") as string;
  const universityName = formData.get("universityName") as string;
  const specialty = formData.get("specialty") as string;

  if (!name || !academicTitle || !universityName || !specialty) {
    return { error: "جميع الحقول مطلوبة" };
  }

  try {
    await prisma.externalExaminer.create({
      data: { name, academicTitle, universityName, specialty }
    });
    revalidatePath("/admin-dashboard/externals");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "حدث خطأ أثناء حفظ البيانات" };
  }
}

// 2. تحديث بيانات مناقش
export async function updateExternalAction(id: string, data: { name: string, academicTitle: string, universityName: string, specialty: string }) {
  try {
    await prisma.externalExaminer.update({
      where: { id },
      data: {
        name: data.name,
        academicTitle: data.academicTitle,
        universityName: data.universityName,
        specialty: data.specialty
      }
    });
    revalidatePath("/admin-dashboard/externals");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "فشل تحديث البيانات" };
  }
}

// 3. حذف مناقش
export async function deleteExternalAction(id: string) {
  try {
    await prisma.externalExaminer.delete({ where: { id } });
    revalidatePath("/admin-dashboard/externals");
    return { success: true };
  } catch (e) {
    return { error: "فشل الحذف" };
  }
}