// سكربت اختبار سريع
require('dotenv').config();

console.log('=== اختبار سريع ===');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'موجود' : 'غير موجود');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'موجود' : 'غير موجود');
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'موجود' : 'غير موجود');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'موجود' : 'غير موجود');
console.log('==================');

