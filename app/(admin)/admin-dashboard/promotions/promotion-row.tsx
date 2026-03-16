"use client";
import { useState } from "react";
import { promoteDoctorAction } from "./actions";
import { Check, AlertCircle, Loader2, Award, ChevronLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PromotionRow({ doctor }: { doctor: any }) {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<{show: boolean, msg: string, type: 'success' | 'error'}>({show: false, msg: '', type: 'success'});
  const [confirmModal, setConfirmModal] = useState<{show: boolean, nextTitle: string}>({show: false, nextTitle: ''});
  
  const titles = ["معيد", "مدرس مساعد", "مدرس", "أستاذ مساعد", "أستاذ دكتور"];

  const showPopup = (msg: string, type: 'success' | 'error') => {
    setPopup({ show: true, msg, type });
    setTimeout(() => setPopup(p => ({...p, show: false})), 3000);
  };

  const handlePromote = async () => {
    const newTitle = confirmModal.nextTitle;
    setConfirmModal({ show: false, nextTitle: '' });
    
    setLoading(true);
    const res = await promoteDoctorAction(doctor.id, newTitle);
    setLoading(false);

    if (res.success) showPopup(`تمت ترقية د. ${doctor.name} بنجاح`, "success");
    else showPopup(res.error || "حدث خطأ", "error");
  };

  return (
    <>
      {/* 1. Notifications Popup (Success/Error) */}
      <AnimatePresence>
        {popup.show && (
          <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 20, x: "-50%" }} exit={{ opacity: 0, y: -50, x: "-50%" }} className="fixed top-5 left-1/2 z-[200] min-w-[300px]">
            <div className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-4 backdrop-blur-md ${popup.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-rose-600/90 border-rose-400 text-white'}`}>
              <div className="bg-white/20 p-2 rounded-xl">{popup.type === 'success' ? <Check size={20}/> : <AlertCircle size={20}/>}</div>
              <p className="font-black text-sm flex-1">{popup.msg}</p>
              <button onClick={() => setPopup(p => ({ ...p, show: false }))}><X size={16}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Custom Confirmation Modal (بديل الـ confirm) */}
      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmModal({show: false, nextTitle: ''})} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center border border-slate-100">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><Award size={40} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-2">تأكيد الترقية</h3>
              <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed">
                هل أنت متأكد من ترقية <span className="text-blue-600">د. {doctor.name}</span> إلى درجة <span className="text-slate-900 font-black tracking-tight underline decoration-blue-500 underline-offset-4">{confirmModal.nextTitle}</span>؟
              </p>
              <div className="flex gap-3">
                <button onClick={handlePromote} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">تأكيد الترقية</button>
                <button onClick={() => setConfirmModal({show: false, nextTitle: ''})} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black">إلغاء</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Table Row */}
      <tr className="hover:bg-slate-50/80 transition-all group">
        <td className="p-6">
          <div className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
            {doctor.name}
          </div>
        </td>
        <td className="p-6">
          <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-[11px] font-black border border-slate-200 flex items-center gap-2 w-fit">
            <Award size={14} className="text-slate-400" />
            {doctor.academicTitle}
          </span>
        </td>
        <td className="p-6 text-left">
          <div className="flex justify-end items-center gap-3">
            {loading ? (
              <div className="flex items-center gap-2 text-blue-600 font-black text-xs">
                <Loader2 className="animate-spin" size={18} />
                جاري التحديث...
              </div>
            ) : (
              <div className="relative">
                <select 
                  onChange={(e) => { 
                    if(e.target.value) setConfirmModal({show: true, nextTitle: e.target.value});
                    e.target.value = ""; 
                  }}
                  className="appearance-none p-3 pl-10 pr-5 border-2 border-slate-100 rounded-2xl bg-white text-xs font-black text-slate-900 outline-none focus:border-blue-500 transition-all cursor-pointer shadow-sm hover:border-slate-300"
                >
                  <option value="">إجراء ترقية...</option>
                  {titles.filter(t => t !== doctor.academicTitle).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronLeft className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}