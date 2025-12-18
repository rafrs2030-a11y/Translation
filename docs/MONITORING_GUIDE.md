# 🔍 دليل المراقبة والأمان
## Monitoring and Security Guide

---

## 📋 محتويات الدليل

1. [لوحة المراقبة](#لوحة-المراقبة)
2. [Logs في Supabase](#logs-في-supabase)
3. [Logs في Netlify](#logs-في-netlify)
4. [Rate Limiting](#rate-limiting)
5. [RLS (Row Level Security)](#rls-row-level-security)
6. [فحص الثغرات الأمنية](#فحص-الثغرات-الأمنية)

---

## 🖥️ لوحة المراقبة

### الوصول إلى لوحة المراقبة

- **المسار**: `/admin/monitoring`
- **المتطلبات**: حساب مسؤول (`admin` أو `super_admin`)

### الميزات المتاحة

1. **إحصائيات النظام**
   - إجمالي المستخدمين
   - إجمالي الطلبات
   - الطلبات قيد المراجعة
   - عدد الأخطاء الحديثة (آخر 24 ساعة)

2. **فحوصات الأمان**
   - التحقق من تفعيل RLS
   - التحقق من Rate Limiting
   - التحقق من المتغيرات البيئية
   - التحقق من Storage Policies

3. **الأخطاء الحديثة**
   - عرض آخر 10 أخطاء من `email_log`
   - تفاصيل كل خطأ (النوع، الرسالة، التاريخ)

---

## 📊 Logs في Supabase

### الوصول إلى Logs

#### الطريقة 1: عبر Supabase Dashboard

1. افتح [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى **Logs** في القائمة الجانبية
4. اختر نوع الخدمة:
   - **API**: طلبات REST API
   - **Postgres**: استعلامات قاعدة البيانات
   - **Edge Functions**: تنفيذ Edge Functions
   - **Auth**: أحداث المصادقة
   - **Storage**: عمليات التخزين
   - **Realtime**: اتصالات Realtime

#### الطريقة 2: عبر MCP Tools

```typescript
// استخدام MCP tool get_logs
const logs = await supabase.getLogs({ service: 'api' });
```

### أنواع Logs

#### 1. API Logs
- جميع طلبات REST API إلى Supabase
- مفيد لتتبع الاستعلامات والأخطاء
- **Rate Limit**: 1000 طلب/دقيقة (افتراضي)

#### 2. Postgres Logs
- استعلامات SQL
- أخطاء قاعدة البيانات
- أداء الاستعلامات

#### 3. Edge Functions Logs
- تنفيذ Edge Functions
- أخطاء في الكود
- وقت التنفيذ

#### 4. Auth Logs
- محاولات تسجيل الدخول
- تسجيلات خروج
- تغييرات كلمات المرور
- محاولات فاشلة (مفيد للأمان)

#### 5. Storage Logs
- رفع/تحميل الملفات
- أخطاء الوصول
- استهلاك المساحة

---

## 🌐 Logs في Netlify

### الوصول إلى Logs

1. افتح [Netlify Dashboard](https://app.netlify.com)
2. اختر موقعك
3. اذهب إلى **Site overview** > **Functions**
4. انقر على **View logs** للوظيفة المطلوبة

### أنواع Logs

- **Function Logs**: مخرجات `console.log()` من Edge Functions
- **Build Logs**: سجلات عملية البناء
- **Deploy Logs**: سجلات النشر

### مراقبة الأخطاء

- **Function Errors**: أخطاء تنفيذ الوظائف
- **Build Errors**: أخطاء عملية البناء
- **Deploy Errors**: أخطاء النشر

---

## 🚦 Rate Limiting

### Rate Limiting في التطبيق

تم إعداد Rate Limiting في `server/middleware/rateLimiter.js`:

```javascript
// General rate limiter: 100 requests per 15 minutes
const generalLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
});

// Auth rate limiter: 5 requests per 15 minutes (للمصادقة)
const authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

// Upload rate limiter: 10 uploads per hour
const uploadLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10,
});
```

### Rate Limiting في Supabase

#### API Rate Limits (افتراضي)
- **Anonymous**: 500 requests/minute
- **Authenticated**: 1000 requests/minute
- **Service Role**: Unlimited

#### Postgres Rate Limits
- **Max connections**: يختلف حسب الخطة
- **Query timeout**: 60 seconds (افتراضي)

#### Edge Functions Rate Limits
- **Invocations**: يختلف حسب الخطة
- **Execution time**: 60 seconds (افتراضي)

### إعداد Rate Limiting مخصص

يمكنك ضبط Rate Limits من Supabase Dashboard:

1. اذهب إلى **Settings** > **API**
2. اضبط **Rate Limits** حسب احتياجك
3. احفظ التغييرات

---

## 🔒 RLS (Row Level Security)

### ما هو RLS؟

Row Level Security (RLS) هي ميزة في PostgreSQL تسمح بمنع الوصول إلى الصفوف بناءً على سياسات محددة.

### التحقق من RLS

#### عبر SQL

```sql
-- التحقق من تفعيل RLS على جدول
SELECT relname, relrowsecurity
FROM pg_class
WHERE relnamespace = 'public'::regnamespace
  AND relkind = 'r';
```

#### عبر Function

```sql
-- استخدام function مخصصة
SELECT * FROM check_rls_enabled();
```

### الجداول التي يجب تفعيل RLS عليها

- ✅ `users`
- ✅ `submissions`
- ✅ `admin_comments`
- ✅ `notifications`
- ✅ `notification_preferences`
- ✅ `status_history`
- ✅ `audit_log`
- ✅ `conversations` / `chat_conversations`
- ✅ `messages` / `chat_messages`
- ✅ `platform_settings`

### Policies المهمة

#### Users Table
```sql
-- Users can only view/update their own data
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

#### Submissions Table
```sql
-- Users can view their own submissions, admins can view all
CREATE POLICY "Users can view their own submissions"
  ON submissions FOR SELECT
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );
```

---

## 🔐 فحص الثغرات الأمنية

### قائمة فحص الأمان

#### 1. SQL Injection

✅ **محمي**: استخدام Supabase Client يمنع SQL Injection تلقائيًا

```typescript
// ✅ آمن
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId);

// ❌ خطير (لا تستخدم أبدًا)
const query = `SELECT * FROM users WHERE id = '${userId}'`;
```

#### 2. XSS (Cross-Site Scripting)

✅ **محمي**: React يقوم بـ escape تلقائي

⚠️ **تحذير**: عند استخدام `dangerouslySetInnerHTML`، تأكد من sanitization

#### 3. CSRF (Cross-Site Request Forgery)

✅ **محمي**: Supabase يستخدم JWT tokens للتحقق من الطلبات

#### 4. Authentication Bypass

✅ **محمي**: 
- RLS policies تمنع الوصول غير المصرح
- Authentication required للعمليات الحساسة

#### 5. Environment Variables

✅ **محمي**: 
- Service Role Key موجود في `.env` فقط (غير مكشوف)
- لا يتم إرسال Service Role Key إلى Frontend

⚠️ **تحذير**: تأكد من عدم commit ملف `.env` إلى Git

#### 6. Rate Limiting

✅ **مفعّل**: Rate limiting على جميع المسارات الحساسة

#### 7. Storage Security

✅ **محمي**: 
- Storage policies تمنع الوصول غير المصرح
- المستخدمون يمكنهم الوصول فقط لملفاتهم

---

## 📝 Checklist للمراقبة اليومية

### يوميًا
- [ ] فحص الأخطاء في `/admin/monitoring`
- [ ] مراجعة Supabase Logs للأخطاء الحرجة
- [ ] فحص Rate Limiting (هل هناك طلبات محظورة؟)

### أسبوعيًا
- [ ] مراجعة فحوصات الأمان
- [ ] فحص RLS policies
- [ ] مراجعة Storage usage
- [ ] فحص Edge Functions logs

### شهريًا
- [ ] مراجعة شاملة للأمان
- [ ] تحديث dependencies
- [ ] مراجعة وفحص الثغرات
- [ ] Backup قاعدة البيانات

---

## 🆘 حل المشاكل الشائعة

### المشكلة: أخطاء كثيرة في email_log

**الحل**:
1. فحص إعدادات البريد الإلكتروني في Supabase
2. التحقق من API keys
3. مراجعة `email_log` table للتفاصيل

### المشكلة: Rate Limit exceeded

**الحل**:
1. فحص عدد الطلبات في Logs
2. زيادة Rate Limits إذا لزم الأمر
3. تحسين الكود لتقليل الطلبات

### المشكلة: RLS policies لا تعمل

**الحل**:
1. التحقق من تفعيل RLS: `SELECT relrowsecurity FROM pg_class WHERE relname = 'table_name';`
2. مراجعة Policies: `SELECT * FROM pg_policies WHERE tablename = 'table_name';`
3. اختبار Policies مع مستخدمين مختلفين

---

## 🔗 روابط مفيدة

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Netlify Dashboard](https://app.netlify.com)
- [Supabase Logs Documentation](https://supabase.com/docs/guides/platform/logs)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

**آخر تحديث**: 2025-12-17
