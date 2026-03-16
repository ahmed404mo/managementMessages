"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function promoteDoctorAction(doctorId: string, newTitle: string) {
  const doctor = await prisma.facultyDoctor.findUnique({ where: { id: doctorId } });
  if (!doctor) return { error: "المشرف غير موجود" };

  try {
    await prisma.$transaction([
      prisma.promotion.create({
        data: {
          doctorId: doctorId,
          oldTitle: doctor.academicTitle,
          newTitle: newTitle
        }
      }),
      prisma.facultyDoctor.update({
        where: { id: doctorId },
        data: { academicTitle: newTitle }
      })
    ]);

    revalidatePath("/admin-dashboard/promotions");
    revalidatePath("/admin-dashboard/faculty-doctors"); // لتحديث الدرجة هناك أيضاً
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء تنفيذ الترقية" };
  }
}