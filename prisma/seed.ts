import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { doctorCode: 'admin' }, // البحث بالكود عشان ميتكررش
    update: {},
    create: {
      doctorCode: 'admin', // ده اللي هتدخل بيه
      name: 'مدير النظام',
      password: hashedPassword,
      tempPassword: 'admin123', // عشان لو حبيت تعرضه في الجدول
      academicTitle: 'مدير النظام', // لأننا ضفناها في السكيما
      role: 'ADMIN',
    },
  })

  console.log('✅ تم إنشاء حساب الأدمن بنجاح. كود الدخول:', admin.doctorCode)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })