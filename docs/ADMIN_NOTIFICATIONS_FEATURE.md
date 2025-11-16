# Admin Notifications Feature Documentation
# توثيق ميزة إشعارات المسؤول

## 📋 نظرة عامة

تم إضافة صفحة الإشعارات لمسؤولي النظام (Admin) لتمكينهم من متابعة جميع الأحداث المهمة في المنصة.

## 📁 الملفات المضافة

### 1. صفحة الإشعارات
- **الموقع:** `public/pages/admin/notifications.html`
- **الوصف:** واجهة عرض الإشعارات للمسؤول
- **المميزات:**
  - عرض جميع الإشعارات في واجهة منظمة
  - فلترة حسب النوع (طلبات جديدة، تغيير الحالة، تعليقات، النظام)
  - فلترة حسب حالة القراءة (مقروء/غير مقروء)
  - تعليم جميع الإشعارات كمقروءة
  - حذف جميع الإشعارات
  - عرض عداد الإشعارات غير المقروءة

### 2. ملف JavaScript للصفحة
- **الموقع:** `public/js/admin/notifications.js`
- **الوصف:** منطق العمل والتفاعل مع صفحة الإشعارات
- **الوظائف الرئيسية:**
  - `loadNotifications()` - تحميل الإشعارات من قاعدة البيانات
  - `renderNotifications()` - عرض الإشعارات في الواجهة
  - `handleFilterChange()` - التعامل مع تغيير الفلاتر
  - `markAsRead()` - تعليم إشعار كمقروء
  - `deleteNotification()` - حذف إشعار
  - `viewSubmission()` - الانتقال إلى تفاصيل الطلب

## 🔗 التكامل مع الصفحات الأخرى

تم تحديث جميع صفحات الأدمن لإضافة رابط الإشعارات في القائمة الجانبية:

1. ✅ `public/pages/admin/dashboard.html`
2. ✅ `public/pages/admin/submissions.html`
3. ✅ `public/pages/admin/users.html`
4. ✅ `public/pages/admin/submission-details.html`

### كود الرابط المضاف:
```html
<a href="/pages/admin/notifications.html" class="nav-item">
    <i class="fas fa-bell"></i>
    <span>الإشعارات</span>
    <span class="badge" id="sidebar-notification-count" style="display: none;">0</span>
</a>
```

## 🎨 التصميم

### الألوان حسب نوع الإشعار:
- **طلب جديد (new_submission)**: أزرق - `rgba(61, 90, 148, 0.1)`
- **تغيير الحالة (status_change)**: برتقالي - `rgba(232, 154, 60, 0.1)`
- **تعليق جديد (comment_added)**: أخضر - `rgba(16, 185, 129, 0.1)`
- **إشعار النظام (system)**: رمادي - `rgba(107, 114, 128, 0.1)`

### أيقونات الإشعارات:
- **new_submission**: `fas fa-file-plus`
- **status_change**: `fas fa-exchange-alt`
- **comment_added**: `fas fa-comment`
- **system**: `fas fa-cog`
- **reminder**: `fas fa-clock`

## 🔔 أنواع الإشعارات

### 1. طلب جديد (New Submission)
يتم إرساله عندما يقوم باحث بتقديم بحث جديد.

**مثال:**
```
العنوان: طلب جديد
الرسالة: تم تقديم طلب جديد برقم مرجعي REF-2024-1234
```

### 2. تغيير الحالة (Status Change)
يتم إرساله عندما يقوم مسؤول بتغيير حالة طلب.

**مثال:**
```
العنوان: تم تغيير حالة الطلب
الرسالة: تم تغيير حالة الطلب REF-2024-1234 إلى "مقبول"
```

### 3. تعليق جديد (Comment Added)
يتم إرساله عندما يتم إضافة تعليق على طلب.

**مثال:**
```
العنوان: تعليق جديد
الرسالة: تم إضافة تعليق جديد على الطلب REF-2024-1234
```

### 4. إشعار النظام (System)
إشعارات من النظام مثل تحديثات، صيانة، إلخ.

**مثال:**
```
العنوان: تحديث النظام
الرسالة: سيتم إجراء صيانة للنظام يوم الجمعة
```

## 📊 الفلاتر المتاحة

1. **الكل (all)**: عرض جميع الإشعارات
2. **غير مقروء (unread)**: عرض الإشعارات غير المقروءة فقط
3. **طلبات جديدة (new_submission)**: إشعارات الطلبات الجديدة
4. **تغيير الحالة (status_change)**: إشعارات تغيير حالة الطلبات
5. **تعليقات (comment_added)**: إشعارات التعليقات الجديدة
6. **النظام (system)**: إشعارات النظام

## 🚀 الوظائف المتاحة

### 1. تعليم الكل كمقروء
زر في أعلى الصفحة يقوم بتعليم جميع الإشعارات كمقروءة دفعة واحدة.

```javascript
async function handleMarkAllAsRead() {
    const result = await notificationsStore.markAllAsRead();
    if (result.success) {
        showSuccess('تم تعليم جميع الإشعارات كمقروءة');
        await loadNotifications();
    }
}
```

### 2. مسح الكل
زر في أعلى الصفحة يقوم بحذف جميع الإشعارات بشكل نهائي.

