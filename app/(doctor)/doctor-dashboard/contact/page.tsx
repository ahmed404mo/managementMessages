"use client";
import { motion } from "framer-motion";
import { Mail, Linkedin, Globe, GraduationCap, ChevronLeft } from "lucide-react";

export default function ContactPage() {
  return (
    // هنا التعديل: استخدمنا calc لملء الشاشة، و w-full لعرض الشاشة، وتعديل الحواف
    <div className="min-h-[calc(100vh-120px)] w-full flex flex-col items-center justify-center relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-[#020617] p-4 sm:p-8 shadow-2xl border border-white/5">
      
      {/* خلفية النجوم المدمجة */}
      <div className="absolute inset-0 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          {[...Array(50)].map((_, i) => (
            <circle key={i} r={Math.random() * 1.5} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 100}%`} fill="white">
              <animate attributeName="opacity" values="0.1;1;0.1" dur={`${2 + Math.random() * 3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>

      {/* الجبال البيضاء */}
      <div className="absolute bottom-0 left-0 w-full z-0 opacity-20 pointer-events-none transform scale-y-125 origin-bottom">
        <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,224C840,245,960,267,1080,250.7C1200,235,1320,181,1380,165.3L1440,150L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center text-center gap-8"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] rotate-6">
            <GraduationCap size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-black">تواصل مع المطور</h1>
            <p className="text-blue-400 font-bold text-xs uppercase tracking-[4px] mt-1">Academic Portal v2.0</p>
          </div>
        </div>

        {/* كروت التواصل */}
        <div className="w-full flex flex-col gap-3">
          <a href="mailto:mo879938@gmail.com" className="flex items-center gap-4 p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
              <Mail size={24} />
            </div>
            <div className="flex flex-col text-right flex-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">البريد الإلكتروني</span>
              <span className="text-slate-100 font-bold">mo879938@gmail.com</span>
            </div>
          </a>

          <a href="https://www.linkedin.com/in/ahmed-mokhtar-a23a10372" target="_blank" className="flex items-center gap-4 p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
            <div className="w-12 h-12 bg-[#0077B5]/20 rounded-2xl flex items-center justify-center text-[#0077B5]">
              <Linkedin size={24} />
            </div>
            <div className="flex flex-col text-right flex-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">لينكد إن</span>
              <span className="text-slate-100 font-bold">Ahmed Mokhtar</span>
            </div>
          </a>

          <a href="https://portfolio-coral-theta-31.vercel.app/" target="_blank" className="flex items-center gap-4 p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
              <Globe size={24} />
            </div>
            <div className="flex flex-col text-right flex-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">معرض الأعمال</span>
              <span className="text-slate-100 font-bold">My Portfolio</span>
            </div>
            <ChevronLeft size={20} className="text-slate-600 mr-auto" />
          </a>
        </div>

        <div className="pt-6 border-t border-white/5 w-full">
           <p className="text-slate-500 text-[11px] font-bold">تم التطوير بواسطة أحمد مختار © {new Date().getFullYear()}</p>
        </div>
      </motion.div>
    </div>
  );
}