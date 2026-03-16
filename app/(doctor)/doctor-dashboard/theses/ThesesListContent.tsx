"use client";
import { useState, useEffect } from "react";
import { Calendar, User, GraduationCap, Search, X, Info, Users, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function ThesesListContent({ initialTheses }: { initialTheses: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedThesis, setSelectedThesis] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // دالة البحث الذكي
  const filteredTheses = initialTheses.filter((t) => {
    const query = searchTerm.trim().toLowerCase();
    const dateAr = new Date(t.registrationDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const year = new Date(t.registrationDate).getFullYear().toString();
    const allSupervisors = t.supervisors?.map((s: any) => (s.doctor?.name || "").toLowerCase()).join(" ");
    const typeAr = t.type === "PHD" ? "دكتوراه" : "ماجستير";
    const statusAr = t.status === "APPROVED" ? "مجازة مقبولة" : t.status === "IN_PROGRESS" ? "مناقشة تنفيذ" : "تجهيز انتظار";

    const searchableString = `${t.title.toLowerCase()} ${t.studentName.toLowerCase()} ${allSupervisors} ${dateAr} ${year} ${typeAr} ${statusAr}`;
    const searchTerms = query.split(" ").filter(Boolean);
    
    const matchesSearch = searchTerms.every(term => searchableString.includes(term));
    const matchesType = filterType === "ALL" || t.type === filterType;
    const matchesStatus = filterStatus === "ALL" || t.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6" dir="rtl">
      {/* شريط البحث */}
      <div className="bg-white p-5 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="ابحث بالعنوان، الطالب، السنة، أو المشرف..."
            value={searchTerm}
            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pr-12 pl-12 py-4 text-sm font-black text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"><X size={18} /></button>
          )}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-slate-50 border-2 border-transparent rounded-xl px-4 py-4 text-xs font-black text-slate-700 outline-none focus:border-blue-500 cursor-pointer">
            <option value="ALL">جميع الدرجات</option>
            <option value="MASTER">ماجستير</option>
            <option value="PHD">دكتوراه</option>
          </select>
          {/* <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-50 border-2 border-transparent rounded-xl px-4 py-4 text-xs font-black text-slate-700 outline-none focus:border-blue-500 cursor-pointer">
            <option value="ALL">جميع الحالات</option>
            <option value="PENDING">قيد التجهيز</option>
            <option value="IN_PROGRESS">قيد المناقشة</option>
            <option value="APPROVED">مجازة</option>
          </select> */}
        </div>
      </div>

      {/* قائمة الكروت */}
      <div className="grid gap-4">
        {filteredTheses.map((thesis) => (
          <motion.div
            key={thesis.id}
            whileHover={{ scale: 1.01, y: -2 }}
            onClick={() => setSelectedThesis(thesis)}
            className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className={`absolute right-0 top-0 bottom-0 w-2 ${thesis.type === 'PHD' ? 'bg-indigo-600' : 'bg-blue-500'}`} />
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${thesis.type === 'PHD' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'}`}>
                    {thesis.type === 'PHD' ? 'دكتوراه' : 'ماجستير'}
                  </span>
                  <h3 className="font-black text-slate-900 text-xl group-hover:text-blue-600 transition-colors leading-tight">{thesis.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                   <span className={`text-xs px-4 py-2 rounded-xl font-black ${thesis.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : thesis.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                     {thesis.status === 'APPROVED' ? 'مجازة' : thesis.status === 'IN_PROGRESS' ? 'قيد المناقشة' : 'قيد التجهيز'}
                   </span>
                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                      <Info size={18} />
                   </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 text-slate-600 font-black text-sm">
                <div className="flex items-center gap-2"><User size={16} className="text-blue-500"/> {thesis.studentName}</div>
                <div className="flex items-center gap-2"><Calendar size={16} className="text-amber-500"/> {new Date(thesis.registrationDate).getFullYear()}</div>
                <div className="flex items-center gap-2"><Users size={16} className="text-indigo-500"/> {thesis.supervisors?.length || 0} مشرفين</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* مودال التفاصيل (Pop-up) */}
      {mounted && selectedThesis && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" dir="rtl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedThesis(null)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white"
            >
              <div className="bg-slate-900 p-8 text-white relative">
                 <button onClick={() => setSelectedThesis(null)} className="absolute left-6 top-6 p-2 bg-white/10 hover:bg-rose-500 rounded-full transition-all"><X size={20}/></button>
                 <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest mb-4 inline-block">تفاصيل الرسالة</span>
                 <h2 className="text-2xl font-black leading-tight">{selectedThesis.title}</h2>
              </div>
              
              <div className="p-8 space-y-6 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-black mb-1">اسم الباحث</p>
                    <p className="font-black text-slate-900 flex items-center gap-2"><User size={16} className="text-blue-500"/> {selectedThesis.studentName}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-black mb-1">تاريخ التسجيل</p>
                    <p className="font-black text-slate-900 flex items-center gap-2"><Calendar size={16} className="text-amber-500"/> {new Date(selectedThesis.registrationDate).toLocaleDateString('ar-EG')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 flex items-center gap-2 text-lg"><GraduationCap className="text-indigo-600"/> لجنة الإشراف والمناقشة</h4>
                  <div className="grid gap-2">
                    {selectedThesis.supervisors?.map((s: any) => (
                      <div key={s.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all">
                        <span className="font-black text-slate-800">{s.doctor?.name}</span>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-black">{s.doctor?.academicTitle || "عضو"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => setSelectedThesis(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">إغلاق النافذة</button>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}