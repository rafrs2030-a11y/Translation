# 📧 دليل شامل: استخدام Supabase Email (Email Beta / Email Edge)

## ✅ تم التحديث!

تم تحديث Edge Function `send-welcome-emails` لاستخدام **Supabase Email** بدلاً من Resend.

---

## 🚀 الإعداد السريع:

### الخطوة 1: تفعيل Supabase Email

1. **اذهب إلى Supabase Dashboard:**
   - https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj

2. **فعّل Supabase Email:**
   - اذهب إلى **Settings** > **Auth** > **Email**
   - أو **Project Settings** > **Email**
   - فعّل **Supabase Email** (Email Beta / Email Edge)

### الخطوة 2: تحديث Secrets

في **Edge Functions** > **send-welcome-emails** > **Secrets**:

**أزل (لم يعد مطلوباً):**
- ❌ `RESEND_API_KEY`

**احتفظ بـ:**
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `FROM_EMAIL` (مثلاً: `noreply@res-assistant.com`)
- ✅ `FROM_NAME`
- ✅ `BATCH_SIZE`
- ✅ `DELAY_BETWEEN_EMAILS`
- ✅ `DELAY_BETWEEN_BATCHES`

### الخطوة 3: أعد نشر Edge Function

✅ **تم النشر تلقائياً** - الإصدار 4 جاهز الآن!

---

## 📝 كيفية عمل Supabase Email:

### الطريقة المستخدمة:

Edge Function يستخدم Supabase Email API:

```typescript
const emailResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    to: "user@example.com",
    from: "noreply@res-assistant.com",
    subject: "مرحباً بك",
    html: "<h1>مرحباً</h1>",
  }),
});
```

---

## ✅ المزايا:

| الميزة | Resend | Supabase Email |
|--------|--------|----------------|
| التكامل | خارجي | متكامل ✅ |
| DNS Records | مطلوب | غير مطلوب ✅ |
| API Keys | مطلوب | غير مطلوب ✅ |
| التكلفة | مجاني محدود | مجاني ضمن Supabase ✅ |
| الإعداد | معقد | بسيط ✅ |
| Rate Limits | 2 req/sec | أعلى ✅ |

---

## 🔧 إذا لم يعمل Supabase Email API:

### البديل 1: استخدام Supabase SMTP

1. اذهب إلى **Settings** > **Auth** > **SMTP Settings**
2. أضف إعدادات SMTP الخاصة بك
3. Edge Function سيعمل تلقائياً مع SMTP

### البديل 2: استخدام Send Email Hook

1. أنشئ Edge Function جديد `send-email`
2. استخدم Send Email Hook من Supabase Auth
3. راجع: https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook

---

## 🚀 الاستخدام:

### استدعاء Edge Function:

**[انقر هنا للذهاب إلى صفحة Edge Function](https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/functions/send-welcome-emails)**

1. انقر **Invoke Function**
2. اختر **POST**
3. انقر **Invoke**

---

## 📊 النتائج المتوقعة:

```json
{
  "ok": true,
  "total": 10,
  "sent": 10,
  "failed": 0,
  "results": [
    { "email": "user@example.com", "status": "sent" }
  ]
}
```

---

## ⚠️ ملاحظات مهمة:

1. **Supabase Email** قد يكون في مرحلة Beta
2. **إذا فشل:** تحقق من أن Supabase Email مفعّل في Dashboard
3. **Fallback:** يمكن استخدام Supabase SMTP كبديل

---

## 🔗 روابط مفيدة:

- **Supabase Dashboard**: https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj
- **Edge Functions**: https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/functions
- **Email Settings**: https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/settings/auth

---

## ✨ الخلاصة:

- ✅ **تم تحديث Edge Function** - يستخدم Supabase Email الآن
- ✅ **تم النشر** - الإصدار 4 جاهز
- ✅ **لا حاجة لـ Resend** - متكامل مع Supabase
- ✅ **سهل الإعداد** - بدون DNS records معقدة

**جاهز للاستخدام!** 🎉

