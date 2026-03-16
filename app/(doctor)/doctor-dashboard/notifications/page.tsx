import { Info, CheckCircle2, Clock, BellRing, AlertTriangle } from "lucide-react";
import { getNotifications } from "./actions"; // استيراد الأكشن
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export default async function NotificationsPage() {
  const notifications = await getNotifications();
  
  // حساب عدد التنبيهات غير المقروءة
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          التنبيهات
          {unreadCount > 0 && (
            <div className="relative flex">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </div>
          )}
        </h1>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          لديك {notifications.length} تنبيه
        </span>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`bg-white border p-4 rounded-3xl flex gap-4 items-start hover:shadow-md transition-all group ${
                !notif.read ? "border-blue-100 bg-blue-50/30" : "border-slate-100"
              }`}
            >
              <div className={`p-3 rounded-2xl shrink-0 ${
                notif.type === "success" ? "bg-emerald-100 text-emerald-600" : 
                notif.type === "warning" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
              }`}>
                {notif.type === "success" ? <CheckCircle2 size={22}/> : 
                 notif.type === "warning" ? <AlertTriangle size={22}/> : <Info size={22}/>}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-black text-slate-800 mb-1">{notif.title}</h3>
                  {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{notif.message}</p>
                
                <div className="flex items-center gap-1 mt-3 text-[10px] text-slate-400 font-bold">
                  <Clock size={12}/>
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ar })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <BellRing className="mx-auto text-slate-300 mb-4" size={48} />
             <p className="text-slate-400 font-black">لا توجد تنبيهات حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}