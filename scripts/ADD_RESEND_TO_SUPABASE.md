# ✅ إضافة Resend API Key إلى Supabase

## 🔑 API Key الخاص بك:
```
re_Gv6T9vB9_9PPBTx7biCDDLtVwJoM4Ncyj
```

---

## 📝 الخطوات:

### 1. اذهب إلى Supabase Dashboard

**رابط مباشر:**
- https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/functions/send-notification-email

### 2. انقر على "Secrets"

- في القائمة الجانبية، انقر على **Secrets**

### 3. أضف/حدّث Secrets التالية:

#### Secret 1: EMAIL_PROVIDER
- **Name:** `EMAIL_PROVIDER`
- **Value:** `resend`
- انقر **Add Secret** أو **Update**

#### Secret 2: RESEND_API_KEY
- **Name:** `RESEND_API_KEY`
- **Value:** `re_Gv6T9vB9_9PPBTx7biCDDLtVwJoM4Ncyj`
- انقر **Add Secret** أو **Update**

#### Secret 3: FROM_EMAIL
- **Name:** `FROM_EMAIL`
- **Value:** `rafrs2030@gmail.com` (أو أي إيميل تريده)
- انقر **Add Secret** أو **Update**

#### Secret 4: FROM_NAME
- **Name:** `FROM_NAME`
- **Value:** `منصة نشر الأبحاث العربية`
- انقر **Add Secret** أو **Update**

---

## ✅ بعد الإضافة:

### 1. اختبر الإرسال

1. اذهب إلى:
   - https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/functions/send-welcome-emails

2. انقر **Invoke Function**

3. اختر **POST**

4. انقر **Invoke**

5. تحقق من وصول الإيميلات! ✅

---

## ⚠️ ملاحظات مهمة:

1. **Domain Verification:**
   - Resend يحتاج domain verification لإرسال إيميلات لجميع المستخدمين
   - بدون domain verification، يمكنك إرسال إيميلات لإيميلك المسجل فقط (`rafrs2030@gmail.com`)

2. **Rate Limits:**
   - الخطة المجانية: 3,000 إيميل/شهر
   - Rate limit: 2 requests/second

3. **الأمان:**
   - ✅ API Key آمن في Supabase Secrets
   - ❌ لا ترفع API Key إلى Git
   - ❌ لا تشارك API Key مع أي شخص

---

## 🔗 روابط مفيدة:

- **Supabase Dashboard:** https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj
- **Resend Dashboard:** https://resend.com/api-keys
- **Resend Docs:** https://resend.com/docs

---

## 🎯 الخطوات التالية:

1. ✅ أضف Secrets في Supabase
2. ✅ استدعِ `send-welcome-emails`
3. ✅ تحقق من وصول الإيميلات
4. (اختياري) أعد إعداد domain verification في Resend لإرسال لجميع المستخدمين

