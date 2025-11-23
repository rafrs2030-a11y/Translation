# دليل الإعداد السريع - خدمة البريد الإلكتروني
# Quick Start Guide - Email Service Setup

## ⚡ الإعداد في 5 دقائق

### الخطوة 1: إنشاء حساب Resend (2 دقيقة)

1. اذهب إلى [resend.com/signup](https://resend.com/signup)
2. سجل حساب جديد (مجاني)
3. بعد تسجيل الدخول، اذهب إلى **API Keys**
4. انقر **Create API Key**
5. انسخ الـ API Key (مثال: `re_AbCdEf123456...`)

### الخطوة 2: إضافة Secrets في Supabase (1 دقيقة)

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **Project Settings** > **Edge Functions**
4. في قسم **Secrets**، أضف:

```
RESEND_API_KEY=re_AbCdEf123456... (الصق API Key هنا)
EMAIL_PROVIDER=resend
FROM_EMAIL=onboarding@resend.dev (للاختبار)
FROM_NAME=منصة نشر الأبحاث العربية
```

### الخطوة 3: نشر Edge Function (2 دقيقة)

```bash
# تثبيت Supabase CLI (إذا لم يكن مثبتاً)
npm install -g supabase

# تسجيل الدخول
supabase login

# ربط المشروع (استبدل your-project-ref)
supabase link --project-ref your-project-ref

# نشر الدالة
supabase functions deploy send-notification-email
```

### الخطوة 4: الاختبار ✅

1. سجل دخول كمسؤول
2. غيّر حالة أحد الطلبات
3. تحقق من البريد الإلكتروني!

---

## 🎯 للاستخدام في الإنتاج

### إضافة Domain خاص:

1. في Resend Dashboard، اذهب إلى **Domains**
2. انقر **Add Domain**
3. أدخل Domain الخاص بك
4. أضف DNS Records كما هو موضح
5. انتظر التحقق
6. حدّث `FROM_EMAIL` في Supabase Secrets

---

## 📚 للمزيد من التفاصيل

راجع [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md) للدليل الكامل.

---

## ❓ مشاكل شائعة

### البريد لا يُرسل؟
- تحقق من أن `RESEND_API_KEY` صحيح
- تحقق من Logs في Supabase Dashboard > Edge Functions

### البريد يصل إلى Spam؟
- أضف Domain خاص (لا تستخدم `onboarding@resend.dev` في الإنتاج)
- أضف SPF و DKIM Records

---

**جاهز! 🎉** النظام الآن يرسل البريد الإلكتروني تلقائياً عند تغيير حالة الطلبات.

