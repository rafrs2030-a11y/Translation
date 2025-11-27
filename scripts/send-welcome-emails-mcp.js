/**
 * Bulk Welcome Email Sender using MCP and Supabase
 * يرسل إيميل ترحيبي لكل المستخدمين المسجلين في جدول users
 * يستخدم Supabase Client لجلب المستخدمين و Supabase Edge Function لإرسال الإيميلات عبر resend.com SMTP
 *
 * المتطلبات:
 * 1. متغيرات البيئة في ملف .env:
 *    - SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 *    - FROM_EMAIL (اختياري، افتراضي: noreply@arabresearch.com)
 *    - FROM_NAME (اختياري، افتراضي: منصة نشر الأبحاث العربية)
 *
 * 2. إعداد Supabase Edge Function Secrets:
 *    - اذهب إلى Supabase Dashboard > Edge Functions > send-notification-email > Secrets
 *    - أضف:
 *      * RESEND_API_KEY=re_xxxxxxxxxxxxx
 *      * EMAIL_PROVIDER=smtp
 *      * SMTP_HOST=smtp.resend.com
 *      * SMTP_PORT=465
 *      * SMTP_USER=resend
 *      * SMTP_PASSWORD=re_xxxxxxxxxxxxx (نفس RESEND_API_KEY)
 *      * FROM_EMAIL=noreply@arabresearch.com
 *      * FROM_NAME=منصة نشر الأبحاث العربية
 *
 * الاستخدام:
 *    node scripts/send-welcome-emails-mcp.js
 *
 * للمزيد من التفاصيل: راجع scripts/SEND_WELCOME_EMAILS_MCP_README.md
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// دالة مساعدة للكتابة في الملف والطرفية
const logFile = path.join(__dirname, 'email-send-log-mcp.txt');
let logStream;

try {
  logStream = fs.createWriteStream(logFile, { flags: 'w' });
} catch (err) {
  console.error('فشل إنشاء ملف السجل:', err.message);
}

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  try {
    process.stdout.write(logMessage + '\n');
    if (logStream) {
      logStream.write(logMessage + '\n');
    }
  } catch (err) {
    console.log(logMessage);
  }
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const fromEmail = process.env.FROM_EMAIL || 'noreply@arabresearch.com';
const fromName = process.env.FROM_NAME || 'منصة نشر الأبحاث العربية';

log('📋 التحقق من المتغيرات البيئية:');
log(`  SUPABASE_URL: ${supabaseUrl ? '✅ موجود' : '❌ غير موجود'}`);
log(`  SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ موجود' : '❌ غير موجود'}`);
log(`  FROM_EMAIL: ${fromEmail}`);
log(`  FROM_NAME: ${fromName}`);
log('');

if (!supabaseUrl || !supabaseServiceKey) {
  log('❌ يجب ضبط SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY في ملف .env قبل التشغيل.');
  if (logStream) logStream.end();
  process.exit(1);
}

// نستخدم service role لتجاوز RLS عند قراءة جميع المستخدمين
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

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
 * إرسال إيميل عبر Supabase Edge Function
 */
async function sendEmailViaEdgeFunction(userId, recipientEmail, subject, html) {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        emailData: {
          to: recipientEmail,
          subject: subject,
          html: html,
          type: 'system',
          userId: userId,
        },
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to invoke edge function');
    }

    return { success: true, data };
  } catch (error) {
    throw error;
  }
}

/**
 * تسجيل الإيميل في email_log
 */
async function logEmailToDatabase(userId, recipientEmail, subject, status, errorMessage = null) {
  try {
    const { data, error } = await supabase
      .from('email_log')
      .insert([{
        user_id: userId || null,
        email_type: 'system',
        recipient_email: recipientEmail,
        subject: subject,
        status: status,
        error_message: errorMessage || null,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
      }])
      .select();
    
    if (error) {
      console.warn(`⚠️ فشل تسجيل الإيميل في email_log:`, error.message);
    }
  } catch (logError) {
    console.warn(`⚠️ فشل تسجيل الإيميل في email_log:`, logError.message);
  }
}

