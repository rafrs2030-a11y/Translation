/**
 * Bulk Welcome Email Sender
 * يرسل إيميل ترحيبي لكل المستخدمين المسجلين في جدول users
 * يستخدم Resend Batch API لإرسال الإيميلات بشكل أكثر كفاءة
 *
 * الاستخدام:
 * 1. تأكد من وجود المتغيرات التالية في ملف .env أو في بيئة التشغيل:
 *    - SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 *    - RESEND_API_KEY
 *    - FROM_EMAIL (اختياري، افتراضي: noreply@arabresearch.com)
 *    - FROM_NAME (اختياري، افتراضي: منصة نشر الأبحاث العربية)
 * 2. تأكد من تثبيت resend package:
 *    npm install resend
 * 3. نفّذ:
 *    node scripts/send-welcome-email-to-all-users.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

console.log('🔧 تهيئة السكربت...');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL || 'rafrs2030@gmail.com';
const fromName = process.env.FROM_NAME || 'منصة نشر الأبحاث العربية';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ يجب ضبط SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY في ملف .env قبل التشغيل.');
  process.exit(1);
}

if (!resendApiKey) {
  console.error('❌ يجب ضبط RESEND_API_KEY في ملف .env قبل التشغيل.');
  process.exit(1);
}

// نستخدم service role لتجاوز RLS عند قراءة جميع المستخدمين
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// تهيئة Resend
const resend = new Resend(resendApiKey);

/**
 * إنشاء محتوى الإيميل الترحيبي (HTML)
 */
function generateWelcomeEmailHtml(usernameOrEmail) {
  const name = usernameOrEmail || 'عزيزي الباحث';

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مرحباً بك في منصة نشر الأبحاث العربية</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
      direction: rtl;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #3D5A94 0%, #5176B8 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 25px 40px;
    }
    .button {
      display: inline-block;
      background-color: #3D5A94;
      color: white;
      text-decoration: none;
      padding: 12px 32px;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
      font-size: 15px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 16px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>مرحباً بك في منصة نشر الأبحاث العربية</h1>
    </div>
    <div class="content">
      <p>السلام عليكم ${name}،</p>
      <p>
        نشكرك على انضمامك إلى <strong>منصة نشر الأبحاث العربية</strong>، المنصة المخصصة لدعم الباحثين العرب
        وتمكينهم من نشر أبحاثهم وأعمالهم العلمية للجمهور العربي والعالمي.
      </p>
      <p>
        من خلال حسابك يمكنك:
      </p>
      <ul>
        <li>تقديم الأبحاث والكتب للمراجعة والنشر.</li>
        <li>متابعة حالة الطلبات والإشعارات خطوة بخطوة.</li>
        <li>استلام تحديثات عبر البريد الإلكتروني عند تغيير حالة البحث.</li>
      </ul>
      <p>
        ندعوك الآن لتسجيل الدخول واستكمال بياناتك والبدء في تقديم أبحاثك.
      </p>
      <p style="text-align: center;">
        <a href="https://arabresearch.com" class="button">الدخول إلى المنصة</a>
      </p>
      <p>
        إذا كان لديك أي استفسارات أو اقتراحات، يسعدنا تواصلك معنا.
      </p>
      <p>مع أطيب التحيات،<br><strong>فريق منصة نشر الأبحاث العربية</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} منصة نشر الأبحاث العربية. جميع الحقوق محفوظة.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * تسجيل الإيميل في email_log
 */
async function logEmailToDatabase(userId, recipientEmail, subject, status, errorMessage = null) {
  try {
    await supabase
      .from('email_log')
      .insert([{
        user_id: userId || null,
        email_type: 'system',
        recipient_email: recipientEmail,
        subject: subject,
        status: status,
        error_message: errorMessage || null,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
      }]);
  } catch (logError) {
    console.warn(`⚠️ فشل تسجيل الإيميل في email_log:`, logError.message);
  }
}

