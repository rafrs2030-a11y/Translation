# إعداد متغيرات البيئة في Netlify

## المتغيرات المطلوبة

يجب إضافة المتغيرات التالية في Netlify Dashboard:

### 1. الدخول إلى إعدادات المشروع
- اذهب إلى Netlify Dashboard
- اختر مشروعك
- اذهب إلى **Site configuration** > **Environment variables**

### 2. إضافة المتغيرات التالية

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. كيفية الحصول على القيم

1. **Supabase URL**: 
   - اذهب إلى Supabase Dashboard
   - اختر مشروعك
   - اذهب إلى **Settings** > **API**
   - انسخ **Project URL**

2. **Supabase Anon Key**:
   - في نفس الصفحة (Settings > API)
   - انسخ **anon/public** key

### 4. إضافة المتغيرات في Netlify

#### عبر Dashboard:
1. اذهب إلى **Site configuration** > **Environment variables**
2. اضغط **Add a variable**
3. أضف كل متغير بشكل منفصل:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
4. كرر للـ anon key

#### عبر Netlify CLI:
```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "your-anon-key"
```

### 5. إعادة البناء

بعد إضافة المتغيرات:
1. اذهب إلى **Deploys**
2. اضغط **Trigger deploy** > **Deploy site**
3. أو قم بدفع commit جديد إلى Git

## ملاحظات مهمة

- تأكد من استخدام `NEXT_PUBLIC_` prefix للمتغيرات التي تحتاجها المتصفح
- المتغيرات مع `NEXT_PUBLIC_` تصبح مرئية في الكود المصدري للمتصفح
- لا تضع معلومات حساسة (مثل service role key) في `NEXT_PUBLIC_` variables

