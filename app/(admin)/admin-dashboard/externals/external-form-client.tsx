"use client";
import { useState } from "react";
import ExternalForm from "./external-form";
import { deleteExternalAction, updateExternalAction } from "./actions";
import { School, Award, Trash2, Check, X, AlertCircle, Edit3, Loader2, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExternalFormClient({ initialData }: { initialData: any[] }) {
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", academicTitle: "", universityName: "", specialty: "" });
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const showPopup = (msg: string, type: "success" | "error") => {
    setPopup({ show: true, message: msg, type });
    if (type === "success") setTimeout(() => setPopup(p => ({ ...p, show: false })), 3000);
  };

  const handleStartEdit = (ext: any) => {
    setEditingId(ext.id);
    setEditForm({ 
      name: ext.name, 
      academicTitle: ext.academicTitle || "دكتور", 
      universityName: ext.universityName, 
      specialty: ext.specialty 
    });
  };

  const handleSaveEdit = async (id: string) => {
    setLoading(true);
    const res = await updateExternalAction(id, editForm);
    if (res.success) {
      setEditingId(null);
      showPopup("تم التحديث بنجاح", "success");
    } else {
      showPopup(res.error || "خطأ", "error");
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir="rtl">
      
      {/* Popups & Modals */}
      <AnimatePresence>
        {popup.show && (
          <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 20, x: "-50%" }} exit={{ opacity: 0, y: -50, x: "-50%" }} className="fixed top-5 left-1/2 z-[100] min-w-[320px]">
            <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-4 ${popup.type === "success" ? "bg-emerald-500/90 border-emerald-400 text-white" : "bg-rose-600/90 border-rose-400 text-white"}`}>
              <div className="bg-white/20 p-2 rounded-xl">{popup.type === "success" ? <Check size={20}/> : <AlertCircle size={20}/>}</div>
              <p className="font-black text-sm flex-1">{popup.message}</p>
              <button onClick={() => setPopup(p => ({ ...p, show: false }))}><X size={16}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center border border-slate-100">
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><AlertCircle size={40} /></div>
              <h3 className="text-xl font-black text-slate-900 mb-2">تأكيد الحذف</h3>
              <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed">سيتم حذف المناقش نهائياً من قاعدة البيانات.</p>
              <div className="flex gap-3">
                <button onClick={async () => { await deleteExternalAction(deleteConfirm!); setDeleteConfirm(null); showPopup("تم الحذف بنجاح", "success"); }} className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-black hover:bg-rose-700 transition-all shadow-lg shadow-rose-200">نعم، احذف</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all">إلغاء</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="lg:col-span-4">
        <ExternalForm onSuccess={(m) => showPopup(m, "success")} onError={(m) => showPopup(m, "error")} />
      </div>

      <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[400px]">
        <div className="p-6 bg-slate-950 text-white font-black text-[11px] uppercase tracking-[3px] text-center border-b border-white/10">قائمة المناقشين الخارجيين</div>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <tbody className="divide-y divide-slate-100">
              {initialData.length === 0 ? (
                <tr><td className="p-20 text-center font-bold text-slate-400">لا يوجد بيانات حالياً</td></tr>
              ) : (
                initialData.map((ext) => (
                  <tr key={ext.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="p-6">
                      {editingId === ext.id ? (
                        <div className="flex flex-col gap-3 max-w-md animate-in slide-in-from-right-2" dir="rtl">
                          <div className="flex gap-2">
                            <select 
                              className="w-1/3 p-3 border-2 border-slate-200 rounded-xl font-black text-slate-900 bg-white focus:border-blue-500 outline-none transition-all text-sm"
                              value={editForm.academicTitle} 
                              onChange={(e) => setEditForm({...editForm, academicTitle: e.target.value})}
                            >
                              <option>دكتور</option>
                              <option>أستاذ مساعد</option>
                              <option>أستاذ دكتور</option>
                            </select>
                            <input 
                              className="w-2/3 p-3 border-2 border-blue-500 rounded-xl font-black text-slate-900 bg-white shadow-md outline-none text-base"
                              value={editForm.name} 
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                              dir="rtl"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              className="p-3 border-2 border-slate-200 rounded-xl font-bold text-slate-800 bg-slate-50 focus:border-blue-400 outline-none text-xs" 
                              value={editForm.universityName} 
                              onChange={(e) => setEditForm({...editForm, universityName: e.target.value})} 
                              placeholder="الجامعة" 
                              dir="rtl"
                            />
                            <input 
                              className="p-3 border-2 border-slate-200 rounded-xl font-bold text-slate-800 bg-slate-50 focus:border-blue-400 outline-none text-xs" 
                              value={editForm.specialty} 
                              onChange={(e) => setEditForm({...editForm, specialty: e.target.value})} 
                              placeholder="التخصص" 
                              dir="rtl"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col" dir="rtl">
                          <div className="font-black text-slate-900 text-lg flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                            <span className="text-blue-600 text-[10px] bg-blue-50 px-2 py-0.5 rounded-md font-black border border-blue-100">{ext.academicTitle}</span>
                            {ext.name}
                          </div>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-tighter"><School size={12} className="text-slate-400"/> {ext.universityName}</span>
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 uppercase tracking-tighter"><Award size={12} className="text-blue-400"/> {ext.specialty}</span>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="p-6 text-left">
                      <div className="flex justify-end gap-2">
                        {editingId === ext.id ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveEdit(ext.id)} className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg hover:bg-emerald-600 transition-all">
                              {loading ? <Loader2 className="animate-spin" size={20}/> : <Check size={20}/>}
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-3 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-all"><X size={20}/></button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => handleStartEdit(ext)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="تعديل"><Edit3 size={18}/></button>
                            <button onClick={() => setDeleteConfirm(ext.id)} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="حذف"><Trash2 size={18}/></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}