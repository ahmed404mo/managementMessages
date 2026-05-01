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
    revalidatePath("/admin-dashboard/theses");
    return { success: true };
  } catch (error: any) {
    console.error("PRISMA ERROR:", error);
    return { error: "حدث خطأ أثناء حفظ الرسالة في قاعدة البيانات" };
  }
}

// ✅ دالة الإضافة الجماعية للرسائل (مع إنشاء المشرفين تلقائياً)
export async function bulkAddThesesAction(thesesData: any[]) {
  try {
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    let warningCount = 0;
    let newDoctorsCount = 0;
    
    for (let i = 0; i < thesesData.length; i++) {
      const thesis = thesesData[i];
      const rowNumber = thesis.م || (i + 1);
      
      // التحقق من البيانات الأساسية
      if (!thesis.اسم_الباحث || thesis.اسم_الباحث.length < 3) {
        results.push({ 
          error: `السطر ${rowNumber}: اسم الباحث "${thesis.اسم_الباحث || 'غير معروف'}" غير مكتمل`, 
          data: thesis,
          status: 'error'
        });
        errorCount++;
        continue;
      }

      if (!thesis.عنوان_الرسالة || thesis.عنوان_الرسالة.length < 5) {
        results.push({ 
          error: `السطر ${rowNumber}: عنوان الرسالة قصير جداً`, 
          data: thesis,
          status: 'error'
        });
        errorCount++;
        continue;
      }

      // تحديد نوع الرسالة
      let thesisType = "MASTER";
      const typeValue = (thesis.النوع || "").toString();
      if (typeValue.includes("دكتوراه") || typeValue === "PHD" || typeValue === "PhD") {
        thesisType = "PHD";
      } else if (typeValue.includes("ماجستير") || typeValue.includes("ماجيستير") || typeValue === "MASTER") {
        thesisType = "MASTER";
      }

      // تحديد حالة القيد
      let thesisStatus = "PENDING";
      const statusValue = (thesis.حالة_القيد || "").toString();
      if (statusValue === "قيد المناقشة" || statusValue === "IN_PROGRESS") {
        thesisStatus = "IN_PROGRESS";
      } else if (statusValue === "مجازة" || statusValue === "APPROVED" || statusValue === "مكتملة") {
        thesisStatus = "APPROVED";
      }

      let registrationDate = new Date();
      if (thesis.تاريخ_التسجيل && thesis.تاريخ_التسجيل !== '-') {
        registrationDate = new Date(thesis.تاريخ_التسجيل);
        if (isNaN(registrationDate.getTime())) {
          registrationDate = new Date();
        }
      }

      let defenseDate = null;
      if (thesis.تاريخ_المنح && thesis.تاريخ_المنح !== '-') {
        defenseDate = new Date(thesis.تاريخ_المنح);
        if (isNaN(defenseDate.getTime())) {
          defenseDate = null;
        }
      }

      // معالجة الملاحظات
      let notes = thesis.ملاحظات;
      if (notes === '-') notes = null;

      // نوع البحث
      let researchType = thesis.نوع_البحث;
      if (researchType === '-') researchType = null;

      // القسم
      let department = thesis.القسم;
      if (department === '-') department = null;

      try {
        // إنشاء الرسالة مع الحقول الجديدة
        const newThesis = await prisma.thesis.create({
          data: {
            title: thesis.عنوان_الرسالة,
            studentName: thesis.اسم_الباحث,
            type: thesisType as any,
            status: thesisStatus as any,
            registrationDate: registrationDate,
            defenseDate: defenseDate,
            department: department,
            notes: notes,
            researchType: researchType,
          },
        });
        
        // جمع أسماء المشرفين
        const supervisorNames = [];
        if (thesis.المشرف1 && thesis.المشرف1 !== '-') supervisorNames.push(thesis.المشرف1);
        if (thesis.المشرف2 && thesis.المشرف2 !== '-') supervisorNames.push(thesis.المشرف2);
        if (thesis.المشرف3 && thesis.المشرف3 !== '-') supervisorNames.push(thesis.المشرف3);
        
        // ✅ البحث عن المشرفين وإنشائهم إذا لم يكونوا موجودين
        const supervisorsData = [];
        for (const supName of supervisorNames) {
          if (supName && supName.trim()) {
            // 1. ابحث عن دكتور داخلي
            let doctor = await prisma.facultyDoctor.findFirst({
              where: { name: { contains: supName.trim(), mode: 'insensitive' } }
            });
            
            if (doctor) {
              supervisorsData.push({
                doctorId: doctor.id,
                supervisionRole: "مشرف رئيسي"
              });
              console.log(`✅ تم العثور على المشرف: ${doctor.name}`);
            } else {
              // 2. ابحث عن مناقش خارجي
              let external = await prisma.externalExaminer.findFirst({
                where: { name: { contains: supName.trim(), mode: 'insensitive' } }
              });
              
              if (external) {
                supervisorsData.push({
                  externalExaminerId: external.id,
                  supervisionRole: "مناقش خارجي"
                });
                console.log(`✅ تم العثور على المناقش الخارجي: ${external.name}`);
              } else {
                // 3. لو مش موجود خالص، اخلق دكتور جديد في FacultyDoctor
                try {
                  const newDoctor = await prisma.facultyDoctor.create({
                    data: {
                      name: supName.trim(),
                      academicTitle: "دكتور" // لقب افتراضي
                    }
                  });
                  supervisorsData.push({
                    doctorId: newDoctor.id,
                    supervisionRole: "مشرف رئيسي"
                  });
                  newDoctorsCount++;
                  console.log(`✨ تم إنشاء دكتور جديد: ${supName}`);
                  results.push({ 
                    info: `السطر ${rowNumber}: تم إنشاء مشرف جديد "${supName}"`, 
                    status: 'info'
                  });
                } catch (createError) {
                  console.error(`فشل إنشاء المشرف "${supName}":`, createError);
                  results.push({ 
                    warning: `السطر ${rowNumber}: فشل إنشاء المشرف "${supName}"`, 
                    status: 'warning'
                  });
                  warningCount++;
                }
              }
            }
          }
        }
        
        // إضافة المشرفين إلى جدول Supervision
        for (const sup of supervisorsData) {
          await prisma.supervision.create({
            data: { ...sup, thesisId: newThesis.id }
          });
        }
        
        results.push({ 
          success: true, 
          thesisId: newThesis.id,
          title: newThesis.title,
          studentName: newThesis.studentName,
          department: newThesis.department,
          researchType: newThesis.researchType,
          supervisorsCount: supervisorsData.length,
          status: 'success'
        });
        successCount++;
        
      } catch (error) {
        console.error(`Error creating thesis row ${rowNumber}:`, error);
        results.push({ 
          error: `السطر ${rowNumber}: حدث خطأ أثناء إنشاء الرسالة`, 
          data: thesis,
          status: 'error'
        });
        errorCount++;
      }
    }

    revalidatePath("/admin-dashboard/theses");
    return { 
      success: true, 
      results,
      successCount,
      errorCount,
      warningCount,
      newDoctorsCount, // ✅ عدد الدكاترة الجدد اللي اتعملوا
      total: thesesData.length
    };
  } catch (error) {
    console.error("Error bulk adding theses:", error);
    return { error: "حدث خطأ أثناء الإضافة الجماعية" };
  }
}

