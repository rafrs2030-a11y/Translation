# خطوات إضافة Secrets لإرسال البريد الإلكتروني

## 📋 الخطوات التفصيلية

### الخطوة 1: الوصول إلى صفحة Secrets

1. اذهب إلى: https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj
2. من القائمة الجانبية، اختر **Settings** (الإعدادات)
3. اختر **Edge Functions** من القائمة
4. أو مباشرة: https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/settings/functions
5. انقر على تبويب **Secrets**

### الخطوة 2: إضافة Secrets

في قسم **"ADD OR REPLACE SECRETS"**:

#### Secret 1: Resend API Key
- **Name:** `RESEND_API_KEY`
- **Value:** `re_dPdS8aE8_D9mmuGbffoiW1RRjdmJoiDUF` (مفتاحك من Resend)

#### Secret 2: Email Provider
- **Name:** `EMAIL_PROVIDER`
- **Value:** `resend`

#### Secret 3: From Email
- **Name:** `FROM_EMAIL`
- **Value:** `onboarding@resend.dev` (للاختبار)
  - أو بريدك المُتحقق في Resend (للإنتاج)

#### Secret 4: From Name
- **Name:** `FROM_NAME`
- **Value:** `منصة نشر الأبحاث العربية`

### الخطوة 3: الحفظ

1. بعد إدخال جميع القيم
2. انقر على زر **"Save"** الأخضر في أسفل القسم
3. انتظر حتى تظهر رسالة النجاح

### الخطوة 4: التحقق

بعد الحفظ، يجب أن تظهر Secrets الجديدة في القائمة أدناه:
- `RESEND_API_KEY` (مع SHA256 hash)
- `EMAIL_PROVIDER`
- `FROM_EMAIL`
- `FROM_NAME`

## 🔑 الحصول على Resend API Key

### إذا لم يكن لديك حساب Resend:

1. **سجل حساب جديد:**
   - اذهب إلى: https://resend.com/signup
   - سجل بحسابك (Gmail، GitHub، إلخ)
   - مجاني حتى 3000 بريد/شهر

2. **أنشئ API Key:**
   - بعد تسجيل الدخول، اذهب إلى **API Keys** من القائمة
   - انقر **Create API Key**
   - أدخل اسمًا (مثل: "Supabase Email")
   - اختر الصلاحيات: **Sending access**
   - انقر **Add**
   - **انسخ المفتاح فوراً** (يبدأ بـ `re_`)
   - ⚠️ **تحذير:** لن تتمكن من رؤية المفتاح مرة أخرى!

3. **استخدم المفتاح:**
   - الصق المفتاح في حقل `RESEND_API_KEY` في Supabase

### للبريد الإنتاجي:

للإنتاج، يجب:
1. **إضافة Domain:**
   - في Resend Dashboard، اذهب إلى **Domains**
   - أضف نطاقك (مثل: `arabresearch.com`)
   - أضف DNS records كما هو موضح

2. **استخدام البريد المُتحقق:**
   - بدلاً من `onboarding@resend.dev`
   - استخدم: `noreply@yourdomain.com`

## ✅ بعد الإضافة

بعد إضافة Secrets بنجاح:

1. **البريد في قائمة الانتظار سيُرسل تلقائياً:**
   - Edge Function ستعيد المحاولة
   - البريد الذي كان `queued` سيصبح `sent`

2. **التحقق من السجلات:**
   ```sql
   SELECT * FROM email_log 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

3. **اختبار الإرسال:**
   - سجل دخول كمسؤول
   - غيّر حالة أحد الطلبات
   - تحقق من وصول البريد!

## 🔍 استكشاف الأخطاء

### المشكلة: لا يمكن حفظ Secrets
- تأكد من أنك مسؤول المشروع
- تحقق من اتصال الإنترنت
- جرب تحديث الصفحة

### المشكلة: البريد لا يزال في قائمة الانتظار
- تحقق من صحة `RESEND_API_KEY`
- تحقق من Logs في Supabase Dashboard
- تأكد من أن `EMAIL_PROVIDER=resend`

### المشكلة: خطأ في الإرسال
- تحقق من `email_log` للرسائل الخطأ
- تأكد من أن البريد المُستخدم مُتحقق في Resend
- للاختبار، استخدم `onboarding@resend.dev`

## 📝 ملاحظات مهمة

1. **الأمان:**
   - لا تشارك API Keys مع أحد
   - لا ترفعها في Git
   - استخدم Secrets فقط في Supabase Dashboard

2. **الحدود:**
   - Resend مجاني: 3000 بريد/شهر
   - للاستخدام الكبير، قد تحتاج خطة مدفوعة

3. **البدائل:**
   - يمكن استخدام SendGrid بدلاً من Resend
   - أضف `SENDGRID_API_KEY` و `EMAIL_PROVIDER=sendgrid`

---

**آخر تحديث:** 2025-01-27

