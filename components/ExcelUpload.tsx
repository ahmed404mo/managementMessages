"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { importUsers } from "@/app/actions/excel-import";
import { Button } from "@/components/ui/button"; // Radix/Shadcn Button
import { Input } from "@/components/ui/input"; // Radix/Shadcn Input
import { Upload } from "lucide-react";

export function ExcelUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const[message, setMessage] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage("");

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // قراءة أول شيت في ملف الإكسل
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // تحويل البيانات من إكسل إلى JSON
        const excelData = XLSX.utils.sheet_to_json(worksheet);

        // إرسال البيانات إلى السيرفر (Server Action)
        const response = await importUsers(excelData as any);

        if (response.success) {
          setMessage(`تم إضافة ${response.count} مستخدم بنجاح!`);
        } else {
          setMessage(response.error || "فشل الاستيراد");
        }
      } catch (error) {
        console.error(error);
        setMessage("حدث خطأ أثناء قراءة الملف. تأكد من صيغة الإكسل.");
      } finally {
        setIsLoading(false);
        // إعادة تعيين الـ Input
        e.target.value = "";
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-card">
      <h3 className="text-lg font-semibold">استيراد بيانات الدكاترة (Excel)</h3>
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          disabled={isLoading}
          className="cursor-pointer"
        />
        <Button disabled={isLoading}>
          {isLoading ? "جاري الرفع..." : <><Upload className="mr-2 h-4 w-4" /> رفع الملف</>}
        </Button>
      </div>
      {message && (
        <p className={`text-sm ${message.includes("بنجاح") ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}