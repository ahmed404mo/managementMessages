"use client";

import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import { signOut, useSession, SessionProvider } from "next-auth/react";
import { 
  LogOut, 
  GraduationCap, 
  LayoutDashboard, 
  FileText, 
  User, 
  Bell,
  MessageSquare,
  Mail,
  Linkedin,
  Globe,
  PhoneCall // تم إضافة أيقونة التواصل هنا
} from "lucide-react";
import { getUserProfileImage } from "./doctor-dashboard/profile/actions";
import { getUnreadNotificationsCount, markAllNotificationsAsRead } from "./actions"; 
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// --- مكون الـ Navbar العلوي ---
function DoctorNavbar({ unreadCount }: { unreadCount: number }) {
  const { data: session, status } = useSession();
  const [userImage, setUserImage] = useState<string | null>(null);
  const pathname = usePathname();
  const isSubPage = pathname !== "/doctor-dashboard";

  useEffect(() => {
    if (session?.user && (session.user as any).id) {
      getUserProfileImage((session.user as any).id).then(img => {
        if (img) setUserImage(img);
      });
    }
  }, [session]);

  return (
    <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          <div className="flex items-center gap-2 md:gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-950 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg rotate-3 group-hover:rotate-0 transition-all">
              <GraduationCap size={24} className="text-blue-500" />
            </div>
            <div className="flex flex-col text-right">
              <Link href="/doctor-dashboard" className="text-sm md:text-xl font-black text-slate-950 block leading-tight">
                البوابة <span className="text-blue-600">الأكاديمية</span>
              </Link>
              <span className="text-[9px] md:text-[11px] font-bold text-slate-500 uppercase tracking-tight">نظام الدراسات العليا</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <AnimatePresence>
              {isSubPage && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="hidden md:block">
                  <Link href="/doctor-dashboard" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl border border-blue-100 transition-all text-sm font-black group">
                    <LayoutDashboard size={16} className="group-hover:rotate-12 transition-transform" />
                    <span>العودة للبوابة الأكاديمية</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/doctor-dashboard/notifications" className={`p-2.5 rounded-xl transition-all relative group ${pathname === '/doctor-dashboard/notifications' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                    {unreadCount > 9 ? "+9" : unreadCount}
                  </span>
                )}
              </Link>
              <Link href="/doctor-dashboard/theses" className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 transition-all">
                <MessageSquare size={20} />
              </Link>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block mx-1"></div>
            {status === "loading" ? (
              <div className="w-10 h-10 md:w-32 bg-slate-100 animate-pulse rounded-xl" />
            ) : session?.user ? (
              <Link href="/doctor-dashboard/profile" className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1.5 md:px-4 md:py-2 rounded-2xl transition-all shadow-sm group">
                <div className="flex flex-col text-right hidden md:flex">
                  <p className="text-xs font-black text-slate-950 leading-none mb-1 group-hover:text-blue-600 transition-colors">{session.user.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{(session.user as any).role === "ADMIN" ? "أدمن النظام" : "عضو هيئة تدريس"}</p>
                </div>
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white overflow-hidden">
                  {userImage ? <img src={userImage} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-sm">D</span>}
                </div>
              </Link>
            ) : null}
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// --- المكون الرئيسي ---
export default function DoctorPortalLayout({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  const refreshNotifications = async () => {
    if (pathname === "/doctor-dashboard/notifications") {
      await markAllNotificationsAsRead();
      setUnreadCount(0);
    } else {
      const count = await getUnreadNotificationsCount();
      setUnreadCount(count);
    }
  };

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 60000);
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans relative" dir="rtl">
        <DoctorNavbar unreadCount={unreadCount} />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 pb-32 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>

        {/* الموبايل نافبار */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-[100]">
          <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2 shadow-2xl flex items-center justify-around">
            {[
              { icon: <LayoutDashboard size={22} />, label: "الرئيسية", href: "/doctor-dashboard" },
              { icon: <FileText size={22} />, label: "الرسائل", href: "/doctor-dashboard/theses" },
              { icon: <Bell size={22} />, label: "تنبيهات", href: "/doctor-dashboard/notifications", count: unreadCount },
              { icon: <PhoneCall size={22} />, label: "تواصل", href: "/doctor-dashboard/contact" }, // تم إضافة تاب تواصل هنا
              { icon: <User size={22} />, label: "بروفايلي", href: "/doctor-dashboard/profile" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="relative flex-1 py-2 flex flex-col items-center gap-1">
                <div className={`transition-all ${pathname === item.href ? 'text-blue-400 -translate-y-1' : 'text-slate-400'}`}>
                  <div className="relative">
                    {item.icon}
                    {item.count !== undefined && item.count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-slate-900">{item.count > 9 ? "+9" : item.count}</span>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-bold ${pathname === item.href ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* الفوتر الجديد مع SVG مدمج لضمان العمل 100% */}
        <footer className="bg-[#020617] pt-28 pb-16 mt-auto hidden md:block text-center relative overflow-hidden">
           
           {/* طبقة النجوم (نظام SVG Pattern) */}
           <div className="absolute inset-0 z-0">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
               <defs>
                 <radialGradient id="star" cx="50%" cy="50%" r="50%">
                   <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                   <stop offset="100%" stopColor="white" stopOpacity="0" />
                 </radialGradient>
               </defs>
               <rect width="100%" height="100%" fill="transparent" />
               {[...Array(50)].map((_, i) => (
                 <circle key={i} r={Math.random() * 1.5} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 100}%`} fill="url(#star)">
                   <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + Math.random() * 3}s`} repeatCount="indefinite" />
                 </circle>
               ))}
             </svg>
           </div>

           {/* طبقة الجبال (SVG Valley) مدمجة في الأسفل */}
           <div className="absolute bottom-0 left-0 w-full z-0 opacity-20 pointer-events-none">
              <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
           </div>

           <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8 relative z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] rotate-3">
                  <GraduationCap size={28} className="text-white" />
                </div>
                <p className="text-blue-400 text-[10px] font-black tracking-[4px] uppercase mt-3">Academic Portal v2.0</p>
              </div>

              {/* أزرار التواصل الخاصة بأحمد مختار */}
              <div className="flex flex-wrap justify-center items-center gap-4">
                <a href="https://portfolio-coral-theta-31.vercel.app/" target="_blank" className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl text-slate-200 hover:text-white hover:border-emerald-500/50 hover:bg-white/10 transition-all text-sm font-bold group">
                  <Globe size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span>Portfolio</span>
                </a>
                <a href="https://www.linkedin.com/in/ahmed-mokhtar-a23a10372" target="_blank" className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl text-slate-200 hover:text-white hover:border-blue-400/50 hover:bg-white/10 transition-all text-sm font-bold group">
                  <Linkedin size={18} className="text-[#0077B5] group-hover:scale-110 transition-transform" />
                  <span>LinkedIn</span>
                </a>
                <a href="mailto:mo879938@gmail.com" className="flex items-center gap-3 px-5 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl text-slate-200 hover:text-white hover:border-blue-500/50 hover:bg-white/10 transition-all text-sm font-bold group">
                  <Mail size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  <span>Email Me</span>
                </a>
              </div>

              <div className="flex flex-col gap-2 border-t border-white/5 w-full pt-8 mt-4">
                <p className="text-slate-500 text-[12px] font-bold">
                  تم التطوير بواسطة <span className="text-white font-black">أحمد مختار</span>
                </p>
                <p className="text-slate-700 text-[10px] font-medium uppercase tracking-widest opacity-60">
                  جميع الحقوق محفوظة © {new Date().getFullYear()}
                </p>
              </div>
           </div>
        </footer>
      </div>
    </SessionProvider>
  );
}