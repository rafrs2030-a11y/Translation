# دليل تثبيت المكاتب (Dependencies)

## ✅ المكاتب المطلوبة

المشروع يحتاج إلى المكاتب التالية المذكورة في `package.json`:

### Dependencies (التبعيات الأساسية)
- `next` - Next.js framework
- `react` - React library
- `react-dom` - React DOM
- `@supabase/ssr` - Supabase SSR support
- `@supabase/supabase-js` - Supabase client
- `bmad-method` - Utility library
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `multer` - File upload
- `nodemailer` - Email sending
- `resend` - Email service

### DevDependencies (للتنمية)
- `typescript` - TypeScript compiler
- `@types/node` - Node.js types
- `@types/react` - React types
- `@types/react-dom` - React DOM types
- `cypress` - Testing framework

## 🚀 طريقة التثبيت

### الطريقة الأولى: npm install (الأفضل)
```bash
npm install
```

### الطريقة الثانية: إذا واجهت مشاكل في PowerShell
```bash
# في Command Prompt (cmd) بدلاً من PowerShell
npm install
```

### الطريقة الثالثة: تثبيت يدوي
```bash
npm install next@^14.2.0 react@^18.3.0 react-dom@^18.3.0
npm install @supabase/ssr@^0.1.0 @supabase/supabase-js@^2.39.0
npm install typescript@^5.3.0 @types/node@^20.11.0 @types/react@^18.2.0 @types/react-dom@^18.2.0
npm install bmad-method cors dotenv multer nodemailer resend
npm install --save-dev cypress
```

## ⚙️ حل مشاكل PowerShell

إذا واجهت خطأ "running scripts is disabled":

### الحل السريع (للسيشن الحالي فقط):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
npm install
```

### الحل الدائم (يتطلب صلاحيات Admin):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## ✅ التحقق من التثبيت

بعد التثبيت، تحقق من وجود مجلد `node_modules`:
```bash
# في PowerShell
Test-Path node_modules

# يجب أن يعيد True
```

## 🎯 بعد التثبيت

1. **إنشاء ملف `.env.local`**:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. **تشغيل المشروع**:
```bash
npm run dev
```

3. **فتح المتصفح**:
افتح [http://localhost:3000](http://localhost:3000)

## 📝 ملاحظات

- التثبيت قد يستغرق عدة دقائق حسب سرعة الإنترنت
- تأكد من وجود Node.js 18+ مثبت
- تأكد من وجود npm أو yarn مثبت

## 🐛 استكشاف الأخطاء

### خطأ: npm command not found
- تأكد من تثبيت Node.js من [nodejs.org](https://nodejs.org)

### خطأ: Permission denied
- استخدم `sudo` في Linux/Mac
- شغّل PowerShell كـ Administrator في Windows

### خطأ: Network timeout
- تحقق من اتصال الإنترنت
- جرب استخدام VPN
- جرب `npm install --registry https://registry.npmjs.org/`

---

**بعد التثبيت الناجح، يمكنك البدء في استخدام المشروع! 🎉**

