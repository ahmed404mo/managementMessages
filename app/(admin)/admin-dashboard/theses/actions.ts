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
      return { error: "يرجى ملء جميع البيانات الأساسية" };
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
            ...doctorIds.map(id => ({
              doctorId: id,
              supervisionRole: "مشرف داخلي"
            })),
            ...externalIds.map(id => ({
              externalExaminerId: id,
              supervisionRole: "مناقش خارجي"
            }))
          ]
        }
      }
    });

    revalidatePath("/admin-dashboard");
    revalidatePath("/admin-dashboard/theses"); // تأكد من اسم المسار عندك
    return { success: true };
  } catch (error: any) {
    console.error("PRISMA ERROR:", error);
    return { error: "حدث خطأ أثناء حفظ الرسالة في قاعدة البيانات" };
  }
}