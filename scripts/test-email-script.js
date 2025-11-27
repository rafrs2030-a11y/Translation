require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

console.log('🔧 اختبار الاتصال...\n');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

// إعدادات SMTP
const smtpHost = process.env.SMTP_HOST || 'smtp.resend.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465');
const smtpUser = process.env.SMTP_USER || 'resend';
const smtpPassword = process.env.SMTP_PASSWORD || resendApiKey;
const fromEmail = process.env.FROM_EMAIL || 'rafrs2030@gmail.com';
const fromName = process.env.FROM_NAME || 'منصة نشر الأبحاث العربية';

console.log('SUPABASE_URL:', supabaseUrl ? '✅ موجود' : '❌ غير موجود');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ موجود' : '❌ غير موجود');
console.log('SMTP_HOST:', smtpHost);
console.log('SMTP_PORT:', smtpPort);
console.log('SMTP_USER:', smtpUser);
console.log('SMTP_PASSWORD:', smtpPassword ? '✅ موجود' : '❌ غير موجود');

if (!supabaseUrl || !supabaseServiceKey || !smtpPassword) {
  console.error('\n❌ بعض المتغيرات البيئية مفقودة!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// إعداد nodemailer مع SMTP
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for other ports
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

// اختبار الاتصال بقاعدة البيانات
(async () => {
  try {
    console.log('\n📊 جلب المستخدمين...');
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, username')
      .limit(3);
    
    if (error) {
      console.error('❌ خطأ في قاعدة البيانات:', error.message);
      process.exit(1);
    }
    
    console.log(`✅ تم العثور على ${users?.length || 0} مستخدم(ين) للاختبار`);
    
    if (users && users.length > 0) {
      const testUser = users[0];
      console.log(`\n📧 اختبار إرسال إيميل إلى: ${testUser.email}`);
      
      try {
        const info = await transporter.sendMail({
          from: `${fromName} <${fromEmail}>`,
          to: testUser.email,
          subject: 'اختبار - Test Email',
          html: '<p>هذا إيميل اختبار عبر SMTP</p>',
        });
        
        console.log('✅ تم إرسال الإيميل بنجاح!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
      } catch (emailError) {
        console.error('❌ فشل إرسال الإيميل:', emailError.message);
        if (emailError.response) {
          console.error('SMTP Response:', emailError.response);
        }
      }
    }
    
    console.log('\n✨ انتهى الاختبار.');
  } catch (err) {
    console.error('❌ خطأ:', err.message);
    console.error('Stack:', err.stack);
  }
})();

