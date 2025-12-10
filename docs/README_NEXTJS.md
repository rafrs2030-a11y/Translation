# منصة نشر الأبحاث العربية - Next.js Version

## 🎉 تم تحويل المشروع إلى Next.js و React!

تم تحويل المشروع من Vanilla JavaScript/HTML إلى **Next.js 14** مع **React 18** مع الحفاظ على نفس **UI/UX** بالكامل.

## ✅ ما تم إنجازه

### 1. البنية الأساسية
- ✅ إعداد Next.js 14 مع App Router
- ✅ TypeScript configuration
- ✅ RTL Support (دعم اللغة العربية)
- ✅ Cairo Font integration
- ✅ جميع ملفات CSS محفوظة (main.css, landing.css, dashboard.css, chat.css)

### 2. Supabase Integration
- ✅ Supabase SSR client للعميل
- ✅ Supabase SSR client للخادم
- ✅ Middleware للمصادقة
- ✅ Auth state management

### 3. React Context
- ✅ AuthContext (محول من authStore.js)
- ✅ دعم كامل لـ login, register, logout
- ✅ Session management

### 4. الصفحات
- ✅ الصفحة الرئيسية (Landing Page)
- ✅ صفحة تسجيل الدخول

## 🚀 البدء السريع

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد متغيرات البيئة
أنشئ ملف `.env.local` في جذر المشروع:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. تشغيل المشروع
```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## 📁 بنية المشروع

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout الرئيسي
│   ├── page.tsx           # الصفحة الرئيسية
│   ├── login/             # صفحات تسجيل الدخول
│   ├── globals.css        # CSS العام
│   └── ...
├── lib/                   # Utilities
│   └── supabase/         # Supabase clients
├── contexts/              # React Contexts
│   └── AuthContext.tsx   # Context للمصادقة
├── components/            # React Components
├── public/                # الملفات الثابتة
│   ├── css/              # ملفات CSS الأصلية
│   ├── js/               # ملفات JS الأصلية (للرجوع)
│   └── images/           # الصور
└── ...
```

## 📋 ما يحتاج إلى إكمال

راجع ملف `MIGRATION_TO_NEXTJS.md` للحصول على قائمة كاملة بالصفحات والمكونات التي تحتاج إلى التحويل.

## 🔄 الاختلافات الرئيسية

### Routing
- **قبل**: `/pages/login.html`
- **بعد**: `/app/login/page.tsx`

### State Management
- **قبل**: Custom Stores (authStore.js, notificationsStore.js)
- **بعد**: React Context API

### Supabase
- **قبل**: Browser client فقط
- **بعد**: SSR client مع دعم Server Components

## 🎨 التصميم

- ✅ نفس الألوان (--primary-color: #3D5A94)
- ✅ نفس الخطوط (Cairo)
- ✅ نفس التخطيطات والـ Components
- ✅ RTL Support كامل

## 📚 الوثائق

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [React Context API](https://react.dev/reference/react/useContext)

## 🐛 استكشاف الأخطاء

### خطأ: Cannot find module '@supabase/ssr'
```bash
npm install @supabase/ssr
```

### خطأ: Environment variables not found
تأكد من إنشاء ملف `.env.local` وإضافة المتغيرات المطلوبة.

### خطأ: TypeScript errors
```bash
npm install --save-dev @types/react @types/react-dom @types/node
```

## 📝 ملاحظات

- ملفات JavaScript الأصلية موجودة في `public/js/` للرجوع إليها
- ملفات CSS الأصلية موجودة في `public/css/` وتم نسخها إلى `app/`
- يمكن استخدام نفس قاعدة البيانات Supabase بدون تغيير

## 🤝 المساهمة

عند إضافة صفحات جديدة:
1. أنشئ ملف `page.tsx` في مجلد `app/`
2. استخدم `useAuth()` من `AuthContext` للمصادقة
3. استخدم نفس فئات CSS الموجودة
4. اتبع نفس نمط التصميم

---

**تم التطوير بواسطة الحاضنة الرقمية باكورة التقنيات**

