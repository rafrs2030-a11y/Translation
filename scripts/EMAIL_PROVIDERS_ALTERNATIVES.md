# 📧 بدائل Resend لإرسال الإيميلات

## ✅ الخيارات المتاحة:

### 1. SendGrid (موصى به - مجاني حتى 100 إيميل/يوم)

**المزايا:**
- ✅ مجاني حتى 100 إيميل/يوم
- ✅ لا يحتاج domain verification للخطة المجانية
- ✅ موثوق وسريع
- ✅ API بسيط

**الإعداد:**

1. **سجل في SendGrid:**
   - اذهب إلى https://sendgrid.com
   - سجل حساب مجاني

2. **احصل على API Key:**
   - Settings > API Keys
   - Create API Key
   - اختر "Full Access" أو "Mail Send"
   - انسخ API Key (يبدأ بـ `SG.`)

3. **أضف Secrets في Supabase:**
   - اذهب إلى: Edge Functions > send-notification-email > Secrets
   - أضف:
     ```
     EMAIL_PROVIDER = sendgrid
     SENDGRID_API_KEY = SG.xxxxxxxxxxxxx
     FROM_EMAIL = noreply@arabresearch.com
     FROM_NAME = منصة نشر الأبحاث العربية
     ```

---

### 2. Mailgun (مجاني حتى 5,000 إيميل/شهر)

**المزايا:**
- ✅ مجاني حتى 5,000 إيميل/شهر
- ✅ موثوق جداً
- ✅ API قوي

**الإعداد:**

1. **سجل في Mailgun:**
   - https://www.mailgun.com
   - سجل حساب مجاني

2. **احصل على API Key:**
   - Sending > API Keys
   - انسخ Private API Key

3. **أضف Secrets:**
   ```
   EMAIL_PROVIDER = smtp
   SMTP_HOST = smtp.mailgun.org
   SMTP_PORT = 587
   SMTP_USER = postmaster@your-domain.mailgun.org
   SMTP_PASSWORD = your_private_api_key
   FROM_EMAIL = noreply@your-domain.com
   FROM_NAME = منصة نشر الأبحاث العربية
   ```

---

### 3. Postmark (مجاني حتى 100 إيميل/شهر)

**المزايا:**
- ✅ موثوق جداً
- ✅ مناسب للإيميلات المعاملاتية
- ✅ مجاني للبدء

**الإعداد:**

1. **سجل في Postmark:**
   - https://postmarkapp.com
   - سجل حساب مجاني

2. **احصل على Server API Token:**
   - Servers > Your Server > API Tokens
   - انسخ Server API Token

3. **أضف Secrets:**
   ```
   EMAIL_PROVIDER = smtp
   SMTP_HOST = smtp.postmarkapp.com
   SMTP_PORT = 587
   SMTP_USER = your_server_api_token
   SMTP_PASSWORD = your_server_api_token
   FROM_EMAIL = noreply@your-domain.com
   FROM_NAME = منصة نشر الأبحاث العربية
   ```

---

### 4. Amazon SES (أرخص - $0.10 لكل 1,000 إيميل)

**المزايا:**
- ✅ أرخص خيار
- ✅ موثوق جداً
- ✅ مناسب للإنتاج

**الإعداد:**

1. **سجل في AWS:**
   - https://aws.amazon.com/ses
   - أنشئ حساب AWS

2. **احصل على SMTP Credentials:**
   - SES > SMTP Settings
   - Create SMTP Credentials
   - انسخ SMTP Username و Password

3. **أضف Secrets:**
   ```
   EMAIL_PROVIDER = smtp
   SMTP_HOST = email-smtp.us-east-1.amazonaws.com (أو منطقتك)
   SMTP_PORT = 587
   SMTP_USER = your_smtp_username
   SMTP_PASSWORD = your_smtp_password
   FROM_EMAIL = noreply@your-domain.com
   FROM_NAME = منصة نشر الأبحاث العربية
   ```

---

### 5. Gmail SMTP (للتطوير فقط)

**المزايا:**
- ✅ مجاني
- ✅ سهل الإعداد
- ⚠️ محدود (500 إيميل/يوم)

**الإعداد:**

1. **فعّل 2FA في Gmail**

2. **أنشئ App Password:**
   - Google Account > Security > 2-Step Verification
   - App Passwords > Generate
   - انسخ App Password

3. **أضف Secrets:**
   ```
   EMAIL_PROVIDER = smtp
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_USER = your-email@gmail.com
   SMTP_PASSWORD = your_app_password
   FROM_EMAIL = your-email@gmail.com
   FROM_NAME = منصة نشر الأبحاث العربية
   ```

---

## 🎯 التوصية:

### للتطوير:
- **Gmail SMTP** - سريع وسهل

### للإنتاج (صغير):
- **SendGrid** - مجاني حتى 100 إيميل/يوم

### للإنتاج (متوسط):
- **Mailgun** - مجاني حتى 5,000 إيميل/شهر

### للإنتاج (كبير):
- **Amazon SES** - أرخص خيار

---

## 📝 ملاحظات:

1. **Domain Verification:**
   - SendGrid: غير مطلوب للخطة المجانية
   - Mailgun: مطلوب
   - Postmark: مطلوب
   - Amazon SES: مطلوب

2. **Rate Limits:**
   - SendGrid: 100 إيميل/يوم (مجاني)
   - Mailgun: 5,000 إيميل/شهر (مجاني)
   - Postmark: 100 إيميل/شهر (مجاني)
   - Amazon SES: حسب الاستخدام

---

## 🚀 بعد الإعداد:

1. أضف Secrets في Supabase
2. استدعِ `send-welcome-emails` مرة أخرى
3. تحقق من وصول الإيميلات

