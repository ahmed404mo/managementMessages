import { prisma } from "@/lib/prisma";
import ThesesListContent from "./ThesesListContent";

async function getTheses() {
  return await prisma.thesis.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      supervisors: {
        include: { doctor: true }
      }
    }
  });
}

export default async function ThesesPage() {
  const theses = await getTheses();

  return (
    <div className="space-y-8 font-sans" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">الرسائل العلمية</h1>
          <p className="text-slate-500 font-bold text-sm">إدارة ومتابعة كافة رسائل الماجستير والدكتوراه</p>
        </div>
        <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-lg font-black shadow-lg shadow-blue-200">
          {theses.length} <span className="text-xs opacity-80 mr-1">إجمالي الرسائل</span>
        </div>
      </div>

      {/* البحث المتقدم والقائمة */}
      <ThesesListContent initialTheses={theses} />
    </div>
  );
}