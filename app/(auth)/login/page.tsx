"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("كود المستخدم أو كلمة المرور غير صحيحة");
      setIsLoading(false);
    } else {
      router.push("/admin-dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden" dir="rtl">
      {/* الدوائر الخلفية للزينة (نفس روح الـ Layout) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full z-10"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* Header الجزء العلوي الأسود مثل الـ Sidebar */}
          <div className="bg-slate-950 p-10 text-center relative">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-6 rotate-3">
              <GraduationCap size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
              بوابة <span className="text-blue-500">الرسائل</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[4px] mt-2 opacity-80">
              Graduate Studies System
            </p>
          </div>

          <div className="p-10 pt-12">
            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 text-xs text-rose-600 font-black bg-rose-50 border border-rose-100 rounded-2xl text-center italic"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-5 text-right">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 mr-2 uppercase tracking-widest">
                    كود المستخدم
                  </label>
                  <div className="relative group">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pr-12 pl-4 text-slate-900 font-bold outline-none ring-2 ring-transparent focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all text-left"
                      placeholder="User Code"
                      dir="ltr"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 mr-2 uppercase tracking-widest">
                    كلمة المرور
                  </label>
                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      type="password"
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pr-12 pl-4 text-slate-900 font-bold outline-none ring-2 ring-transparent focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all text-left"
                      placeholder="••••••••"
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

<motion.button
  type="submit"
  disabled={isLoading}
  // تأثيرات حركية ناعمة عند تمرير الماوس والضغط
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.96 }}
  className="group relative w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-300 hover:shadow-blue-600/40 transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden border border-slate-800 hover:border-blue-500/50"
>
  {/* 1. تأثير اللمعان (Shine Effect) المستمر */}
  {!isLoading && (
    <motion.div 
      className="absolute inset-0 z-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
      initial={{ x: "-200%" }}
      animate={{ x: "300%" }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.5, 
        ease: "easeInOut", 
        repeatDelay: 3 // اللمعة هتتكرر كل 3 ثواني
      }}
    />
  )}

  {/* 2. التدرج اللوني اللي بيظهر مع الـ Hover */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

  {/* 3. محتوى الزر (النص والأيقونات) */}
  <div className="relative z-10 flex items-center gap-3">
    {isLoading ? (
      <>
        <Loader2 className="animate-spin text-blue-400" size={24} />
        <span className="text-blue-100 animate-pulse">جاري التحقق...</span>
      </>
    ) : (
      <>
        <span>دخول للنظام</span>
        <ArrowRight size={20} className="group-hover:-translate-x-2 transition-transform duration-300" />
      </>
    )}
  </div>
</motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">
                جميع الحقوق محفوظة &copy; {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}