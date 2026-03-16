import { prisma } from "@/lib/prisma";
import PromotionRow from "./promotion-row";
import { TrendingUp, Award, Clock } from "lucide-react";

export default async function PromotionsPage() {
  const doctors = await prisma.facultyDoctor.findMany({
    orderBy: { name: 'asc' }
  });

  const recentPromotions = await prisma.promotion.findMany({
    include: { doctor: true },
    orderBy: { promotionDate: 'desc' },
    take: 8
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10" dir="rtl">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-blue-600 rounded-[1.5rem] text-white shadow-2xl shadow-blue-200">
            <TrendingUp size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">سجل الترقيات</h1>
            <p className="text-slate-500 font-bold mt-1">إدارة المسار الأكاديمي والدرجات العلمية</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Table Column - Main Data */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-6 bg-slate-950 text-white font-black text-[11px] uppercase tracking-[4px] text-center border-b border-white/10">
              أعضاء هيئة التدريس الحالية
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-5 text-slate-400 font-black text-[10px] uppercase tracking-widest">اسم العضو</th>
                    <th className="p-5 text-slate-400 font-black text-[10px] uppercase tracking-widest">الدرجة الحالية</th>
                    <th className="p-5 text-slate-400 font-black text-[10px] uppercase tracking-widest text-left">قرار ترقية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.map(doc => (
                    <PromotionRow key={doc.id} doctor={doc} />
                  ))}
                  {doctors.length === 0 && (
                    <tr><td colSpan={3} className="p-20 text-center font-bold text-slate-300">لا يوجد أعضاء مسجلين</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Column - Recent Activity */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl sticky top-8 border border-slate-800">
            <h3 className="text-white font-black text-lg mb-8 flex items-center gap-3">
              <Clock className="text-blue-500" size={20} />
              أحدث التعديلات
            </h3>
            
            <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {recentPromotions.length === 0 ? (
                <div className="text-slate-500 text-center py-10 font-bold border border-slate-800 rounded-3xl border-dashed">
                  لا يوجد نشاط مؤخراً
                </div>
              ) : (
                recentPromotions.map(p => (
                  <div key={p.id} className="relative pr-6 border-r-2 border-slate-800 pb-2 animate-in fade-in duration-500">
                    <div className="absolute -right-[9px] top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-slate-900 shadow-lg shadow-blue-500/20" />
                    <div className="font-black text-white text-sm">د. {p.doctor?.name}</div>
                    <div className="mt-2 flex items-center gap-2 text-[10px]">
                      <span className="text-slate-500 line-through bg-slate-950 px-2 py-1 rounded-md">{p.oldTitle}</span>
                      <span className="text-blue-500 font-bold">←</span>
                      <span className="text-emerald-400 font-black bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">{p.newTitle}</span>
                    </div>
                    <div className="text-[9px] text-slate-600 mt-3 font-mono">
                      {new Date(p.promotionDate).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}