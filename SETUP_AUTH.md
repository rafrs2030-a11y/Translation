# إعداد نظام المصادقة (Authentication Setup)

## 📋 المشكلة

المستخدمون الموجودون في قاعدة البيانات (`public.users`) غير موجودين في نظام Supabase Auth (`auth.users`). لذلك، لا يمكن تسجيل الدخول حالياً.

## 🔧 الحل

يجب إنشاء المستخدمين في Supabase Auth أولاً. اتبع الخطوات التالية:

### الخطوة 1: إنشاء ملف `.env`

قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع بالمحتوى التالي:

\`\`\`env
# Supabase Configuration
SUPABASE_URL=https://rzenhmmwocctvonwhnrj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZW5obW13b2NjdHZvbndobnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTAwODYsImV4cCI6MjA3ODc2NjA4Nn0.wGQZ4osd-MrQudrt6lBhHaumbFjYT26-hoNR4TnjEQM
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=Arab Research Platform <noreply@arabresearch.com>

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Session Configuration
SESSION_SECRET=your_random_secret_here

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document
\`\`\`

### الخطوة 2: الحصول على Service Role Key

1. اذهب إلى لوحة تحكم Supabase: https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj
2. اذهب إلى **Settings** → **API**
3. انسخ **service_role key** (secret)
4. استبدل `your_service_role_key_here` في ملف `.env` بالمفتاح المنسوخ

⚠️ **تحذير**: لا تشارك service_role_key مع أي شخص! هذا مفتاح سري ويمنح صلاحيات كاملة.

### الخطوة 3: تشغيل سكريبت إنشاء المستخدمين

بعد إعداد ملف `.env`، قم بتشغيل:

\`\`\`bash
node scripts/create-auth-users.js
\`\`\`

سيقوم السكريبت بإنشاء المستخدمين التالية في Supabase Auth:

| البريد الإلكتروني | كلمة المرور | الدور |
|-------------------|-------------|-------|
| admin@arabresearch.com | Admin@123 | admin |
| ahmad@example.com | Test@123 | researcher |
| fatima@example.com | Test@123 | researcher |
| mohammed@example.com | Test@123 | researcher |

### الخطوة 4: التحقق من نجاح العملية

بعد تشغيل السكريبت، يجب أن ترى رسائل نجاح مثل:

\`\`\`
✅ Created user: admin@arabresearch.com (Role: admin)
✅ Created user: ahmad@example.com (Role: researcher)
...
\`\`\`

### الخطوة 5: اختبار تسجيل الدخول

الآن يمكنك تشغيل السيرفر واختبار تسجيل الدخول:

\`\`\`bash
npm run dev
\`\`\`

ثم افتح المتصفح على `http://localhost:3000/pages/login.html` وسجل الدخول ب:

- **البريد**: admin@arabresearch.com
- **كلمة المرور**: Admin@123

---

## 🔍 طريقة بديلة (من لوحة التحكم)

إذا لم تستطع تشغيل السكريبت، يمكنك إنشاء المستخدمين يدوياً من لوحة تحكم Supabase:

1. اذهب إلى **Authentication** → **Users**
2. اضغط **Add user** → **Create new user**
3. أدخل البريد الإلكتروني وكلمة المرور
4. فعّل خيار **Auto Confirm User**
5. اضغط **Create user**

كرر العملية لكل مستخدم من القائمة أعلاه.

---

## ❓ أسئلة شائعة

### لماذا المستخدمون غير موجودين في Auth؟

قاعدة البيانات تم تصميمها بجدول `public.users` منفصل، لكن Supabase Auth يتطلب وجود المستخدمين في `auth.users` أيضاً.

### هل يمكن استخدام نظام مصادقة مخصص؟

نعم، يمكن تعديل الكود ليستخدم bcrypt مباشرة بدلاً من Supabase Auth. لكن استخدام Supabase Auth يوفر مزايا مثل:
- إدارة الجلسات تلقائياً
- إعادة تعيين كلمة المرور بالبريد الإلكتروني
- حماية مدمجة ضد الهجمات

### ماذا لو نسيت كلمة المرور؟

يمكنك إعادة تعيين كلمة المرور من لوحة تحكم Supabase:
1. **Authentication** → **Users**
2. اختر المستخدم → **Reset Password**

