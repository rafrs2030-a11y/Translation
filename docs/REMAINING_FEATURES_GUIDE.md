# 🎯 دليل الميزات المتبقية - Quick Reference Guide

## 🔴 أولوية عالية - يجب إكمالها فوراً

### 1. صفحة إعادة تعيين كلمة المرور (Reset Password Page)

**الملف المطلوب:** `/public/pages/reset-password.html`

**المتطلبات:**
- استقبال token من URL query parameter
- التحقق من صلاحية token
- نموذج لإدخال كلمة المرور الجديدة
- تأكيد كلمة المرور
- رسائل خطأ/نجاح واضحة

**الكود المطلوب:**
```javascript
// في /public/js/auth/reset-password.js
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const type = urlParams.get('type'); // 'recovery'

// التحقق من token
// إرسال كلمة المرور الجديدة
```

**الوقت المقدر:** 2-3 ساعات

---

### 2. إعداد خدمة البريد الإلكتروني (Email Service Setup)

**الخطوات:**

1. **إنشاء حساب Resend:**
   - الذهاب إلى https://resend.com
   - إنشاء حساب جديد
   - الحصول على API Key

2. **إضافة Secrets في Supabase:**
   ```
   Dashboard > Edge Functions > Secrets
   
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_PROVIDER=resend
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=منصة نشر الأبحاث العربية
   ```

3. **نشر Edge Function:**
   ```bash
   supabase functions deploy send-notification-email
   ```

4. **اختبار الإرسال:**
   - تغيير حالة طلب
   - التحقق من جدول `email_log`

**الوقت المقدر:** 1-2 ساعة

---

### 3. صفحة إعدادات المستخدم (User Settings Page)

**الملف المطلوب:** `/public/pages/researcher/settings.html`

**الميزات المطلوبة:**
- إعدادات الإشعارات (نقل من profile.html)
- إعدادات اللغة (عربي/إنجليزي)
- إعدادات المظهر (Light/Dark Mode)
- إعدادات الخصوصية
- حذف الحساب

**الوقت المقدر:** 4-6 ساعات

---

## 🟡 أولوية متوسطة - يجب إكمالها قريباً

### 4. صفحة الإشعارات المخصصة (Notifications Page)

**الملف المطلوب:** `/public/pages/researcher/notifications.html`

**الميزات المطلوبة:**
- عرض جميع الإشعارات
- فلترة حسب النوع
- بحث في الإشعارات
- حذف الإشعارات
- علامة "قراءة الكل"

**الوقت المقدر:** 3-4 ساعات

---

### 5. تحسينات نظام الإعدادات

**التحسينات المطلوبة:**
- Validation للإعدادات قبل الحفظ
- رسائل خطأ واضحة
- تأكيد عند تغيير إعدادات مهمة
- إضافة إعدادات SMTP في الواجهة

**الوقت المقدر:** 2-3 ساعات

---

### 6. التوثيق

**الملفات المطلوبة:**
- `docs/USER_MANUAL.md` - دليل المستخدم
- `docs/DEVELOPER_GUIDE.md` - دليل المطور
- `docs/API_DOCUMENTATION.md` - دليل API
- `docs/FAQ.md` - الأسئلة الشائعة

**الوقت المقدر:** 6-8 ساعات

---

## 🟢 أولوية منخفضة - يمكن تأجيلها

### 7. ميزات إضافية

- Dark Mode
- دعم لغات متعددة
- تحسينات الأداء
- تحسينات الواجهة

---

## 📋 قائمة التحقق السريعة

### قبل الإطلاق النهائي:

#### الإعدادات
- [ ] صفحة إعدادات المستخدم
- [ ] Validation للإعدادات
- [ ] رسائل خطأ واضحة

#### الإشعارات
- [ ] إعداد البريد الإلكتروني
- [ ] صفحة مخصصة للإشعارات
- [ ] فلترة وبحث

#### إعادة تعيين كلمة المرور
- [ ] صفحة reset-password.html
- [ ] معالجة token
- [ ] Rate limiting

#### التوثيق
- [ ] دليل المستخدم
- [ ] دليل المطور
- [ ] FAQ

---

## ⏱️ الجدول الزمني المقترح

### الأسبوع الأول (أولوية عالية)
- **اليوم 1-2:** صفحة reset-password
- **اليوم 3:** إعداد البريد الإلكتروني
- **اليوم 4-5:** صفحة إعدادات المستخدم

### الأسبوع الثاني (أولوية متوسطة)
- **اليوم 6-7:** صفحة الإشعارات
- **اليوم 8:** تحسينات الإعدادات
- **اليوم 9-10:** التوثيق

---

## 🔗 روابط مفيدة

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Resend Documentation](https://resend.com/docs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

**آخر تحديث:** 2025-01-27
