"use client";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Camera, User, BadgeCheck, ShieldAlert, GraduationCap, ChevronRight, Check, AlertCircle, X, Loader2 } from "lucide-react";
import { updateProfileImage, getUserProfileImage } from "./actions"; 
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [storedImage, setStoredImage] = useState<string | null>(null); 
  const [popup, setPopup] = useState<{show: boolean, msg: string, type: 'success' | 'error'}>({show: false, msg: '', type: 'success'});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showPopup = (msg: string, type: 'success' | 'error') => {
    setPopup({ show: true, msg, type });
    setTimeout(() => setPopup(p => ({...p, show: false})), 3000);
  };

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (userId) {
      getUserProfileImage(userId).then(img => {
        if (img) setStoredImage(img);
      });
    }
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 👈 التعديل هنا: 5 * 1024 * 1024 يعني 5 ميجابايت
      if (file.size > 5 * 1024 * 1024) {
        // 👈 وتعديل رسالة الخطأ هنا
        showPopup("حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 5 ميجابايت.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = async () => {
    const userId = (session?.user as any)?.id;
    if (!userId) {
      showPopup("خطأ في الجلسة: يرجى تسجيل الخروج والدخول مرة أخرى.", "error");
      return;
    }
    if (!imagePreview) return;

    setIsUploading(true);
    const res = await updateProfileImage(userId, imagePreview);
    
    if (res.success) {
      showPopup("تم تحديث صورتك الشخصية بنجاح", "success");
      setStoredImage(imagePreview); 
      setImagePreview(null); 
      await update(); 
    } else {
      showPopup("حدث خطأ أثناء حفظ الصورة", "error");
    }
    setIsUploading(false);
  };

  if (!session?.user) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <span className="text-slate-500 font-bold">جاري تحميل البيانات...</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pt-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20" dir="rtl">
      
      {/* Global Popup Notification */}
      <AnimatePresence>
        {popup.show && (
          <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 20, x: "-50%" }} exit={{ opacity: 0, y: -50, x: "-50%" }} className="fixed top-5 left-1/2 z-[300] min-w-[320px]">
            <div className={`p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-white font-black text-sm backdrop-blur-xl border ${popup.type === 'success' ? 'bg-emerald-600/90 border-emerald-400' : 'bg-rose-600/90 border-rose-400'}`}>
              <div className="bg-white/20 p-2 rounded-xl">{popup.type === 'success' ? <Check size={18}/> : <AlertCircle size={18}/>}</div>
              <p className="flex-1">{popup.msg}</p>
              <button onClick={() => setPopup(p => ({...p, show: false}))} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X size={16}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* زر العودة للوراء (Animated) */}
      <Link href="/doctor-dashboard" className="inline-block mb-8">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="group relative overflow-hidden inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-black bg-white px-5 py-3 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all"
        >
          <motion.div 
            className="absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent -skew-x-12"
            initial={{ x: "-200%" }}
            animate={{ x: "300%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 4 }}
          />
          <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          <span className="relative z-10">العودة للبوابة الأكاديمية</span>
        </motion.div>
      </Link>

      <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
        {/* Header Background */}
        <div className="h-40 bg-slate-950 absolute top-0 w-full overflow-hidden">
           <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[100%] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        </div>
        
        <div className="px-8 pb-12 pt-20 relative z-10 flex flex-col items-center">
          
          <div className="relative mb-8">
            <div className="w-36 h-36 rounded-[2rem] bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center relative group">
              {imagePreview || storedImage ? (
                <img src={imagePreview || storedImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                  <User size={64} />
                </div>
              )}
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center font-black text-sm gap-2"
              >
                <Camera size={28} className="text-blue-400" />
                تغيير الصورة
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            </div>
            
            {/* مؤشر تفاعلي للتغيير */}
            {!imagePreview && !storedImage && (
               <span className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-2 rounded-full border-4 border-white shadow-lg animate-bounce pointer-events-none">
                 <Camera size={16} />
               </span>
            )}
          </div>

          {/* زر حفظ الصورة (Premium Animated Button) */}
          <AnimatePresence>
            {imagePreview && (
              <motion.button 
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSaveImage} 
                disabled={isUploading}
                className="group relative mb-10 overflow-hidden bg-slate-950 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-300 hover:shadow-blue-600/40 transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 border border-slate-800 hover:border-blue-500/50"
              >
                {/* تأثير اللمعان (Shimmer) المستمر */}
                {!isUploading && (
                  <motion.div 
                    className="absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-200%" }}
                    animate={{ x: "300%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatDelay: 3 }}
                  />
                )}
                
                {/* خلفية التدرج عند مرور الماوس */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                <div className="relative z-10 flex items-center gap-3">
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin text-blue-400" size={20} />
                      <span className="text-blue-100 animate-pulse">جاري تثبيت الصورة...</span>
                    </>
                  ) : (
                    <>
                      <Check size={20} className="group-hover:scale-110 transition-transform" />
                      <span>اعتماد الصورة الجديدة</span>
                    </>
                  )}
                </div>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="w-full max-w-lg space-y-5">
            <h3 className="text-center text-2xl font-black text-slate-950 mb-8 tracking-tight">البيانات الأكاديمية المسجلة</h3>
            
            <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 flex items-center justify-between transition-colors hover:border-blue-200 group">
              <div>
                <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">الاسم بالكامل</p>
                <p className="font-black text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{session.user.name}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500">
                <BadgeCheck size={24} />
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 flex items-center justify-between transition-colors hover:border-blue-200 group">
              <div>
                <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">الدرجة الأكاديمية / الصلاحية</p>
                <p className="font-black text-slate-900 text-lg group-hover:text-blue-700 transition-colors">
                  {(session.user as any).role === "ADMIN" ? "مدير نظام (Admin)" : ((session.user as any).academicTitle || "عضو هيئة تدريس")}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500">
                <GraduationCap size={24} />
              </div>
            </div>

            <div className="mt-8 bg-amber-50/50 border border-amber-200/60 p-5 rounded-[1.5rem] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                 <ShieldAlert size={20} />
              </div>
              <p className="text-xs font-bold text-amber-800 leading-relaxed pt-1">
                هذه البيانات مقفلة للقراءة فقط ومسجلة رسمياً بالنظام. في حال وجود خطأ في الدرجة الأكاديمية أو الاسم، يرجى مراجعة إدارة الدراسات العليا المركزية.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}