# 🔑 استرجاع Resend API Key

## 📝 كيفية العثور على API Key في Resend:

### الطريقة 1: إذا كان لديك حساب Resend

1. **سجل الدخول إلى Resend:**
   - اذهب إلى: https://resend.com/login

2. **اذهب إلى API Keys:**
   - في القائمة الجانبية، انقر على **API Keys**
   - أو اذهب مباشرة إلى: https://resend.com/api-keys

3. **عرض API Keys الموجودة:**
   - ستجد قائمة بجميع API Keys التي أنشأتها
   - **ملاحظة:** Resend لا يعرض API Key الكامل مرة أخرى لأسباب أمنية
   - يمكنك رؤية:
     - اسم API Key
     - آخر 4 أحرف من API Key
     - تاريخ الإنشاء
     - آخر استخدام

4. **إذا لم تجد API Key:**
   - يجب إنشاء API Key جديد (انظر الطريقة 2)

---

### الطريقة 2: إنشاء API Key جديد

1. **سجل الدخول إلى Resend:**
   - https://resend.com/login

2. **اذهب إلى API Keys:**
   - https://resend.com/api-keys

3. **انقر "Create API Key":**
   - اختر اسم للـ API Key (مثلاً: `Supabase Email`)
   - اختر الصلاحيات:
     - **Full Access** (لجميع الصلاحيات)
     - أو **Sending Access** (للإرسال فقط - موصى به)

4. **انسخ API Key:**
   - ⚠️ **مهم جداً!** انسخ API Key فوراً
   - يبدأ بـ `re_` (مثلاً: `re_1234567890abcdef...`)
   - لن تتمكن من رؤيته مرة أخرى بعد إغلاق الصفحة!

5. **احفظه في مكان آمن:**
   - أضفه في Supabase Secrets
   - أو احفظه في ملف `.env` محلي (لا ترفعه إلى Git!)

---

### الطريقة 3: إذا نسيت كلمة المرور

1. **استرجع كلمة المرور:**
   - اذهب إلى: https://resend.com/forgot-password
   - أدخل إيميلك
   - اتبع التعليمات في الإيميل

2. **بعد تسجيل الدخول:**
   - اتبع الطريقة 1 أو 2 أعلاه

---

## 🔧 إضافة API Key في Supabase:

بعد الحصول على API Key:

1. **اذهب إلى Supabase Dashboard:**
   - https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj/functions/send-notification-email

2. **انقر "Secrets"**

3. **أضف/حدّث Secrets:**
   ```
   EMAIL_PROVIDER = resend
   RESEND_API_KEY = re_xxxxxxxxxxxxx (API Key الذي نسخته)
   FROM_EMAIL = rafrs2030@gmail.com
   FROM_NAME = منصة نشر الأبحاث العربية
   ```

4. **احفظ التغييرات**

---

## ⚠️ ملاحظات مهمة:

1. **API Key القديم:**
   - إذا أنشأت API Key جديد، يمكنك حذف القديم من Resend Dashboard
   - أو تركه إذا كنت لا تعرف أين يستخدم

2. **الأمان:**
   - لا تشارك API Key مع أي شخص
   - لا ترفع API Key إلى Git أو GitHub
   - استخدم Secrets في Supabase فقط

3. **Domain Verification:**
   - تذكّر: Resend يحتاج domain verification لإرسال إيميلات لجميع المستخدمين
   - بدون domain verification، يمكنك إرسال إيميلات لإيميلك المسجل فقط

---

## 🔗 روابط مفيدة:

- **Resend Dashboard:** https://resend.com/api-keys
- **Resend Docs:** https://resend.com/docs
- **Supabase Dashboard:** https://supabase.com/dashboard/project/rzenhmmwocctvonwhnrj

---

## ✅ بعد الإعداد:

1. اختبر الإرسال من `send-welcome-emails`
2. تحقق من وصول الإيميلات
3. راجع Logs في Supabase إذا لم تصل

