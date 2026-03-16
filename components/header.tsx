"use client"

import Link from "next/link"
import { useRouter } from 'next/navigation' // استيراد الروتر للتوجيه
import { LogIn, LogOut, UserPlus } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import Cookies from 'js-cookie' // استيراد مكتبة الكوكيز

export function Header() {
  const router = useRouter()

  // --- دالة تسجيل الخروج ---
  const handleLogout = () => {
    Cookies.remove('auth-token') // 1. حذف التوكن
    router.push('/login')        // 2. توجيه لصفحة الدخول
    router.refresh()             // 3. تحديث الصفحة لتفعيل الميدل وير
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* اللوجو (يمين) */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            ج
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-foreground">جريدة الطفولة</h1>
          </div>
        </div>

        {/* الأزرار (يسار) */}
        <div className="flex items-center gap-3">
          
          <ModeToggle />

          <div className="h-6 w-[1px] bg-border mx-1"></div>

          {/* زر تسجيل الدخول (يوديك لصفحة Login) */}
          <Link 
            href="/login" 
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">دخول</span>
          </Link>

          {/* زر تسجيل الخروج (بيشغل الدالة اللي كتبناها فوق) */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors border border-red-200 bg-red-50 px-3 py-1.5 rounded-md"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">خروج</span>
          </button>

          {/* زر حساب جديد */}
          <Link 
            href="/register" 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            <UserPlus className="h-4 w-4" />
            <span>حساب جديد</span>
          </Link>

        </div>
      </div>
    </header>
  )
}