async function sendWelcomeEmailToAllUsers() {
  log('📧 بدء إرسال الإيميل الترحيبي لجميع المستخدمين المسجلين...');
  log('📤 استخدام Supabase Edge Function مع resend.com لإرسال الإيميلات');
  log('');

  // جلب جميع المستخدمين من public.users
  log('📊 جلب المستخدمين من قاعدة البيانات...');
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, username')
    .order('created_at', { ascending: true });

  if (error) {
    log(`❌ فشل في جلب المستخدمين من قاعدة البيانات: ${error.message}`);
    if (logStream) logStream.end();
    process.exit(1);
  }

  if (!users || users.length === 0) {
    log('ℹ️ لا يوجد مستخدمون لإرسال الإيميل لهم.');
    if (logStream) logStream.end();
    process.exit(0);
  }
  
  log(`✅ تم العثور على ${users.length} مستخدم(ين)`);

  // تصفية المستخدمين الذين لديهم إيميل صالح
  const validUsers = users.filter(user => user.email && user.email.trim());

  if (validUsers.length === 0) {
    log('ℹ️ لا يوجد مستخدمون بإيميلات صالحة لإرسال الإيميل لهم.');
    if (logStream) logStream.end();
    process.exit(0);
  }

  log(`✅ تم العثور على ${validUsers.length} مستخدم(ين) بإيميلات صالحة من أصل ${users.length}.`);
  log('');

  // تسجيل جميع الإيميلات كـ queued في email_log
  log('📝 تسجيل الإيميلات في email_log...');
  for (const user of validUsers) {
    await logEmailToDatabase(
      user.id,
      user.email,
      'مرحباً بك في منصة نشر الأبحاث العربية',
      'queued'
    );
  }
  log('✅ تم تسجيل جميع الإيميلات');
  log('');

  // إرسال الإيميلات باستخدام Supabase Edge Function
  log('🚀 بدء إرسال الإيميلات عبر Supabase Edge Function (resend.com)...');
  log('');

  try {
    let successCount = 0;
    let failCount = 0;

    // إرسال الإيميلات بشكل متوازي (batches صغيرة لتجنب rate limits)
    const BATCH_SIZE = 5; // إرسال 5 إيميلات في كل مرة
    
    for (let i = 0; i < validUsers.length; i += BATCH_SIZE) {
      const batch = validUsers.slice(i, i + BATCH_SIZE);
      log(`📤 إرسال الدفعة ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} إيميل)...`);
      
      // إرسال متوازي للدفعة الحالية
      const batchPromises = batch.map(async (user) => {
        const displayName = user.username || user.email.split('@')[0];
        const html = generateWelcomeEmailHtml(displayName);

        try {
          const result = await sendEmailViaEdgeFunction(
            user.id,
            user.email,
            'مرحباً بك في منصة نشر الأبحاث العربية',
            html
          );

          if (result.success) {
            successCount++;
            await logEmailToDatabase(
              user.id,
              user.email,
              'مرحباً بك في منصة نشر الأبحاث العربية',
              'sent'
            );
            log(`✅ تم إرسال الإيميل إلى: ${user.email}`);
            return { success: true, user, result };
          } else {
            throw new Error('Edge function returned unsuccessful result');
          }
        } catch (sendError) {
          failCount++;
          const errorMessage = sendError.message || (sendError.response ? sendError.response : 'Exception occurred');
          await logEmailToDatabase(
            user.id,
            user.email,
            'مرحباً بك في منصة نشر الأبحاث العربية',
            'failed',
            errorMessage
          );
          log(`❌ خطأ أثناء إرسال الإيميل إلى ${user.email}: ${errorMessage}`);
          return { success: false, user, error: sendError };
        }
      });

      // انتظار اكتمال الدفعة الحالية
      await Promise.all(batchPromises);
      
      // تأخير بسيط بين الدفعات لتجنب rate limits
      if (i + BATCH_SIZE < validUsers.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    log('');
    log('📊 الملخص النهائي:');
    log(`   ✅ تم الإرسال بنجاح إلى: ${successCount} مستخدم(ين)`);
    log(`   ❌ فشل الإرسال إلى: ${failCount} مستخدم(ين)`);
    log(`   📧 إجمالي الإيميلات: ${validUsers.length}`);

  } catch (error) {
    log(`❌ خطأ غير متوقع أثناء إرسال الإيميلات: ${error.message || error}`);
    
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

  log('');
  log('✨ انتهى التنفيذ.');
}

// تشغيل السكربت مع معالجة شاملة للأخطاء
(async () => {
  try {
    log('🚀 بدء التنفيذ...\n');
    await sendWelcomeEmailToAllUsers();
    log('');
    log('✅ اكتمل التنفيذ بنجاح!');
    log(`📄 تم حفظ السجل في ملف: ${logFile}`);
    if (logStream) logStream.end();
    process.exit(0);
  } catch (err) {
    const errorMsg = `❌ خطأ غير متوقَّع: ${err.message || err}\n`;
    if (err.stack) {
      log(errorMsg + `Stack: ${err.stack}\n`);
    } else {
      log(errorMsg);
    }
    if (logStream) logStream.end();
    process.exit(1);
  }
})();

