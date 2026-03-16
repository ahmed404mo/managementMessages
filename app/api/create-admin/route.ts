import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@system.com' },
      update: {},
      create: {
        email: 'admin@system.com',
        name: 'مدير النظام',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    return NextResponse.json({ message: "✅ Admin Created!", email: admin.email });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}