# دليل التحويل إلى Next.js و React

## ✅ ما تم إنجازه

### 1. إعدادات Next.js الأساسية
- ✅ `next.config.js` - إعدادات Next.js مع دعم RTL
- ✅ `tsconfig.json` - إعدادات TypeScript
- ✅ `package.json` - تحديث التبعيات (Next.js, React, @supabase/ssr)
- ✅ `.gitignore` - تحديث ليشمل ملفات Next.js

### 2. بنية المشروع
- ✅ `app/` - مجلد App Router
- ✅ `app/layout.tsx` - Layout الرئيسي مع دعم RTL والخطوط العربية
- ✅ `app/page.tsx` - الصفحة الرئيسية (Landing Page)
- ✅ `app/globals.css` - استيراد جميع ملفات CSS

### 3. Supabase Integration
- ✅ `lib/supabase/client.ts` - Supabase client للعميل
- ✅ `lib/supabase/server.ts` - Supabase client للخادم
- ✅ `lib/supabase/middleware.ts` - Supabase middleware
- ✅ `middleware.ts` - Next.js middleware للمصادقة

### 4. React Context
- ✅ `contexts/AuthContext.tsx` - Context للمصادقة (محول من authStore.js)

## 📋 ما يحتاج إلى إكمال

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد متغيرات البيئة
أنشئ ملف `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. تحويل الصفحات المتبقية

#### صفحات المصادقة:
- [x] `app/login/page.tsx` - صفحة تسجيل الدخول ✅
- [x] `app/register/page.tsx` - صفحة التسجيل ✅
- [x] `app/verify-email/page.tsx` - صفحة التحقق من البريد ✅
- [x] `app/forgot-password/page.tsx` - صفحة نسيان كلمة المرور ✅
- [x] `app/reset-password/page.tsx` - صفحة إعادة تعيين كلمة المرور ✅

#### صفحات الباحث:
- [ ] `app/researcher/dashboard/page.tsx` - لوحة تحكم الباحث
- [ ] `app/researcher/submit/page.tsx` - تقديم بحث
- [ ] `app/researcher/submissions/page.tsx` - قائمة الطلبات
- [ ] `app/researcher/submissions/[id]/page.tsx` - تفاصيل الطلب
- [ ] `app/researcher/profile/page.tsx` - الملف الشخصي
- [ ] `app/researcher/settings/page.tsx` - الإعدادات
- [ ] `app/researcher/notifications/page.tsx` - الإشعارات

#### صفحات المدير:
- [ ] `app/admin/dashboard/page.tsx` - لوحة تحكم المدير
- [ ] `app/admin/submissions/page.tsx` - إدارة الطلبات
- [ ] `app/admin/submissions/[id]/page.tsx` - تفاصيل الطلب
- [ ] `app/admin/users/page.tsx` - إدارة المستخدمين
- [ ] `app/admin/statistics/page.tsx` - الإحصائيات
- [ ] `app/admin/reports/page.tsx` - التقارير
- [ ] `app/admin/settings/page.tsx` - إعدادات المدير
- [ ] `app/admin/notifications/page.tsx` - إشعارات المدير
- [ ] `app/admin/verification-requests/page.tsx` - طلبات التحقق

#### صفحات أخرى:
- [ ] `app/terms/page.tsx` - الشروط والأحكام
- [ ] `app/privacy/page.tsx` - سياسة الخصوصية

### 4. تحويل Stores المتبقية إلى React Context
- [x] `contexts/NotificationsContext.tsx` - من notificationsStore.js ✅
- [x] `contexts/SubmissionsContext.tsx` - من submissionsStore.js ✅
- [ ] `contexts/ChatContext.tsx` - من chatStore.js
- [ ] `contexts/AdminContext.tsx` - من adminStore.js

### 5. تحويل Components
- [ ] `components/Navbar.tsx` - شريط التنقل
- [x] `components/Sidebar.tsx` - القائمة الجانبية ✅
- [ ] `components/Footer.tsx` - التذييل
- [ ] `components/FormInput.tsx` - حقول الإدخال
- [ ] `components/Button.tsx` - الأزرار
- [ ] `components/Card.tsx` - البطاقات
- [ ] `components/Alert.tsx` - التنبيهات
- [ ] `components/LoadingSpinner.tsx` - مؤشر التحميل
- [x] `components/Topbar.tsx` - شريط العلوي ✅

### 6. API Routes (اختياري - يمكن استخدام Supabase مباشرة)
- [ ] `app/api/auth/route.ts` - API للمصادقة
- [ ] `app/api/submissions/route.ts` - API للطلبات
- [ ] `app/api/notifications/route.ts` - API للإشعارات

### 7. إصلاح الأخطاء
- [ ] إصلاح أخطاء TypeScript في `lib/supabase/middleware.ts`
- [ ] إصلاح أخطاء TypeScript في `contexts/AuthContext.tsx`
- [ ] إضافة أنواع TypeScript المفقودة

## 🚀 كيفية التشغيل

1. تثبيت التبعيات:
```bash
npm install
```

2. إعداد متغيرات البيئة (أنشئ `.env.local`)

3. تشغيل خادم التطوير:
```bash
npm run dev
```

4. بناء المشروع للإنتاج:
```bash
npm run build
npm start
```

## 📝 ملاحظات مهمة

1. **الحفاظ على نفس UI/UX**: جميع ملفات CSS موجودة في `public/css/` وتم استيرادها في `app/globals.css`

2. **RTL Support**: المشروع يدعم RTL بشكل كامل عبر `dir="rtl"` في HTML

3. **Supabase**: تم استخدام `@supabase/ssr` لدعم Server-Side Rendering في Next.js

4. **Routing**: تم استخدام Next.js App Router بدلاً من HTML pages

5. **State Management**: تم تحويل Stores إلى React Context API

## 🔄 الخطوات التالية

1. تثبيت التبعيات
2. إعداد متغيرات البيئة
3. تحويل صفحة واحدة كتجربة (مثل login)
4. اختبار الصفحة
5. متابعة تحويل باقي الصفحات

## 📚 مراجع

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [React Context API](https://react.dev/reference/react/useContext)

