"use client";

import { useState, useEffect } from "react";
import { Search, GraduationCap, CalendarDays, Users, BookMarked, Sparkles, ChevronDown, ChevronUp, X, Info, User, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { createPortal } from "react-dom"; 

// استيراد تنسيقات Swiper
import 'swiper/css';
import 'swiper/css/pagination';

// ألوان السلايدر العلوي
const sliderColors = [
  "bg-gradient-to-br from-slate-900 to-slate-800",
  "bg-gradient-to-br from-blue-900 to-blue-800",
  "bg-gradient-to-br from-emerald-900 to-emerald-800",
  "bg-gradient-to-br from-indigo-900 to-indigo-800",
];

// دالة جلب شارات الحالة
const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING": 
      return <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">قيد التجهيز</span>;
    case "IN_PROGRESS": 
      return <span className="bg-blue-500/10 border border-blue-500/20 text-blue-500 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">قيد المناقشة</span>;
    case "APPROVED": 
      return <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">مُجازة</span>;
    default: return null;
  }
};

// مكون الكارت الصغير
const ThesisCard = ({ thesis, onClick, colorTheme }: { thesis: any; onClick: () => void; colorTheme?: string }) => {
  const isPhd = thesis.type === "PHD";
  const isColored = !!colorTheme;

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`group rounded-[2.5rem] border shadow-sm transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full relative ${
        isColored 
          ? `${colorTheme} hover:shadow-xl hover:shadow-blue-900/20 border-white/5` 
          : `bg-white border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/50`
      }`}
    >
      <div className="p-6 flex-1 flex flex-col relative z-10">
        <div className="flex justify-between items-start mb-6">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border uppercase ${
            isColored 
              ? "bg-white/10 text-white border-white/10" 
              : isPhd ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-blue-50 text-blue-600 border-blue-100"
          }`}>
            {isPhd ? "دكتوراه" : "ماجستير"}
          </span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isColored ? "bg-white/10 text-white/50 group-hover:bg-white/20 group-hover:text-white" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
          }`}>
            <Info size={16} />
          </div>
        </div>
        
        <h3 className={`text-lg font-black leading-snug mb-6 transition-colors line-clamp-3 ${
          isColored ? "text-white" : "text-slate-900 group-hover:text-blue-600"
        }`}>
          {thesis.title}
        </h3>
        
        <div className={`space-y-3 font-bold text-sm mt-auto ${isColored ? "text-slate-300" : "text-slate-500"}`}>
          <div className="flex items-center gap-2">
            <User size={14} className={isColored ? "text-slate-400" : "text-blue-500"} />
            <span className="truncate">{thesis.studentName}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-slate-400" />
            <span className="text-[11px] uppercase tracking-wider">{new Date(thesis.registrationDate).getFullYear()}</span>
          </div>
        </div>
      </div>
      
      <div className={`px-6 py-4 border-t flex justify-between items-center transition-colors relative z-10 ${
        isColored ? "bg-black/20 border-white/5 group-hover:bg-black/30" : "bg-slate-50/50 border-slate-100 group-hover:bg-slate-100"
      }`}>
        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isColored ? "text-slate-300" : "text-slate-400"}`}>
          <Users size={14} /> المشرفين: {thesis.supervisors?.length || 0}
        </span>
        <ChevronDown size={16} className={`${isColored ? "text-slate-500 group-hover:text-white" : "text-slate-300 group-hover:text-blue-600"} transition-colors`} />
      </div>
    </motion.div>
  );
};

export default function ThesesClientView({ initialTheses }: { initialTheses: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedThesis, setSelectedThesis] = useState<any | null>(null);
  const [showAllMasters, setShowAllMasters] = useState(false);
  const [showAllPhds, setShowAllPhds] = useState(false);
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true);
  }, []);

  // منع التمرير عند فتح النافذة
  useEffect(() => {
    if (selectedThesis) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedThesis]);

  const sliderTheses = initialTheses.slice(0, 6);
  const isSearching = searchTerm.trim() !== "";

  // نظام البحث الذكي
  const searchResults = initialTheses.filter((thesis) => {
    if (!searchTerm) return true;
    const terms = searchTerm.toLowerCase().split(" ").filter(Boolean);
    const dateAr = new Date(thesis.registrationDate).toLocaleDateString('ar-EG');
    const year = new Date(thesis.registrationDate).getFullYear().toString();
    const allSupervisors = thesis.supervisors?.map((s: any) =>
      (s.doctor?.name || s.externalExaminer?.name || "").toLowerCase()
    ).join(" ") || "";

    const searchableString = `${thesis.title.toLowerCase()} ${thesis.studentName.toLowerCase()} ${dateAr} ${year} ${allSupervisors}`;
    return terms.every(term => searchableString.includes(term));
  });

  const masterTheses = initialTheses.filter(t => t.type === "MASTER");
  const phdTheses = initialTheses.filter(t => t.type === "PHD");

  return (
    <div className="w-full pb-20 bg-transparent relative" dir="rtl">
      
      {/* 1. Hero Section */}
      <motion.div 
        initial={false}
        animate={{ height: isSearching ? "35vh" : "50vh" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden rounded-b-[3rem] sm:rounded-b-[5rem] shadow-2xl -mt-8 md:-mt-12 w-[100vw] ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)]"
      >
        <div className="absolute inset-0 opacity-20">
            {/* Speedlines Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        </div>
        
        <motion.div animate={{ scale: isSearching ? 0.9 : 1 }} className="w-full max-w-7xl mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-2 px-6 rounded-full bg-white/5 border border-white/10 text-blue-300 text-[10px] font-black tracking-[4px] uppercase mb-6 backdrop-blur-md">
            Digital Repository
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            المكتبة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">الأكاديمية</span>
          </h1>
          {!isSearching && (
            <p className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto font-medium">
              المستودع الرقمي الشامل لرسائل الماجستير والدكتوراه العلمية.
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* 2. Search Bar */}
      <div className="relative z-40 max-w-4xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 mb-16">
        <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border border-slate-100 flex items-center gap-2 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900 text-white rounded-[1.8rem] flex items-center justify-center shrink-0 shadow-lg">
            <Search size={22} />
          </div>
          <input 
            type="text" 
            placeholder="ابحث عن رسالة، باحث، سنة، أو مشرف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent px-2 sm:px-4 outline-none font-black text-slate-800 text-sm sm:text-base placeholder:text-slate-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="p-3 text-slate-400 hover:text-rose-500 rounded-xl transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 relative z-20">
        {isSearching ? (
          /* Search Results View */
          <div className="space-y-8 min-h-[50vh]">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              نتائج البحث ({searchResults.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {searchResults.map(t => <ThesisCard key={t.id} thesis={t} onClick={() => setSelectedThesis(t)} />)}
              {searchResults.length === 0 && (
                <div className="col-span-full py-24 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 shadow-sm">
                  <AlertTriangle className="mx-auto text-slate-200 mb-4" size={64} />
                  <p className="font-black text-slate-400 text-xl">لا توجد نتائج تطابق بحثك حالياً</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Normal Home View */
          <div className="space-y-24">
            
            {/* Slider Section */}
            {sliderTheses.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200"><Sparkles size={20} /></div>
                  <h2 className="text-2xl font-black text-slate-900">أحدث الرسائل المضافة</h2>
                </div>
                
                <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1.1}
                  breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  autoplay={{ delay: 5000 }}
                  className="pb-14"
                >
                  {sliderTheses.map((thesis, idx) => (
                    <SwiperSlide key={thesis.id} className="h-auto">
                      <ThesisCard 
                        thesis={thesis} 
                        onClick={() => setSelectedThesis(thesis)} 
                        colorTheme={sliderColors[idx % sliderColors.length]} 
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {/* Categorized Lists */}
            <div className="grid gap-20">
              {[
                { title: "رسائل الدكتوراه", data: phdTheses, show: showAllPhds, setShow: setShowAllPhds, icon: <GraduationCap size={24}/>, color: "bg-slate-950" },
                { title: "رسائل الماجستير", data: masterTheses, show: showAllMasters, setShow: setShowAllMasters, icon: <BookMarked size={24}/>, color: "bg-blue-600" }
              ].map((sec, i) => sec.data.length > 0 && (
                <div key={i} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 ${sec.color} text-white rounded-[1.8rem] flex items-center justify-center shadow-xl`}>{sec.icon}</div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">{sec.title}</h2>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sec.data.length} رسالة مسجلة</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(sec.show ? sec.data : sec.data.slice(0, 3)).map(t => (
                      <ThesisCard key={t.id} thesis={t} onClick={() => setSelectedThesis(t)} />
                    ))}
                  </div>
                  
                  {sec.data.length > 3 && (
                    <div className="flex justify-center">
                      <button 
                        onClick={() => sec.setShow(!sec.show)}
                        className="flex items-center gap-2 bg-slate-50 text-slate-900 font-black px-8 py-4 rounded-2xl hover:bg-slate-900 hover:text-white transition-all border border-slate-100 shadow-sm"
                      >
                        {sec.show ? <><ChevronUp size={18}/> إخفاء</> : <><ChevronDown size={18}/> عرض الكل</>}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Responsive Modal - متجاوب كلياً */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedThesis && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-6" dir="rtl">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedThesis(null)}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
              />

              <motion.div 
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                className="relative bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20"
              >
                {/* Modal Header */}
                <div className="bg-slate-950 p-8 sm:p-12 text-white relative shrink-0">
                  <button onClick={() => setSelectedThesis(null)} className="absolute left-6 top-6 p-2 bg-white/10 hover:bg-rose-500 rounded-full transition-colors text-white z-20">
                    <X size={20}/>
                  </button>
                  <div className="flex gap-2 mb-4 relative z-10">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {selectedThesis.type === "MASTER" ? "ماجستير" : "دكتوراه"}
                    </span>
                    {getStatusBadge(selectedThesis.status)}
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black leading-tight text-white relative z-10">{selectedThesis.title}</h2>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white space-y-8 custom-scrollbar">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0"><User size={22} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">اسم الباحث</p>
                        <p className="font-black text-slate-900 text-lg">{selectedThesis.studentName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-500 shrink-0"><CalendarDays size={22} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">تاريخ التسجيل</p>
                        <p className="font-black text-slate-900 text-lg">{new Date(selectedThesis.registrationDate).toLocaleDateString('ar-EG')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-black text-slate-900 flex items-center gap-2 text-xl"><Users size={24} className="text-blue-600" /> هيئة الإشراف والمناقشة</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedThesis.supervisors?.map((sup: any) => (
                        <div key={sup.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all">
                          <span className="font-black text-slate-800 text-sm sm:text-base">{sup.doctor?.name || sup.externalExaminer?.name}</span>
                          <span className="bg-slate-50 text-slate-500 text-[9px] font-black px-2 py-1 rounded-md border border-slate-100">
                            {sup.doctor?.academicTitle || "مناقش خارجي"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer Button */}
                <div className="p-6 sm:p-10 pt-0 bg-white">
                  <button 
                    onClick={() => setSelectedThesis(null)} 
                    className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-all"
                  >
                    إغلاق النافذة
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* تنسيقات CSS إضافية */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}