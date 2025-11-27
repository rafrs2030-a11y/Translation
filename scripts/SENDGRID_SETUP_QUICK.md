# 🚀 إعداد SendGrid السريع

## ✅ لماذا SendGrid؟

- ✅ **مجاني** - حتى 100 إيميل/يوم
- ✅ **لا يحتاج domain verification** - للخطة المجانية
- ✅ **موثوق** - يستخدمه ملايين المطورين
- ✅ **سهل الإعداد** - 5 دقائق فقط

---

## 📝 الخطوات:

### 1. سجل في SendGrid

1. اذهب إلى: https://signup.sendgrid.com
2. سجل حساب مجاني
3. أكمل التحقق من الإيميل

### 2. احصل على API Key

1. بعد تسجيل الدخول، اذهب إلى:
   - **Settings** > **API Keys**
2. انقر **Create API Key**
3. اختر:
   - **Name:** `Supabase Email`
   - **Permissions:** **Full Access** (أو **Restricted Access** > **Mail Send**)
4. انقر **Create & View**
5. **انسخ API Key** (يبدأ بـ `SG.` - **مهم جداً!** لن تتمكن من رؤيته مرة أخرى)

### 3. أضف Secrets في Supabase

1. اذهب إلى Supabase Dashboard:
   - https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/functions/send-notification-email

2. انقر **Secrets** (في القائمة الجانبية)

3. أضف Secrets التالية:

   ```
   EMAIL_PROVIDER = sendgrid
   SENDGRID_API_KEY = SG.xxxxxxxxxxxxx (API Key الذي نسخته)
   FROM_EMAIL = rafrs2030@gmail.com (أو أي إيميل)
   FROM_NAME = منصة نشر الأبحاث العربية
   ```

4. انقر **Save** لكل secret

### 4. اختبر الإرسال

1. اذهب إلى:
   - https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/functions/send-welcome-emails

2. انقر **Invoke Function**

3. اختر **POST**

4. انقر **Invoke**

5. تحقق من وصول الإيميل! ✅

---

## ⚠️ ملاحظات:

1. **API Key:** احفظه في مكان آمن - لن تتمكن من رؤيته مرة أخرى
2. **FROM_EMAIL:** يمكنك استخدام أي إيميل (حتى Gmail) للخطة المجانية
3. **Rate Limit:** 100 إيميل/يوم في الخطة المجانية

---

## 🔗 روابط مفيدة:

- **SendGrid Dashboard:** https://app.sendgrid.com
- **SendGrid Docs:** https://docs.sendgrid.com
- **Supabase Dashboard:** https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj

---

## ✅ جاهز!

بعد إضافة Secrets، استدعِ `send-welcome-emails` مرة أخرى وستصل الإيميلات! 🎉

