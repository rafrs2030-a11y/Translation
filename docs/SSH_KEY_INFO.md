# معلومات مفتاح SSH

## المفتاح المستلم

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC/qcaE9jGCZ05yfULPMWh/oNRXErFoDo65ns611Q7bBaHxoKedX14k16lixb6OQ+jLaoY9C/jTcNNkx4PwhezfZXYVbFqvcEFPssFhEbwDC8zzir15z1pyD5dK9sB+Tc+aonwcka6eJeSjXNhcfboT397RUicnmAt2vaGnYiWgxmW/uNtrIPOwh7edRoWlK/n8kNwCCW6hXF1F8udQn4N6kDVeKJPAIAf4tL8lp9RbE5tSROaWEiAmFB9MpLY2MLOIg64oDf9IOjYxgVQnBftYDbhYHHHxV47JILTc6MlxjyeDj4poyP/BzvqvKsrZSKnKEGvI40BC4eLDVav9szOk7PjYBZtzWuy8W5eEucbgGSlEpY8v27ZdtLqTa7JNLuTa3z6E7AkYd20qdCV8wfDDBHNpCV3BiK6XJRGmVGcdeuzeEE440+iV1pXHLaEMzrUKtclSCO/6NZ9quQe/rnqcVfXUgSWSsLysLehy2alQlMa9wdIXBrs3+7T0OIsTvT756euh0OX2UcRu7auknUfVm2y0mA7p57b+FhDp9a0cjnCJ6O2BOGgRxPnMSCF8KVbbvtPUmU7m6iwEynF76+LLdTFOrk3H4v28jywRLvdFfim2MbGazDfCFfUrhuN5D/jdR9ImOSV5HrFdxchn0g93s3FdjdrUJOLrSJK7UXwkeQ==
```

## الاستخدامات المحتملة

### 1. إضافة المفتاح إلى GitHub

إذا كنت تريد استخدام هذا المفتاح للوصول إلى مستودع GitHub:

1. اذهب إلى: https://github.com/settings/keys
2. انقر على **New SSH key**
3. أضف العنوان والْمفتاح
4. احفظ

### 2. استخدام المفتاح للوصول إلى خادم

إذا كان لديك خادم وتريد الوصول إليه:

```bash
ssh -i ~/.ssh/your_key user@server-ip
```

### 3. إضافة المفتاح إلى Netlify

Netlify لا يستخدم عادةً مفاتيح SSH للمواقع الثابتة، لكن يمكن استخدامها للوصول إلى Build environment في بعض الحالات.

## ملاحظات

- **لا تشارك المفتاح الخاص (Private Key)** - فقط المفتاح العام (Public Key) آمن للمشاركة
- المفتاح المرفق يبدو أنه مفتاح عام (Public Key) - آمن للمشاركة
- تأكد من حفظ المفتاح الخاص بشكل آمن

## الأمان

- احفظ المفتاح الخاص في مكان آمن
- لا ترفع المفتاح الخاص إلى Git
- استخدم كلمة مرور قوية للمفتاح إذا أمكن

---

**تاريخ الاستلام**: 2025-01-XX

