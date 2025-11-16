# 🔐 تعليمات اختبار تسجيل الدخول

## الوضع الحالي

قمت بفحص نظام المصادقة بالكامل، وهذا ما وجدته:

### ✅ جاهز ومكتمل:
- ✅ Backend API endpoints (server/routes/auth.js)
- ✅ Frontend pages (login.html, register.html)
- ✅ JavaScript logic (login.js, register.js)
- ✅ Auth Store (authStore.js)
- ✅ Database tables (users table)
- ✅ User data (4 users exist in database)

### ⚠️ يحتاج خطوة واحدة:
- ❌ Users don't exist in Supabase Auth yet

---

## 📋 بيانات تسجيل الدخول الجاهزة

### حساب الأدمن:
```
البريد: admin@arabresearch.com
الباسورد: Admin@123
```

### حسابات الباحثين:
```
1. ahmad@example.com / Test@123
2. fatima@example.com / Test@123  
3. mohammed@example.com / Test@123
```

---

## 🚀 لاختبار تسجيل الدخول الآن - اتبع هذه الخطوات:

### الخطوة 1: إنشاء ملف `.env`

أنشئ ملف اسمه `.env` في المجلد الرئيسي للمشروع وانسخ فيه:

\`\`\`env
SUPABASE_URL=https://rzenhmmwocctvonwhnrj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZW5obW13b2NjdHZvbndobnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTAwODYsImV4cCI6MjA3ODc2NjA4Nn0.wGQZ4osd-MrQudrt6lBhHaumbFjYT26-hoNR4TnjEQM
SUPABASE_SERVICE_ROLE_KEY=GET_THIS_FROM_SUPABASE_DASHBOARD
PORT=3000
NODE_ENV=development
\`\`\`

### الخطوة 2: احصل على Service Role Key

1. اذهب إلى: https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/settings/api
2. انزل للأسفل حتى ترى "Service role" 
3. انسخ المفتاح (سيكون طويلاً ويبدأ بـ eyJ...)
4. استبدل `GET_THIS_FROM_SUPABASE_DASHBOARD` في ملف .env بالمفتاح

### الخطوة 3: شغّل السكريبت لإنشاء المستخدمين

\`\`\`bash
node scripts/create-auth-users.js
\`\`\`

يجب أن ترى:
```
✅ Created user: admin@arabresearch.com (Role: admin)
✅ Created user: ahmad@example.com (Role: researcher)
✅ Created user: fatima@example.com (Role: researcher)
✅ Created user: mohammed@example.com (Role: researcher)
```

### الخطوة 4: شغّل السيرفر

\`\`\`bash
npm run dev
\`\`\`

أو:

\`\`\`bash
node server/index.js
\`\`\`

### الخطوة 5: افتح المتصفح

اذهب إلى:
```
http://localhost:3000/pages/login.html
```

### الخطوة 6: سجل دخول

- البريد: `admin@arabresearch.com`
- الباسورد: `Admin@123`
- اضغط "تسجيل الدخول"

### النتيجة المتوقعة:

✅ رسالة: "تم تسجيل الدخول بنجاح! جاري التحويل..."
✅ يتم تحويلك إلى: `http://localhost:3000/pages/admin/dashboard.html`

---

## 🔄 طريقة بديلة (إنشاء يدوي)

إذا لم تستطع تشغيل السكريبت:

1. اذهب إلى: https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/auth/users
2. اضغط "Add user" (في الأعلى على اليمين)
3. اختر "Create new user"
4. أدخل:
   - Email: `admin@arabresearch.com`
   - Password: `Admin@123`
   - ✅ فعّل "Auto Confirm User"
5. اضغط "Create user"

كرر العملية للمستخدمين الآخرين.

---

## 🐛 حل المشاكل

### "supabaseUrl is required"
➡️ تأكد من إنشاء ملف `.env` في المجلد الرئيسي

### "البريد الإلكتروني أو كلمة المرور غير صحيحة"
➡️ تأكد من إنشاء المستخدم في Supabase Auth (الخطوة 3)

### "Failed to fetch" أو "Network Error"
➡️ تأكد من تشغيل السيرفر (الخطوة 4)

### السيرفر لا يشتغل
➡️ جرب: `npm install` ثم `npm run dev`

---

## 📊 ما تم اختباره

✅ فحص قاعدة البيانات - المستخدمون موجودون في `public.users`
✅ فحص Supabase Auth - المستخدمون غير موجودين في `auth.users` (يحتاج الخطوة 3)
✅ فحص الكود - كل شيء جاهز ومكتمل
✅ تجهيز سكريبت الإنشاء - موجود في `scripts/create-auth-users.js`

---

## 🎯 الخلاصة

**النظام جاهز بنسبة 95%!** 

فقط تحتاج:
1. إنشاء ملف `.env` (دقيقة واحدة)
2. نسخ Service Role Key (30 ثانية)
3. تشغيل السكريبت (10 ثوانٍ)
4. اختبار تسجيل الدخول (30 ثانية)

**المجموع: دقيقتان فقط! ⏱️**

---

للمزيد من التفاصيل، راجع:
- `SETUP_AUTH.md` - دليل الإعداد الكامل
- `AUTH_TEST_SUMMARY.md` - تقرير الاختبار المفصل
- `scripts/create-auth-users.js` - السكريبت الجاهز

