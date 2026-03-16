import { prisma } from "@/lib/prisma";
import ThesisForm from "./thesis-form";
import { BookOpen, Files } from "lucide-react";

export default async function ThesesPage() {
  const doctors = await prisma.facultyDoctor.findMany({
    orderBy: { name: 'asc' }
  });
  
  const externals = await prisma.externalExaminer.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10" dir="rtl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-slate-950 rounded-[1.5rem] text-white shadow-2xl shadow-slate-300">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">تسجيل رسالة علمية</h1>
            <p className="text-slate-500 font-bold mt-1">إضافة البيانات الأساسية وتعيين هيئة الإشراف والمناقشة</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <ThesisForm doctors={doctors} externals={externals} />
      </div>
    </div>
  );
}