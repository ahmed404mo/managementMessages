"use client";
import { useState } from "react";
import { addExternalAction } from "./actions";
import { UserPlus, School, Award, Loader2, GraduationCap } from "lucide-react";

export default function ExternalForm({ onSuccess, onError }: { onSuccess: (msg: string) => void, onError: (msg: string) => void }) {
    const [loading, setLoading] = useState(false);

  return (
    <form action={async (formData) => {
      setLoading(true);
      const res = await addExternalAction(formData);
      setLoading(false);
      if (res.success) {
        onSuccess("تم إضافة المناقش بنجاح");
        (document.getElementById("ext-form") as HTMLFormElement).reset();
      } else {
        onError(res.error || "خطأ");
      }
    }} id="ext-form" className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
      
      <h2 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-3">
        <UserPlus className="text-blue-600" size={24} /> إضافة مناقش خارجي
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-wider">اللقب</label>
            <select name="academicTitle" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold outline-none focus:border-blue-600 appearance-none">
              <option>دكتور</option>
              <option>أستاذ مساعد</option>
              <option>أستاذ دكتور</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-wider">الاسم بالكامل</label>
            <input name="name" required placeholder="الاسم الرباعي..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold outline-none focus:border-blue-600 transition-all shadow-inner" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-wider">الجامعة / الجهة</label>
          <div className="relative">
            <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input name="universityName" required placeholder="مثال: جامعة القاهرة" className="w-full p-4 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold outline-none focus:border-blue-600 shadow-inner" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 mr-2 uppercase tracking-wider">التخصص الدقيق</label>
          <div className="relative">
            <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input name="specialty" required placeholder="مثال: ذكاء اصطناعي" className="w-full p-4 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold outline-none focus:border-blue-600 shadow-inner" />
          </div>
        </div>
      </div>

      <button disabled={loading} className="w-full bg-slate-950 text-white p-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3">
        {loading ? <Loader2 className="animate-spin" /> : "حفظ المناقش"}
      </button>
    </form>
  );
}