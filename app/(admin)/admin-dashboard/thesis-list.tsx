"use client";
import { useState } from "react";
import { Trash2, Edit, User, Calendar, Check, X, AlertCircle, Loader2, Save, FileText, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteThesisAction, updateThesisAction } from "./actions";

export default function ThesisList({ initialTheses }: { initialTheses: any[] }) {
  const [theses, setTheses] = useState(initialTheses);
  const [loading, setLoading] = useState(false);
  const [editingThesis, setEditingThesis] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, title: string} | null>(null);
  const [popup, setPopup] = useState<{show: boolean, msg: string, type: 'success' | 'error'}>({show: false, msg: '', type: 'success'});

  const showPopup = (msg: string, type: 'success' | 'error') => {
    setPopup({ show: true, msg, type });
    setTimeout(() => setPopup(p => ({...p, show: false})), 3000);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateThesisAction(editingThesis.id, formData);
    setLoading(false);

    if (res.success) {
      showPopup("تم تحديث البيانات بنجاح", "success");
      setEditingThesis(null);
      const updated = theses.map(t => t.id === editingThesis.id ? { ...t, 
        title: formData.get("title"), 
        studentName: formData.get("studentName"),
        type: formData.get("type"),
        registrationDate: formData.get("registrationDate")
      } : t);
      setTheses(updated);
    } else {
      showPopup(res.error || "خطأ في التحديث", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const res = await deleteThesisAction(deleteConfirm.id);
    if (res.success) {
      setTheses(theses.filter(t => t.id !== deleteConfirm.id));
      showPopup("تم الحذف بنجاح", "success");
    } else {
      showPopup(res.error || "فشل الحذف", "error");
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Global Popup - Styled like the Layout */}
      <AnimatePresence>
        {popup.show && (
          <motion.div initial={{ opacity: 0, y: -20, x: "-50%" }} animate={{ opacity: 1, y: 20, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className="fixed top-5 left-1/2 z-[300]">
            <div className={`px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-white font-bold text-sm backdrop-blur-md ${popup.type === 'success' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-rose-500 shadow-rose-500/20'}`}>
              {popup.type === 'success' ? <Check size={18}/> : <AlertCircle size={18}/>}
              {popup.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main List Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-slate-900 font-black flex items-center gap-2 tracking-tight">
            <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
            قائمة الرسائل العلمية
          </h3>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-wider border border-blue-100">
            Records: {theses.length}
          </span>
        </div>

        <div className="overflow-x-auto text-right">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-slate-400 font-black text-[11px] uppercase tracking-[2px] border-b border-slate-50">
                <th className="px-8 py-4 font-black">بيانات الرسالة</th>
                <th className="px-8 py-4 font-black text-center">الدرجة العلمية</th>
                <th className="px-8 py-4 font-black text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {theses.map((thesis) => (
                <tr key={thesis.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-md transition-all">
                        <FileText size={22} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{thesis.title}</span>
                        <div className="flex items-center gap-4 text-slate-400 text-[11px] font-bold">
                          <span className="flex items-center gap-1"><User size={13} className="text-slate-300"/> {thesis.studentName}</span>
                          <span className="flex items-center gap-1"><Calendar size={13} className="text-slate-300"/> {new Date(thesis.registrationDate).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border tracking-widest ${
                      thesis.type === 'PHD' 
                      ? 'bg-amber-50 text-amber-600 border-amber-100' 
                      : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {thesis.type === 'PHD' ? 'دكتوراه' : 'ماجستير'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setEditingThesis(thesis)}
                        className="p-2.5 bg-white text-slate-400 hover:text-blue-600 hover:shadow-lg rounded-xl border border-slate-100 transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm({id: thesis.id, title: thesis.title})}
                        className="p-2.5 bg-white text-slate-400 hover:text-rose-600 hover:shadow-lg rounded-xl border border-slate-100 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Modern Modals */}
      <AnimatePresence>
        {(editingThesis || deleteConfirm) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => {setEditingThesis(null); setDeleteConfirm(null)}} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            
            {editingThesis && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                   <h3 className="font-black text-slate-900 text-xl tracking-tight">تعديل البيانات</h3>
                   <button onClick={() => setEditingThesis(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
                </div>
                <form onSubmit={handleUpdate} className="p-10 space-y-6 text-right" dir="rtl">
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-2">عنوان الرسالة</label>
                      <input name="title" required defaultValue={editingThesis.title} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-2">اسم الطالب</label>
                        <input name="studentName" required defaultValue={editingThesis.studentName} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mr-2">النوع</label>
                        <select name="type" defaultValue={editingThesis.type} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 font-bold outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer">
                          <option value="MASTER">ماجستير</option>
                          <option value="PHD">دكتوراه</option>
                        </select>
                      </div>
                   </div>
                   <button disabled={loading} className="w-full bg-slate-950 text-white p-5 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
                      {loading ? <Loader2 className="animate-spin" /> : <><Save size={18}/> حفظ التعديلات</>}
                   </button>
                </form>
              </motion.div>
            )}

            {deleteConfirm && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center border border-white">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><Trash2 size={36}/></div>
                <h3 className="text-slate-900 font-black text-xl mb-2">تأكيد الحذف</h3>
                <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed italic">هل أنت متأكد من حذف هذه الرسالة من السجلات نهائياً؟</p>
                <div className="flex gap-3">
                  <button onClick={handleDelete} className="flex-1 bg-rose-500 text-white py-4 rounded-2xl font-black hover:bg-rose-600 transition-all">نعم، حذف</button>
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all">تراجع</button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}