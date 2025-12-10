# ⚠️ إعداد متغيرات البيئة مطلوب

## المشكلة

إذا رأيت الخطأ التالي في المتصفح:

```
Error: Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL in your .env.local file.
```

هذا يعني أن متغيرات البيئة غير محددة في Netlify.

---

## ✅ الحل السريع

### 1. في Netlify Dashboard:

1. اذهب إلى **Site configuration** > **Environment variables**
2. اضغط **Add a variable**
3. أضف المتغيرات التالية (كل متغير على حدة):

**المتغير الأول:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://rzenhmmwocctvonwhnrj.supabase.co`

**المتغير الثاني:**
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZW5obW13b2NjdHZvbndobnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTAwODYsImV4cCI6MjA3ODc2NjA4Nn0.wGQZ4osd-MrQudrt6lBhHaumbFjYT26-hoNR4TnjEQM`

**أو يمكنك نسخ هذه القيم مباشرة:**
```
NEXT_PUBLIC_SUPABASE_URL=https://rzenhmmwocctvonwhnrj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZW5obW13b2NjdHZvbndobnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTAwODYsImV4cCI6MjA3ODc2NjA4Nn0.wGQZ4osd-MrQudrt6lBhHaumbFjYT26-hoNR4TnjEQM
```

### 2. كيفية الحصول على القيم:

**من Supabase Dashboard:**
1. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
2. اختر مشروعك
3. اذهب إلى **Settings** > **API**
4. انسخ:
   - **Project URL** → هذا هو `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** key → هذا هو `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. إعادة البناء:

بعد إضافة المتغيرات:
1. اذهب إلى **Deploys** في Netlify
2. اضغط **Trigger deploy** > **Deploy site**
3. أو قم بدفع commit جديد إلى Git

---

## 📝 ملاحظات مهمة

### ✅ يجب استخدام `NEXT_PUBLIC_` prefix

في Next.js، المتغيرات التي تحتاجها المتصفح يجب أن تبدأ بـ `NEXT_PUBLIC_`:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ `SUPABASE_URL` (لن يعمل في المتصفح)

### 🔒 الأمان

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` آمن للاستخدام في المتصفح
- **لا تستخدم** `SUPABASE_SERVICE_ROLE_KEY` في المتصفح - إنه سري جداً!

---

## 🧪 التحقق من الإعداد

بعد إعادة البناء، افتح المتصفح وافتح Developer Console (F12):

- إذا رأيت تحذير: `⚠️ Missing Supabase URL` → المتغيرات غير محددة
- إذا لم تر تحذير → المتغيرات محددة بشكل صحيح ✅

---

## 📚 مراجع إضافية

- راجع [NETLIFY_ENV_SETUP.md](./NETLIFY_ENV_SETUP.md) للتفاصيل الكاملة
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

