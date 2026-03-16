"use client";
import { useState, useRef } from "react";
import { addThesisAction } from "./actions";
import { Check, X, AlertCircle, Loader2, UserCheck, Users, GraduationCap, Calendar, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThesisForm({ doctors, externals }: { doctors: any[], externals: any[] }) {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<{show: boolean, msg: string, type: 'success' | 'error'}>({show: false, msg: '', type: 'success'});
  const formRef = useRef<HTMLFormElement>(null);

  const showPopup = (msg: string, type: 'success' | 'error') => {
    setPopup({ show: true, msg, type });
    if (type === 'success') {
       setTimeout(() => {
         setPopup(p => ({...p, show: false}));
         window.location.reload(); 
       }, 2000);
    } else {
       setTimeout(() => setPopup(p => ({...p, show: false})), 4000);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addThesisAction(formData);
    setLoading(false);

    if (res.success) {
      showPopup("تم تسجيل الرسالة وتعيين المشرفين بنجاح", "success");
    } else {
      showPopup(res.error || "حدث خطأ غير متوقع", "error");
    }
  };

  return (
    <div className="relative">
      {/* Popups */}
      <AnimatePresence>
        {popup.show && (
          <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 20, x: "-50%" }} exit={{ opacity: 0, y: -50, x: "-50%" }} className="fixed top-5 left-1/2 z-[200] min-w-[320px]">
            <div className={`p-4 rounded-2xl shadow-2xl border flex items-center gap-4 backdrop-blur-xl ${popup.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-rose-600/90 border-rose-400 text-white'}`}>
              <div className="bg-white/20 p-2 rounded-xl">{popup.type === 'success' ? <Check size={20}/> : <AlertCircle size={20}/>}</div>
              <p className="font-black text-sm flex-1 leading-relaxed">{popup.msg}</p>
              <button onClick={() => setPopup(p => ({ ...p, show: false }))}><X size={16}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-100 space-y-10">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            البيانات الأساسية للرسالة
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14}/> عنوان الرسالة بالكامل
              </label>
              <input name="title" required placeholder="اكتب العنوان بدقة..." className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-widest flex items-center gap-2">
                <UserCheck size={14}/> اسم الطالب
              </label>
              <input name="studentName" required placeholder="الاسم ثلاثي أو رباعي..." className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14}/> تاريخ التسجيل بالكلية
              </label>
              <input type="date" name="registrationDate" required className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-black outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap size={14}/> الدرجة العلمية
              </label>
              <select name="type" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-black outline-none focus:border-blue-600 appearance-none cursor-pointer">
                <option value="MASTER">درجة الماجستير</option>
                <option value="PHD">درجة الدكتوراه</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Internal Supervisors */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            هيئة الإشراف (أعضاء الكلية)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-4 bg-slate-50/50 rounded-3xl border border-slate-100 custom-scrollbar">
            {doctors.map(doc => (
              <label key={doc.id} className="relative flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-[1.2rem] hover:border-emerald-500 cursor-pointer transition-all group has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/30">
                <input type="checkbox" name="doctorIds" value={doc.id} className="w-5 h-5 accent-emerald-600 rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{doc.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.academicTitle}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Section 3: External Examiners */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
            المناقشين الخارجيين
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-4 bg-slate-50/50 rounded-3xl border border-slate-100 custom-scrollbar">
            {externals.map(ext => (
              <label key={ext.id} className="relative flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-[1.2rem] hover:border-amber-500 cursor-pointer transition-all group has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50/30">
                <input type="checkbox" name="externalIds" value={ext.id} className="w-5 h-5 accent-amber-600 rounded-lg" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors">{ext.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{ext.universityName}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button disabled={loading} className="w-full bg-slate-950 text-white p-6 rounded-[1.5rem] font-black text-lg hover:bg-blue-600 transition-all shadow-2xl active:scale-[0.97] flex items-center justify-center gap-3 group">
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>حفظ الرسالة وتثبيت الهيئة <Check className="group-hover:translate-x-[-5px] transition-transform" size={24}/></>
          )}
        </button>
      </form>
    </div>
  );
}