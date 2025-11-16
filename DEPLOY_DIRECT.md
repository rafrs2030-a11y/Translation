# 🚀 Deploy مباشر بدون GitHub

## خياران متاحان:

---

## **الخيار 1: Netlify CLI** ⚡ (أسهل وأسرع)

### **1. تثبيت Netlify CLI:**
```bash
npm install -g netlify-cli
```

### **2. تسجيل الدخول:**
```bash
netlify login
```
سيفتح المتصفح لتسجيل الدخول

### **3. Deploy المشروع:**
```bash
# Deploy تجريبي (Preview)
netlify deploy

# عند السؤال:
# Build command: (اتركه فارغ - Enter)
# Publish directory: public

# Deploy نهائي (Production)
netlify deploy --prod
```

### **4. ربط Functions (للـ API):**
```bash
netlify functions:create
```

---

## **الخيار 2: Vercel CLI** ⚡

### **1. تثبيت Vercel CLI:**
```bash
npm install -g vercel
```

### **2. Deploy مباشرة:**
```bash
vercel

# عند الأسئلة:
# Set up and deploy? Yes
# Which scope? اختر account
# Link to existing project? No
# Project name? Assistant-for-evaluating-scientific-research
# In which directory? ./
# Override settings? No
```

### **3. Deploy Production:**
```bash
vercel --prod
```

---

## **مقارنة سريعة:**

| الميزة | Netlify | Vercel |
|--------|---------|--------|
| السهولة | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Functions | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| السرعة | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| المجاني | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## **⚠️ ملاحظات مهمة:**

### **قبل الـ Deploy:**

1. **تأكد من Environment Variables:**
   ```bash
   # في Netlify Dashboard:
   Site settings → Environment variables
   
   أضف:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   ```

2. **ملف `netlify.toml` موجود بالفعل** ✅

3. **ملف `.env` للتطوير المحلي فقط** (لن يُرفع)

---

## **هيكل المشروع للـ Deploy:**

```
الملفات التي سيتم deploy:
✅ public/ (Frontend)
✅ netlify/functions/ (Serverless Functions)
✅ netlify.toml (Configuration)

الملفات التي لن تُرفع:
❌ node_modules/
❌ .env
❌ stores/ (خارج public)
❌ server/ (لأننا نستخدم Serverless)
```

---

## **الخطوات التفصيلية (Netlify):**

### **خطوة بخطوة:**

```bash
# 1. تثبيت CLI
npm install -g netlify-cli

# 2. تسجيل دخول
netlify login

# 3. Initialize
netlify init

# عند الأسئلة:
# Create & configure a new site? Yes
# Team: اختر team
# Site name: assistant-research (أو اتركه فارغ لاسم عشوائي)
# Build command: (اضغط Enter)
# Directory to deploy: public

# 4. Deploy Preview
netlify deploy

# 5. إذا كان كل شيء يعمل، Deploy Production:
netlify deploy --prod
```

---

## **بعد الـ Deploy:**

### **ستحصل على:**
```
✅ Live URL: https://your-site.netlify.app
✅ Deploy logs
✅ Build status
```

### **إعداد Environment Variables:**

```bash
# عبر CLI:
netlify env:set SUPABASE_URL "your_url"
netlify env:set SUPABASE_ANON_KEY "your_key"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "your_key"

# أو عبر Dashboard:
# https://app.netlify.com → Site → Environment variables
```

---

## **🐛 حل المشاكل:**

### **مشكلة: Build fails**
```bash
# تحقق من logs:
netlify build

# أو:
netlify deploy --debug
```

### **مشكلة: Functions لا تعمل**
```bash
# تأكد من:
1. ملف netlify.toml صحيح
2. Environment variables مضبوطة
3. Functions في المجلد الصحيح: netlify/functions/
```

### **مشكلة: API لا تعمل**
```bash
# الحل:
1. استخدم Netlify Functions بدلاً من Express
2. أو استخدم Vercel (يدعم Node.js API routes)
```

---

## **🎯 التوصية:**

### **للمشروع الحالي:**
**استخدم Netlify** لأنه:
✅ يدعم Serverless Functions بشكل ممتاز
✅ سهل الإعداد
✅ يتكامل مع Supabase
✅ لديك بالفعل `netlify.toml`

---

## **Alternative: Vercel**

إذا اخترت Vercel:

```bash
# 1. Install
npm install -g vercel

# 2. Deploy
vercel

# 3. Set env vars
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# 4. Deploy production
vercel --prod
```

---

## **📝 Checklist قبل Deploy:**

- [ ] `npm install` تم بنجاح
- [ ] `npm run dev` يعمل محلياً
- [ ] Supabase credentials جاهزة
- [ ] ملف `netlify.toml` موجود
- [ ] Environment variables جاهزة للإضافة

---

## **🎉 بعد النجاح:**

ستحصل على:
```
🌐 Live URL
📊 Analytics
🔄 Auto-deploys عند كل commit
🔐 HTTPS مجاني
🚀 CDN عالمي
```

---

**جاهز للبدء؟** 🚀

