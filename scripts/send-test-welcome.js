/**
 * سكربت بسيط لاختبار إرسال إيميل ترحيبي واحد
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

async function main() {
  console.log('🔧 اختبار إرسال إيميل ترحيبي...\n');

  // التحقق من المتغيرات البيئية
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpPassword = process.env.SMTP_PASSWORD || resendApiKey;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ يجب ضبط SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  if (!smtpPassword) {
    console.error('❌ يجب ضبط SMTP_PASSWORD أو RESEND_API_KEY');
    process.exit(1);
  }

  // إعدادات SMTP
  const smtpHost = process.env.SMTP_HOST || 'smtp.resend.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '465');
  const smtpUser = process.env.SMTP_USER || 'resend';
  const fromEmail = process.env.FROM_EMAIL || 'rafrs2030@gmail.com';
  const fromName = process.env.FROM_NAME || 'منصة نشر الأبحاث العربية';

  console.log('📋 الإعدادات:');
  console.log('  SMTP_HOST:', smtpHost);
  console.log('  SMTP_PORT:', smtpPort);
  console.log('  SMTP_USER:', smtpUser);
  console.log('  FROM_EMAIL:', fromEmail);
  console.log('');

  // الاتصال بقاعدة البيانات
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // جلب أول مستخدم
  console.log('📊 جلب المستخدمين من قاعدة البيانات...');
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, username')
    .limit(1);

  if (error) {
    console.error('❌ خطأ في قاعدة البيانات:', error.message);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.log('ℹ️ لا يوجد مستخدمون في قاعدة البيانات');
    process.exit(0);
  }

  const testUser = users[0];
  console.log(`✅ تم العثور على مستخدم: ${testUser.email}\n`);

  // إعداد nodemailer
  console.log('🔌 إعداد اتصال SMTP...');
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  // اختبار الاتصال
  try {
    await transporter.verify();
    console.log('✅ اتصال SMTP ناجح\n');
  } catch (error) {
    console.error('❌ فشل التحقق من اتصال SMTP:', error.message);
    process.exit(1);
  }

  // إرسال إيميل اختبار
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مرحباً بك</title>
</head>
<body style="font-family: Arial, sans-serif; direction: rtl;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #3D5A94;">مرحباً بك في منصة نشر الأبحاث العربية</h1>
    <p>عزيزي ${testUser.username || testUser.email.split('@')[0]}،</p>
    <p>نشكرك على انضمامك إلى منصة نشر الأبحاث العربية.</p>
    <p>هذا إيميل اختبار لإرسال الرسائل الترحيبية.</p>
    <p>مع أطيب التحيات،<br><strong>فريق منصة نشر الأبحاث العربية</strong></p>
  </div>
</body>
</html>
  `;

  console.log(`📧 إرسال إيميل إلى: ${testUser.email}...`);
  
  try {
    const info = await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: testUser.email,
      subject: 'اختبار - مرحباً بك في منصة نشر الأبحاث العربية',
      html: html,
    });

    console.log('✅ تم إرسال الإيميل بنجاح!');
    console.log('  Message ID:', info.messageId);
    console.log('  Response:', info.response);
  } catch (error) {
    console.error('❌ فشل إرسال الإيميل:', error.message);
    if (error.response) {
      console.error('  SMTP Response:', error.response);
    }
    process.exit(1);
  }

  console.log('\n✨ انتهى الاختبار.');
}

main().catch(err => {
  console.error('❌ خطأ غير متوقع:', err);
  process.exit(1);
});

