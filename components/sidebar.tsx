import Link from "next/link"
import { Home, BookOpen, HeartPulse, Trophy, Palette, Image as ImageIcon, Phone } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="space-y-6">
      <div className="bg-card rounded-xl border shadow-sm p-1">
        <nav className="flex flex-col space-y-1 p-2">
          <div className="px-4 py-2 mb-2 border-b">
             <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
               <span className="w-1.5 h-5 bg-primary rounded-full"></span>
               أقسام الجريدة
             </h2>
          </div>
          
          {/* الروابط مربوطة بأسماء المجلدات الخاصة بك */}
          {[
            { name: 'الرئيسية', icon: Home, href: '/' },
            { name: 'أخبار الكلية', icon: BookOpen, href: '/News' },
            { name: 'صحة وتغذية', icon: HeartPulse, href: '/Artical' }, 
            { name: 'رياضة ونشاط', icon: Trophy, href: '/Sport' },
            { name: 'مشاركات فنية', icon: Palette, href: '/Calcutural' },
            { name: 'معرض الصور', icon: ImageIcon, href: '#' },
            { name: 'اتصل بنا', icon: Phone, href: '#' },
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="bg-card border rounded-xl p-6 shadow-sm text-center">
         <p className="text-primary font-bold mb-2">✨ حكمة اليوم</p>
         <p className="text-muted-foreground text-sm">"التعليم في الصغر كالنقش على الحجر"</p>
      </div>
    </aside>
  )
}