// دالة لجلب الرسائل
export async function getThesesAction() {
  try {
    const theses = await prisma.thesis.findMany({
      orderBy: { registrationDate: 'desc' },
      include: {
        supervisors: {
          include: {
            doctor: true,
            externalExaminer: true
          }
        }
      }
    });
    return theses;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// دالة لحذف رسالة
export async function deleteThesisAction(id: string) {
  try {
    await prisma.thesis.delete({ where: { id } });
    revalidatePath("/admin-dashboard/theses");
    return { success: true };
  } catch (error) {
    return { error: "فشل الحذف" };
  }
}

// دالة لتحديث رسالة
export async function updateThesisAction(id: string, data: { title: string, studentName: string, type: string }) {
  try {
    await prisma.thesis.update({
      where: { id },
      data: {
        title: data.title,
        studentName: data.studentName,
        type: data.type as any,
      }
    });
    revalidatePath("/admin-dashboard/theses");
    return { success: true };
  } catch (error) {
    return { error: "فشل التحديث" };
  }
}
// دالة مسح كل الرسائل والمشرفين
export async function deleteAllThesesAction() {
  try {
    const deletedSupervisions = await prisma.supervision.deleteMany({});
    console.log(`✅ تم حذف ${deletedSupervisions.count} من جدول Supervision`);
    
    const deletedTheses = await prisma.thesis.deleteMany({});
    console.log(`✅ تم حذف ${deletedTheses.count} رسالة من جدول Thesis`);
    
    revalidatePath("/admin-dashboard/theses");
    return { 
      success: true, 
      count: deletedTheses.count,
      message: `تم حذف ${deletedTheses.count} رسالة و ${deletedSupervisions.count} علاقة إشراف`
    };
  } catch (error) {
    console.error("Error deleting all theses:", error);
    return { error: "فشل حذف الرسائل" };
  }
}