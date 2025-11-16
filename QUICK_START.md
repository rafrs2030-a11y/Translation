# 🚀 دليل البدء السريع - منصة نشر الأبحاث العربية

## 📋 المتطلبات

قبل البدء، تأكد من تثبيت:
- ✅ Node.js (v18.0.0 أو أحدث)
- ✅ npm (v9.0.0 أو أحدث)
- ✅ Git
- ✅ حساب Supabase (مجاني)

---

## ⚡ البدء السريع (5 دقائق)

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd Assistant-for-evaluating-scientific-research
```

### 2. تثبيت الحزم
```bash
npm install
```

### 3. إعداد Supabase

#### أ) إنشاء مشروع جديد
1. اذهب إلى [Supabase](https://supabase.com)
2. أنشئ حساب جديد أو سجل دخول
3. أنشئ مشروع جديد
4. انتظر حتى يكتمل الإعداد (~2 دقيقة)

#### ب) الحصول على API Keys
1. في لوحة تحكم Supabase، اذهب إلى: **Settings** > **API**
2. انسخ:
   - `Project URL`
   - `anon/public key`
   - `service_role key` (سري - لا تشاركه!)

### 4. إعداد ملف البيئة

```bash
# انسخ ملف المثال
cp .env.example .env

# افتح .env وأضف بياناتك
```

حدّث القيم التالية في `.env`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
PROJECT_ID=your_project_id
```

### 5. إعداد قاعدة البيانات

في لوحة تحكم Supabase:
1. اذهب إلى **SQL Editor**
2. انسخ محتوى `database/schema.sql`
3. الصقه في المحرر
4. اضغط **Run**
5. انتظر حتى ينتهي التنفيذ

(اختياري) لإضافة بيانات تجريبية:
1. انسخ محتوى `database/seed.sql`
2. الصقه في المحرر
3. اضغط **Run**

### 6. تشغيل المشروع

```bash
# Development mode
npm run dev

# أو Production mode
npm start
```

### 7. افتح المتصفح

```
http://localhost:3000
```

🎉 **مبروك! المشروع يعمل الآن!**

---

## 👤 حسابات الاختبار

### مسؤول (Admin)
```
Email: admin@arabresearch.com
Password: Admin@123456
```
⚠️ **مهم:** غيّر كلمة المرور بعد أول تسجيل دخول!

### باحث (Researcher)
سجل حساب جديد من صفحة التسجيل

---

## 📁 هيكل المشروع

```
project-root/
├── config/           # إعدادات التطبيق
├── database/         # SQL schemas & migrations
├── server/           # Backend (Express)
│   ├── routes/       # API endpoints
│   └── middleware/   # Middleware
├── stores/           # State management
├── utils/            # Helper functions
└── public/           # Frontend
    ├── css/          # Stylesheets
    ├── js/           # JavaScript
    └── pages/        # HTML pages
```

---

## 🔧 الأوامر المتاحة

```bash
# تشغيل التطوير (مع hot reload)
npm run dev

# تشغيل الإنتاج
npm start

# تشغيل الاختبارات
npm test

# تشغيل migrations
npm run db:migrate

# إضافة بيانات تجريبية
npm run db:seed
```

---

## 🌐 الصفحات المتاحة

### عامة
- `/` - الصفحة الرئيسية
- `/pages/login.html` - تسجيل الدخول
- `/pages/register.html` - إنشاء حساب

### الباحث
- `/pages/researcher/dashboard.html` - لوحة التحكم
- `/pages/researcher/submit.html` - تقديم بحث جديد
- `/pages/researcher/submissions.html` - طلباتي
- `/pages/researcher/notifications.html` - الإشعارات

### المسؤول
- `/pages/admin/dashboard.html` - لوحة المسؤول
- `/pages/admin/submissions.html` - مراجعة الطلبات

---

## ⚙️ إعدادات إضافية

### إعداد البريد الإلكتروني (اختياري)

لتفعيل إرسال البريد:

1. **Gmail:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your.email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```
   
   احصل على App Password من: [Google Account Settings](https://myaccount.google.com/apppasswords)

2. **خدمات أخرى:**
   - Outlook: `smtp.office365.com:587`
   - Yahoo: `smtp.mail.yahoo.com:587`
   - Mailgun, SendGrid, etc.

### إعداد File Upload

الإعدادات الافتراضية:
- حجم أقصى: 10MB
- أنواع مسموحة: PDF, DOCX, DOC

لتغيير الإعدادات، حدّث `.env`:
```env
MAX_FILE_SIZE=20971520  # 20MB
ALLOWED_FILE_TYPES=pdf,docx,doc,txt
```

---

## 🐛 حل المشاكل الشائعة

### المشكلة: Port 3000 مستخدم
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# أو غيّر البورت في .env
PORT=3001
```

### المشكلة: خطأ في الاتصال بـ Supabase
✅ تحقق من صحة `SUPABASE_URL` و `SUPABASE_ANON_KEY`  
✅ تأكد من تشغيل project في Supabase  
✅ تحقق من الاتصال بالإنترنت

### المشكلة: Database tables غير موجودة
✅ شغّل `database/schema.sql` في Supabase SQL Editor  
✅ تحقق من عدم وجود أخطاء في التنفيذ

### المشكلة: Cannot find module
```bash
# امسح node_modules وأعد التثبيت
rm -rf node_modules
npm install
```

---

## 📚 الموارد

### التوثيق
- [README.md](README.md) - دليل شامل
- [docs/](docs/) - وثائق تفصيلية
- [DEVELOPMENT_PROGRESS.md](DEVELOPMENT_PROGRESS.md) - تقدم التطوير
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - حالة المشروع

### المساعدة
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Docs](https://expressjs.com)
- [MDN Web Docs](https://developer.mozilla.org)

---

## 🚀 الخطوات التالية

بعد التشغيل، يمكنك:

1. **استكشاف الواجهة:**
   - جرّب التسجيل كباحث
   - قدّم بحث تجريبي
   - سجل دخول كمسؤول وراجع الطلبات

2. **تخصيص التصميم:**
   - عدّل الألوان في `public/css/main.css`
   - غيّر الشعار والنصوص
   - أضف ميزات جديدة

3. **التطوير:**
   - راجع Epics في `epics/` لفهم المتطلبات
   - راجع Stores في `stores/` لفهم البيانات
   - أضف صفحات أو ميزات جديدة

4. **النشر:**
   - راجع `docs/DEPLOYMENT.md`
   - جهز للإنتاج
   - انشر على Netlify أو خادم آخر

---

## 💡 نصائح

✅ استخدم `npm run dev` أثناء التطوير  
✅ راجع Console في المتصفح للأخطاء  
✅ استخدم Developer Tools للتصحيح  
✅ اقرأ التوثيق في `docs/` عند الحاجة  
✅ احفظ نسخة احتياطية من `.env`

---

## 📞 الدعم

إذا واجهت مشكلة:
1. راجع قسم "حل المشاكل" أعلاه
2. راجع التوثيق في `docs/`
3. تحقق من Console logs
4. راجع Supabase logs في Dashboard

---

**تاريخ التحديث:** 2025-11-16  
**الإصدار:** 1.0.0  

🎉 **نتمنى لك تجربة تطوير ممتعة!**

