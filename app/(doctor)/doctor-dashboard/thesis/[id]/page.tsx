import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight, GraduationCap, CalendarDays, Users, BookMarked, User } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ThesisDetailsPage({ params }: { params: { id: string } }) {
  const thesis = await prisma.thesis.findUnique({
    where: { id: params.id },
    include: {
      supervisors: {
        include: { doctor: true, externalExaminer: true }
      }
    }
  });

  if (!thesis) notFound();

  // دالة لتنسيق حالة الرسالة بستايل فخم
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": 
        return <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-xl text-xs font-black tracking-widest">قيد التجهيز</span>;
      case "IN_PROGRESS": 
        return <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-xl text-xs font-black tracking-widest">قيد المناقشة</span>;
      case "APPROVED": 
        return <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-xl text-xs font-black tracking-widest">مُجازة</span>;
      default: 
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8 px-4 pb-20" dir="rtl">
      
      {/* زر العودة المحدث */}
      <Link href="/doctor-dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-black bg-white px-6 py-3 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all group">
        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        العودة للمكتبة
      </Link>

      <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-hidden">
        
        {/* هيدر الرسالة (Dark Premium Style) */}
        <div className="bg-slate-950 p-10 md:p-14 text-white relative overflow-hidden">
          {/* إضاءات زجاجية في الخلفية */}
          <div className="absolute top-[-50%] right-[-10%] w-[80%] h-[150%] bg-gradient-to-br from-blue-600/20 to-indigo-600/0 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[80%] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-wrap gap-3 mb-6 relative z-10">
            <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-4 py-1.5 rounded-xl text-xs font-black tracking-widest uppercase">
              {thesis.type === "MASTER" ? "رسالة ماجستير" : "رسالة دكتوراه"}
            </span>
            {getStatusBadge(thesis.status)}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black leading-tight relative z-10 tracking-tight">
            {thesis.title}
          </h1>
        </div>

        {/* تفاصيل الباحث والتواريخ */}
        <div className="p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100">
          <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[2rem] border border-slate-100/60 transition-colors hover:border-blue-200">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
              <User size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 mb-1 uppercase tracking-widest">اسم الباحث</p>
              <p className="font-black text-slate-900 text-xl">{thesis.studentName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5 bg-slate-50 p-6 rounded-[2rem] border border-slate-100/60 transition-colors hover:border-blue-200">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600">
              <CalendarDays size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 mb-1 uppercase tracking-widest">تاريخ التسجيل</p>
              <p className="font-black text-slate-900 text-xl">{new Date(thesis.registrationDate).toLocaleDateString('ar-EG')}</p>
            </div>
          </div>
        </div>

        {/* لجنة الإشراف */}
        <div className="p-10 md:p-14 bg-white">
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <Users className="text-blue-600" size={28} />
            هيئة الإشراف والمناقشة
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {thesis.supervisors.length > 0 ? (
              thesis.supervisors.map((sup: any) => {
                const name = sup.doctor?.name || sup.externalExaminer?.name;
                const title = sup.doctor?.academicTitle || (sup.externalExaminer ? "مناقش خارجي" : "مشرف");
                return (
                  <div key={sup.id} className="flex items-center justify-between p-5 rounded-[1.5rem] border border-slate-200 hover:border-blue-300 hover:shadow-md bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-500 group-hover:bg-blue-500 transition-colors"></div>
                      <span className="font-black text-slate-800 text-lg group-hover:text-blue-700 transition-colors">{name}</span>
                    </div>
                    <span className="bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shrink-0">
                      {title}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-10 text-center bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                <span className="text-slate-400 font-bold italic">لم يتم تعيين هيئة الإشراف حتى الآن.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}