# 📚 Arab Research Publishing Platform

> منصة رقمية لتمكين الباحثين العرب من نشر أبحاثهم وكتبهم عالمياً بطريقة منظمة وشفافة

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![Supabase](https://img.shields.io/badge/database-Supabase-green.svg)](https://supabase.com)

##  🎯 نظرة عامة

منصة شاملة تسمح للباحثين العرب بتقديم أبحاثهم العلمية وكتبهم للمراجعة والنشر، مع لوحة تحكم احترافية للمسؤولين لإدارة الطلبات ومراجعة المحتوى.

### ✨ الميزات الرئيسية

- 🔐 **نظام مصادقة آمن** - تسجيل دخول، تسجيل مستخدمين، التحقق من البريد الإلكتروني
- 📝 **تقديم الأبحاث** - نموذج شامل لتقديم الأبحاث مع رفع الملفات
- 👤 **لوحة تحكم الباحث** - متابعة الطلبات والإشعارات
- 👨‍💼 **لوحة تحكم المسؤول** - مراجعة الطلبات وإدارة الحالات
- 🔔 **نظام إشعارات متقدم** - إشعارات فورية وبريد إلكتروني
- 📊 **إحصائيات وتقارير** - لوحات معلومات تحليلية
- 📱 **تصميم متجاوب** - يعمل على جميع الأجهزة

## 🛠️ التقنيات المستخدمة

```text
Frontend:      HTML5, CSS3, JavaScript (ES6+)
Backend:       Node.js, Express
Database:      Supabase (PostgreSQL)
Authentication: Supabase Auth
Storage:       Supabase Storage
Hosting:       Netlify
Email:         Nodemailer
```

## 📋 المتطلبات

- Node.js >= 18.0.0
- npm >= 9.0.0
- حساب Supabase
- حساب Netlify (للنشر)

## 🚀 التثبيت

### 1. استنساخ المشروع

```bash
git clone https://github.com/yourusername/Arab-Research-Publishing-Platform.git
cd Arab-Research-Publishing-Platform
```

### 2. تثبيت الحزم

```bash
npm install
```

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env` في الجذر:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PROJECT_ID=your_project_id

# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 4. إعداد قاعدة البيانات

قم بتشغيل SQL التالي في Supabase SQL Editor:

```sql
-- راجع ملف database/schema.sql
```

### 5. تشغيل المشروع

```bash
# Development
npm run dev

# Production
npm start
```

المشروع سيعمل على `http://localhost:3000`

## 📁 هيكل المشروع

```
.
├── config/              # ملفات الإعدادات
│   ├── supabase.js     # إعدادات Supabase
│   └── constants.js    # الثوابت
├── stores/              # إدارة الحالة (State Management)
│   ├── authStore.js    # حالة المصادقة
│   ├── submissionsStore.js
│   ├── adminStore.js
│   ├── notificationsStore.js
│   └── index.js
├── utils/               # وظائف مساعدة
│   ├── validators.js   # التحقق من صحة البيانات
│   └── helpers.js      # وظائف عامة
├── epics/               # Epics (المتطلبات)
│   ├── epic-1-authentication.md
│   ├── epic-2-research-submission.md
│   ├── epic-3-researcher-dashboard.md
│   ├── epic-4-admin-dashboard.md
│   └── epic-5-notifications-email.md
├── public/              # ملفات ثابتة
├── docs/                # التوثيق
│   └── prd.md          # وثيقة متطلبات المنتج
├── package.json
└── README.md
```

## 🗄️ قاعدة البيانات

### الجداول الرئيسية

#### `users`
معلومات المستخدمين (باحثين ومسؤولين)

#### `submissions`
طلبات تقديم الأبحاث

#### `admin_comments`
تعليقات المسؤولين على الطلبات

#### `notifications`
إشعارات المستخدمين

#### `status_history`
سجل تغييرات حالة الطلبات

#### `audit_log`
سجل جميع العمليات للمراجعة

## 🔐 الأدوار والصلاحيات

### Researcher (باحث)
- تسجيل حساب جديد
- تقديم بحث جديد
- متابعة حالة الطلبات
- استلام الإشعارات

### Admin (مسؤول)
- مراجعة جميع الطلبات
- تحديث حالة الطلبات
- إضافة تعليقات
- عرض الإحصائيات
- تصدير البيانات

## 📊 حالات الطلبات

| الحالة | الوصف |
|--------|-------|
| `pending` | قيد المراجعة |
| `approved` | مقبول |
| `rejected` | مرفوض |
| `needs_revision` | يحتاج مراجعة |
| `draft` | مسودة |

## 🔔 نظام الإشعارات

### أنواع الإشعارات
- تغيير حالة الطلب
- تعليق جديد من المسؤول
- تأكيد تقديم البحث
- التحقق من البريد الإلكتروني
- تذكيرات

### قنوات الإشعارات
- إشعارات داخل المنصة (Realtime)
- بريد إلكتروني
- إشعارات المتصفح (Browser Notifications)

## 🧪 الاختبار

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 النشر على Netlify

1. ربط المشروع مع GitHub
2. استيراد المشروع في Netlify
3. إعداد متغيرات البيئة
4. نشر المشروع

```bash
# أو استخدم Netlify CLI
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## 🔧 التطوير

### إضافة ميزة جديدة

1. أنشئ branch جديد
```bash
git checkout -b feature/feature-name
```

2. قم بالتطوير والاختبار
3. Commit & Push
```bash
git add .
git commit -m "Add new feature"
git push origin feature/feature-name
```

4. أنشئ Pull Request

### معايير الكود

- استخدم ESLint للتحقق من الكود
- اتبع معايير JavaScript ES6+
- أضف تعليقات بالعربية للوظائف المهمة
- اكتب Unit Tests للوظائف الجديدة

## 📚 التوثيق

- [Product Requirements Document](docs/prd.md) - وثيقة متطلبات المنتج
- [API Documentation](docs/api.md) - توثيق الـ API
- [Database Schema](docs/database.md) - مخطط قاعدة البيانات
- [Deployment Guide](docs/deployment.md) - دليل النشر

## 🐛 الإبلاغ عن مشاكل

إذا وجدت مشكلة، يرجى [فتح Issue](https://github.com/yourusername/repo/issues) مع:
- وصف المشكلة
- خطوات إعادة إنتاج المشكلة
- لقطات شاشة (إن أمكن)
- معلومات البيئة

## 🤝 المساهمة

نرحب بجميع المساهمات! يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) أولاً.

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE)

## 👥 الفريق

- **المطور الرئيسي** - [@yourusername](https://github.com/yourusername)

## 🙏 شكر وتقدير

- Supabase - قاعدة البيانات والمصادقة
- Netlify - الاستضافة
- المجتمع العربي للمطورين

## 📞 التواصل

- البريد الإلكتروني: support@arabresearch.com
- تويتر: [@arabresearch](https://twitter.com/arabresearch)
- الموقع: [www.arabresearch.com](https://www.arabresearch.com)

---

صُنع بـ ❤️ للباحثين العرب