```javascript
async function handleClearAll() {
    if (!confirm('هل تريد حذف جميع الإشعارات؟')) return;
    const result = await notificationsStore.clearAll();
    if (result.success) {
        showSuccess('تم حذف جميع الإشعارات');
        await loadNotifications();
    }
}
```

### 3. عرض الطلب
زر في كل إشعار مرتبط بطلب للانتقال مباشرة إلى صفحة تفاصيل الطلب.

```javascript
window.viewSubmission = function(submissionId) {
    window.location.href = `/pages/admin/submission-details.html?id=${submissionId}`;
};
```

### 4. تعليم كمقروء
زر في كل إشعار غير مقروء لتعليمه كمقروء.

```javascript
window.markAsRead = async function(notificationId) {
    const result = await notificationsStore.markAsRead(notificationId);
    if (result.success) {
        // تحديث الواجهة
    }
};
```

### 5. حذف إشعار
زر في كل إشعار لحذفه بشكل نهائي.

```javascript
window.deleteNotification = async function(notificationId) {
    if (!confirm('هل تريد حذف هذا الإشعار؟')) return;
    const result = await notificationsStore.deleteNotification(notificationId);
    if (result.success) {
        // إزالة من الواجهة
    }
};
```

## 🔄 الإشعارات الفورية (Realtime)

يستخدم النظام Supabase Realtime للحصول على الإشعارات الجديدة بشكل فوري دون الحاجة لتحديث الصفحة.

```javascript
// في notificationsStore.js
subscribeToRealtime() {
    const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
        }, (payload) => {
            this.handleNewNotification(payload.new);
        })
        .subscribe();
}
```

## 🔐 الأمان

- يتطلب تسجيل دخول المستخدم
- يتحقق من صلاحية المسؤول قبل عرض الصفحة
- يستخدم Row Level Security (RLS) في قاعدة البيانات

```javascript
const user = await requireAdmin();
if (!user) return; // إعادة توجيه إلى صفحة تسجيل الدخول
```

## 📱 التصميم المتجاوب

الصفحة متجاوبة بالكامل وتعمل على جميع الأجهزة:

- **سطح المكتب**: عرض كامل مع جميع الميزات
- **اللوحي**: تعديلات طفيفة في التخطيط
- **الموبايل**: 
  - قائمة جانبية قابلة للطي
  - أزرار أصغر
  - فلاتر قابلة للتمرير أفقياً

## 🧪 الاختبار

### اختبار الوظائف الأساسية:

1. **تحميل الإشعارات:**
   - افتح الصفحة
   - تحقق من ظهور الإشعارات

2. **الفلاتر:**
   - اضغط على كل فلتر
   - تحقق من ظهور الإشعارات الصحيحة

3. **تعليم كمقروء:**
   - اضغط على "تعليم كمقروء" لإشعار واحد
   - تحقق من تغيير لونه

4. **حذف إشعار:**
   - اضغط على "حذف" لإشعار
   - تحقق من اختفائه

5. **عرض الطلب:**
   - اضغط على "عرض الطلب"
   - تحقق من الانتقال لصفحة التفاصيل

6. **الإشعارات الفورية:**
   - افتح الصفحة في متصفح
   - قم بإنشاء إشعار جديد من متصفح آخر
   - تحقق من ظهوره مباشرة

## 📝 ملاحظات

- يتم حفظ عدد الإشعارات غير المقروءة في القائمة الجانبية
- يتم تحديث العداد تلقائياً عند تعليم إشعار كمقروء
- يختفي العداد عندما يكون عدد الإشعارات غير المقروءة = 0
- يتم عرض رسالة "لا توجد إشعارات" عندما تكون القائمة فارغة

## 🔗 الملفات ذات الصلة

- `public/js/stores/notificationsStore.js` - إدارة حالة الإشعارات
- `database/schema.sql` - جدول الإشعارات في قاعدة البيانات
- `public/css/dashboard.css` - أنماط لوحة التحكم
- `public/css/admin-enhanced.css` - أنماط خاصة بالأدمن

## 🎯 التحسينات المستقبلية

- [ ] إضافة صوت للإشعارات الجديدة
- [ ] إضافة إشعارات المتصفح (Browser Notifications)
- [ ] إضافة إعدادات تفضيلات الإشعارات
- [ ] إضافة بحث في الإشعارات
- [ ] إضافة أرشفة الإشعارات القديمة
- [ ] إضافة تصنيفات متقدمة
- [ ] إضافة إحصائيات الإشعارات

## 🐛 الإصلاحات والتحديثات

### النسخة 1.0 (2024-11-16)
- ✅ إنشاء صفحة الإشعارات للمسؤول
- ✅ إضافة رابط الإشعارات في جميع صفحات الأدمن
- ✅ دعم الإشعارات الفورية
- ✅ دعم الفلاتر المتعددة
- ✅ التصميم المتجاوب

## 📞 الدعم

في حالة وجود أي مشاكل أو استفسارات:
- راجع الكود في الملفات المذكورة أعلاه
- تحقق من console.log في المتصفح للأخطاء
- تحقق من صلاحيات المستخدم في قاعدة البيانات

