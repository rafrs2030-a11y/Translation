# مرجع الألوان السريع 🎨

## نظرة سريعة على الألوان

| اللون | الكود | المتغير | الاستخدام |
|-------|------|---------|-----------|
| 🔵 الأزرق الأساسي | `#3D5A94` | `--primary-color` | الأزرار، الروابط، العناصر النشطة |
| 🔵 الأزرق الداكن | `#2A4070` | `--primary-dark` | Hover، التركيز |
| 🔵 الأزرق الفاتح | `#5176B8` | `--primary-light` | الخلفيات، التدرجات |
| 🟠 البرتقالي | `#E89A3C` | `--secondary-color` | التمييزات، الإحصائيات |
| 🟠 البرتقالي الداكن | `#D58520` | `--secondary-dark` | Hover للعناصر الثانوية |
| 🟢 الأخضر | `#10b981` | `--success-color` | النجاح، القبول |
| 🔴 الأحمر | `#ef4444` | `--error-color` | الأخطاء، الرفض |

---

## التدرجات الجاهزة

### التدرج الأساسي
```css
background: linear-gradient(135deg, #3D5A94 0%, #5176B8 100%);
```
**الاستخدام**: Hero sections، صفحات المصادقة، Headers

---

## أمثلة استخدام

### في HTML
```html
<!-- زر أساسي -->
<button class="btn btn-primary">احفظ</button>

<!-- زر ثانوي -->
<button class="btn btn-secondary">تحذير</button>

<!-- شارة -->
<span class="badge badge-primary">جديد</span>
```

### في CSS
```css
/* استخدام المتغيرات */
.custom-element {
    background-color: var(--primary-color);
    color: white;
}

/* حالة Hover */
.custom-element:hover {
    background-color: var(--primary-dark);
}
```

### في JavaScript
```javascript
// الحصول على اللون من CSS Variables
const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color');
```

---

## Classes الجاهزة

### الأزرار
- `.btn-primary` - أزرق أساسي
- `.btn-secondary` - برتقالي
- `.btn-outline` - محدد بالأزرق
- `.btn-danger` - أحمر
- `.btn-ghost` - شفاف

### الشارات
- `.badge-primary` - أزرق
- `.badge-success` - أخضر
- `.badge-warning` - برتقالي
- `.badge-error` - أحمر
- `.badge-info` - أزرق

### التنبيهات
- `.alert-success` - نجاح
- `.alert-warning` - تحذير
- `.alert-error` - خطأ
- `.alert-info` - معلومة

---

## نصائح سريعة 💡

### 1. التباين
- استخدم الأزرق الداكن `#2A4070` للنصوص على خلفيات فاتحة
- استخدم البرتقالي `#E89A3C` للتمييز والانتباه

### 2. الوضوح
- لا تستخدم أكثر من لونين أساسيين في نفس العنصر
- احرص على تباين كاف بين النص والخلفية (4.5:1 كحد أدنى)

### 3. التناسق
- استخدم المتغيرات CSS بدلاً من الأكواد المباشرة
- اتبع نظام الشارات والأزرار الموجود

---

## 🔗 روابط مفيدة

- [دليل الهوية البصرية الكامل](./LOGO_BRANDING.md)
- [صفحة عرض الألوان](/colors-demo.html)
- [ملخص التحديثات](../BRANDING_UPDATE_SUMMARY.md)

---

## اختصارات VS Code

للبحث واستبدال الألوان القديمة:

1. `Ctrl+Shift+F` للبحث في جميع الملفات
2. ابحث عن: `#2563eb` (اللون القديم)
3. استبدل بـ: `var(--primary-color)` أو `#3D5A94`

---

آخر تحديث: نوفمبر 2025