async function sendWelcomeEmailToAllUsers() {
  console.log('📧 بدء إرسال الإيميل الترحيبي لجميع المستخدمين المسجلين...\n');
  console.log(`📤 استخدام Resend Batch API لإرسال الإيميلات بشكل أكثر كفاءة\n`);

  // جلب جميع المستخدمين من public.users
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, username')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ فشل في جلب المستخدمين من قاعدة البيانات:', error.message);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.log('ℹ️ لا يوجد مستخدمون لإرسال الإيميل لهم.');
    process.exit(0);
  }

  // تصفية المستخدمين الذين لديهم إيميل صالح
  const validUsers = users.filter(user => user.email && user.email.trim());

  if (validUsers.length === 0) {
    console.log('ℹ️ لا يوجد مستخدمون بإيميلات صالحة لإرسال الإيميل لهم.');
    process.exit(0);
  }

  console.log(`✅ تم العثور على ${validUsers.length} مستخدم(ين) بإيميلات صالحة من أصل ${users.length}.\n`);

  // إعداد Batch من الإيميلات
  const emailBatch = validUsers.map(user => {
    const displayName = user.username || user.email.split('@')[0];
    const html = generateWelcomeEmailHtml(displayName);

    return {
      from: `${fromName} <${fromEmail}>`,
      to: [user.email],
      subject: 'مرحباً بك في منصة نشر الأبحاث العربية',
      html: html,
    };
  });

  console.log(`📦 إعداد ${emailBatch.length} إيميل للإرسال...\n`);

  // تسجيل جميع الإيميلات كـ queued في email_log
  console.log('📝 تسجيل الإيميلات في email_log...');
  for (const user of validUsers) {
    await logEmailToDatabase(
      user.id,
      user.email,
      'مرحباً بك في منصة نشر الأبحاث العربية',
      'queued'
    );
  }

  // إرسال الإيميلات باستخدام Resend
  console.log('🚀 بدء إرسال الإيميلات عبر Resend API...\n');

  try {
    let successCount = 0;
    let failCount = 0;

    // إرسال الإيميلات بشكل متوازي (batches صغيرة لتجنب rate limits)
    const BATCH_SIZE = 10; // إرسال 10 إيميلات في كل مرة
    
    for (let i = 0; i < validUsers.length; i += BATCH_SIZE) {
      const batch = validUsers.slice(i, i + BATCH_SIZE);
      console.log(`📤 إرسال الدفعة ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} إيميل)...`);
      
      // إرسال متوازي للدفعة الحالية
      const batchPromises = batch.map(async (user) => {
        const displayName = user.username || user.email.split('@')[0];
        const html = generateWelcomeEmailHtml(displayName);

        try {
          const { data: result, error: sendError } = await resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to: user.email,
            subject: 'مرحباً بك في منصة نشر الأبحاث العربية',
            html: html,
          });

          if (sendError) {
            failCount++;
            await logEmailToDatabase(
              user.id,
              user.email,
              'مرحباً بك في منصة نشر الأبحاث العربية',
              'failed',
              sendError.message || 'Send failed'
            );
            console.error(`❌ فشل إرسال الإيميل إلى ${user.email}:`, sendError.message);
            return { success: false, user, error: sendError };
          } else {
            successCount++;
            await logEmailToDatabase(
              user.id,
              user.email,
              'مرحباً بك في منصة نشر الأبحاث العربية',
              'sent'
            );
            console.log(`✅ تم إرسال الإيميل إلى: ${user.email} (ID: ${result?.id || 'N/A'})`);
            return { success: true, user, result };
          }
        } catch (sendError) {
          failCount++;
          await logEmailToDatabase(
            user.id,
            user.email,
            'مرحباً بك في منصة نشر الأبحاث العربية',
            'failed',
            sendError.message || 'Exception occurred'
          );
          console.error(`❌ خطأ أثناء إرسال الإيميل إلى ${user.email}:`, sendError.message);
          return { success: false, user, error: sendError };
        }
      });

      // انتظار اكتمال الدفعة الحالية
      await Promise.all(batchPromises);
      
      // تأخير بسيط بين الدفعات لتجنب rate limits
      if (i + BATCH_SIZE < validUsers.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    console.log('\n📊 الملخص النهائي:');
    console.log(`   ✅ تم الإرسال بنجاح إلى: ${successCount} مستخدم(ين)`);
    console.log(`   ❌ فشل الإرسال إلى: ${failCount} مستخدم(ين)`);
    console.log(`   📧 إجمالي الإيميلات: ${validUsers.length}`);

  } catch (error) {
    console.error('❌ خطأ غير متوقع أثناء إرسال الإيميلات:', error.message || error);
    
    // تسجيل الفشل لجميع الإيميلات
    for (const user of validUsers) {
      await logEmailToDatabase(
        user.id,
        user.email,
        'مرحباً بك في منصة نشر الأبحاث العربية',
        'failed',
        error.message || 'Unexpected error'
      );
    }
    
    process.exit(1);
  }

  console.log('\n✨ انتهى التنفيذ.');
}

// تشغيل السكربت مع معالجة شاملة للأخطاء
(async () => {
  try {
    await sendWelcomeEmailToAllUsers();
    process.exit(0);
  } catch (err) {
    console.error('❌ خطأ غير متوقَّع:', err.message || err);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
})();


