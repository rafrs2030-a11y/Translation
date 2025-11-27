require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔧 اختبار اتصال SMTP...\n');

const smtpHost = process.env.SMTP_HOST || 'smtp.resend.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465');
const smtpUser = process.env.SMTP_USER || 'resend';
const resendApiKey = process.env.RESEND_API_KEY;
const smtpPassword = process.env.SMTP_PASSWORD || resendApiKey;

console.log('📋 الإعدادات:');
console.log('  SMTP_HOST:', smtpHost);
console.log('  SMTP_PORT:', smtpPort);
console.log('  SMTP_USER:', smtpUser);
console.log('  SMTP_PASSWORD:', smtpPassword ? '✅ موجود' : '❌ غير موجود');
console.log('');

if (!smtpPassword) {
  console.error('❌ يجب ضبط SMTP_PASSWORD أو RESEND_API_KEY في ملف .env');
  process.exit(1);
}

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
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ فشل التحقق من اتصال SMTP:', error.message);
    console.error('التفاصيل:', error);
    process.exit(1);
  } else {
    console.log('✅ اتصال SMTP ناجح!');
    console.log('يمكنك الآن إرسال الإيميلات.\n');
    process.exit(0);
  }
});

