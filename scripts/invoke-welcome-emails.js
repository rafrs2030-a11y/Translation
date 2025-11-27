/**
 * استدعاء Edge Function لإرسال إيميلات ترحيبية
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ يجب ضبط SUPABASE_URL و SUPABASE_ANON_KEY في ملف .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function invokeWelcomeEmails() {
  console.log('🚀 بدء استدعاء Edge Function لإرسال الإيميلات الترحيبية...\n');

  try {
    const { data, error } = await supabase.functions.invoke('send-welcome-emails', {
      method: 'POST',
      body: {},
    });

    if (error) {
      console.error('❌ خطأ في استدعاء Edge Function:', error);
      console.error('التفاصيل:', JSON.stringify(error, null, 2));
      process.exit(1);
    }

    console.log('✅ تم استدعاء Edge Function بنجاح!\n');
    console.log('📊 النتائج:');
    console.log(JSON.stringify(data, null, 2));

    if (data && data.ok) {
      console.log(`\n✨ الملخص:`);
      console.log(`   📧 إجمالي المستخدمين: ${data.total}`);
      console.log(`   ✅ تم الإرسال بنجاح: ${data.sent}`);
      console.log(`   ❌ فشل الإرسال: ${data.failed}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ خطأ غير متوقع:', err);
    process.exit(1);
  }
}

invokeWelcomeEmails();

