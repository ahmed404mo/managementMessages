import { prisma } from "@/lib/prisma";
import ThesesClientView from "./theses-client";

export const metadata = {
  title: "المكتبة الرقمية | البوابة الأكاديمية",
};

export default async function DoctorPortalPage() {
  const theses = await prisma.thesis.findMany({
    include: {
      supervisors: {
        include: {
          doctor: true,
          externalExaminer: true,
        }
      }
    },
    orderBy: {
      registrationDate: 'desc'
    }
  });

  // هنا قمنا بحذف الـ Hero القديم وتركنا فقط استدعاء المكون التفاعلي
  return (
    <div className="min-h-screen bg-slate-50/30">
        <ThesesClientView initialTheses={theses} />
    </div>
  );
}