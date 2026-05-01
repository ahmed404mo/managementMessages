"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addThesisAction(formData: FormData) {
  const title = formData.get("title") as string;
  const studentName = formData.get("studentName") as string;
  const type = formData.get("type") as any;
  const registrationDateString = formData.get("registrationDate") as string;
  
  const doctorIds = formData.getAll("doctorIds") as string[];
  const externalIds = formData.getAll("externalIds") as string[];

  if (!title || !studentName || !registrationDateString) {
    return { error: "جميع الحقول الأساسية مطلوبة" };
  }

  try {
    const registrationDate = new Date(registrationDateString);
    await prisma.thesis.create({
      data: {
        title,
        studentName,
        type,
        registrationDate,
        supervisors: {
          create: [
            ...doctorIds.map(id => ({ doctorId: id, supervisionRole: "مشرف داخلي" })),
            ...externalIds.map(id => ({ externalExaminerId: id, supervisionRole: "مناقش خارجي" }))
          ]
        }
      }
    });
    revalidatePath("/admin-dashboard");
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء الحفظ" };
  }
}

export async function updateThesisAction(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const studentName = formData.get("studentName") as string;
    const type = formData.get("type") as any;
    const registrationDate = new Date(formData.get("registrationDate") as string);

    await prisma.thesis.update({
      where: { id },
      data: { title, studentName, type, registrationDate }
    });

    revalidatePath("/admin-dashboard");
    return { success: true };
  } catch (error) {
    return { error: "فشل تحديث بيانات الرسالة" };
  }
}
export async function deleteThesisAction(id: string) {
  try {
    await prisma.thesis.delete({
      where: { id }
    });

    revalidatePath("/admin-dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { error: "حدث خطأ أثناء الحذف، تأكد من اتصال الإنترنت" };
  }
}