"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Megaphone, Eye, Info, AlertCircle, 
  Bell, Clock, CheckCircle2, Trash2, Edit3, X 
} from "lucide-react";
import { sendNotification, deleteNotification, getNotifications, updateNotification } from "./actions";

export default function BroadcastPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [formData, setFormData] = useState({ id: "", title: "", message: "", type: "info" });
  const [isSending, setIsSending] = useState(false);
  const [showPopup, setShowPopup] = useState<{show: boolean, msg: string, type: 'success' | 'error' | 'confirm', action?: () => void}>({
    show: false, msg: "", type: 'success'
  });

  // تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      if (formData.id) {
        await updateNotification(formData.id, formData);
        setPopup("تم تحديث الإشعار بنجاح", 'success');
      } else {
        await sendNotification(formData);
        setPopup("تم إرسال الإشعار للجميع بنجاح", 'success');
      }
      setFormData({ id: "", title: "", message: "", type: "info" });
      const updated = await getNotifications();
      setNotifications(updated);
    } catch (err) {
      setPopup("حدث خطأ أثناء العملية", 'error');
    } finally {
      setIsSending(false);
    }
  };

  const confirmDelete = (id: string) => {
    setShowPopup({
      show: true,
      msg: "هل أنت متأكد من حذف هذا الإشعار نهائياً؟",
      type: 'confirm',
      action: async () => {
        await deleteNotification(id);
        setNotifications(notifications.filter(n => n.id !== id));
        setPopup("تم الحذف بنجاح", 'success');
      }
    });
  };

  const setPopup = (msg: string, type: 'success' | 'error') => {
    setShowPopup({ show: true, msg, type });
    if (type !== 'confirm') setTimeout(() => setShowPopup(prev => ({...prev, show: false})), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4 font-sans" dir="rtl">
      
      {/* 1. Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-950 flex items-center gap-3">
          <Megaphone className="text-blue-600" size={36} />
          مركز بث الإشعارات
        </h1>
        <p className="text-slate-500 font-bold text-sm mr-12">تحكم في التنبيهات العامة التي تظهر لجميع المستخدمين.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* 2. Form Section */}
        <motion.div layout className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="font-black text-slate-800 flex items-center gap-2">
              <Edit3 size={18} className="text-blue-600"/> {formData.id ? "تعديل الإشعار" : "إنشاء إشعار جديد"}
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {['info', 'warning', 'success'].map((t) => (
                <button key={t} type="button" onClick={() => setFormData({...formData, type: t})} 
                  className={`py-3 rounded-2xl text-[10px] font-black transition-all ${formData.type === t ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {t === 'info' ? 'معلومة' : t === 'warning' ? 'تنبيه عاجل' : 'إعلان/نجاح'}
                </button>
              ))}
            </div>
            <input required placeholder="عنوان الإشعار..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 transition-all"/>
            <textarea required rows={4} placeholder="محتوى الرسالة..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 transition-all resize-none"/>
            <div className="flex gap-2">
              <button disabled={isSending} className="flex-1 py-4 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all">
                {isSending ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={18}/> {formData.id ? "تحديث الآن" : "بث الإشعار"}</>}
              </button>
              {formData.id && <button type="button" onClick={() => setFormData({id:"", title:"", message:"", type:"info"})} className="px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold">إلغاء</button>}
            </div>
          </form>
        </motion.div>

        {/* 3. Live Preview */}
        <div className="bg-slate-950 rounded-[3rem] p-10 min-h-[350px] flex items-center justify-center border-[8px] border-white shadow-2xl relative overflow-hidden group">
          <AnimatePresence mode="wait">
            {formData.title ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-[2rem] w-full z-10 shadow-3xl flex gap-4">
                 <div className={`p-4 rounded-2xl text-white ${formData.type === 'info' ? 'bg-blue-500' : formData.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                    <Bell size={24} />
                 </div>
                 <div className="space-y-1 text-right">
                    <h4 className="text-white font-black text-lg">{formData.title}</h4>
                    <p className="text-slate-200 text-xs font-medium leading-relaxed">{formData.message}</p>
                 </div>
              </motion.div>
            ) : <p className="text-slate-600 font-black text-sm italic">المعاينة الحية تظهر هنا...</p>}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Messages History List */}
      <div className="space-y-6 pt-10 border-t-2 border-slate-100">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Clock size={20} className="text-slate-400"/> سجل الرسائل المرسلة
        </h2>
        <div className="grid gap-4">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white border-2 border-slate-50 p-6 rounded-[2rem] flex justify-between items-center group hover:border-blue-100 transition-all shadow-sm">
              <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-xl ${n.type === 'info' ? 'bg-blue-50 text-blue-600' : n.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {n.type === 'info' ? <Info size={20}/> : <AlertCircle size={20}/>}
                </div>
                <div>
                  <h4 className="font-black text-slate-900">{n.title}</h4>
                  <p className="text-slate-500 text-xs font-bold mt-1 line-clamp-1">{n.message}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => setFormData(n)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit3 size={18}/></button>
                <button onClick={() => confirmDelete(n.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Custom Popup Modal */}
      <AnimatePresence>
        {showPopup.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${showPopup.type === 'success' ? 'bg-emerald-100 text-emerald-600' : showPopup.type === 'confirm' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                {showPopup.type === 'success' ? <CheckCircle2 size={40}/> : <AlertCircle size={40}/>}
              </div>
              <p className="text-slate-900 font-black text-lg">{showPopup.msg}</p>
              <div className="flex gap-3">
                {showPopup.type === 'confirm' ? (
                  <>
                    <button onClick={() => { showPopup.action?.(); setShowPopup({...showPopup, show: false}); }} className="flex-1 py-3 bg-rose-500 text-white rounded-2xl font-black shadow-lg shadow-rose-500/20">حذف نهائي</button>
                    <button onClick={() => setShowPopup({...showPopup, show: false})} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black">إلغاء</button>
                  </>
                ) : (
                  <button onClick={() => setShowPopup({...showPopup, show: false})} className="w-full py-3 bg-slate-900 text-white rounded-2xl font-black">حسناً</button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}