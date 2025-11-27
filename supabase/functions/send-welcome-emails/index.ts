import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "rafrs2030@gmail.com";
const FROM_NAME = Deno.env.get("FROM_NAME") || "منصة نشر الأبحاث العربية";
const BATCH_SIZE = Number(Deno.env.get("BATCH_SIZE") || "2");
const DELAY_BETWEEN_EMAILS = Number(Deno.env.get("DELAY_BETWEEN_EMAILS") || "600");
const DELAY_BETWEEN_BATCHES = Number(Deno.env.get("DELAY_BETWEEN_BATCHES") || "1000");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables.");
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/**
 * إنشاء محتوى الإيميل الترحيبي (HTML)
 */
function generateWelcomeEmailHtml(usernameOrEmail: string): string {
  const name = usernameOrEmail || "عزيزي الباحث";
  const currentYear = new Date().getFullYear();

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
      <p>© ${currentYear} منصة نشر الأبحاث العربية. جميع الحقوق محفوظة.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * تسجيل الإيميل في email_log
 */
async function logEmailToDatabase(
  userId: string | null,
  recipientEmail: string,
  subject: string,
  status: "sent" | "failed" | "queued",
  errorMessage: string | null = null
): Promise<void> {
  try {
    const { error } = await supabase.from("email_log").insert([
      {
        user_id: userId || null,
        email_type: "system",
        recipient_email: recipientEmail,
        subject: subject,
        status: status,
        error_message: errorMessage || null,
        sent_at: status === "sent" ? new Date().toISOString() : null,
      },
    ]);

    if (error) {
      console.warn(`⚠️ Failed to log email to database:`, error.message);
    }
  } catch (logError) {
    console.warn(`⚠️ Failed to log email to database:`, logError);
  }
}

/**
 * إرسال إيميل واحد عبر Supabase Email
 * 
 * يستخدم Edge Function send-notification-email الموجود لإرسال الإيميلات
 * والذي يدعم Supabase Email و Resend و SendGrid
 */
async function sendEmail(
  to: string,
  subject: string,
  html: string,
  userId?: string
): Promise<any> {
  try {
    // استخدام Edge Function send-notification-email الموجود
    // والذي يدعم Supabase Email و Resend و SendGrid
    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        emailData: {
          to: to,
          subject: subject,
          html: html,
          type: 'system',
          userId: userId || null,
        },
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to invoke send-notification-email');
    }

    // التحقق من أن الإيميل تم إرساله بنجاح
    // send-notification-email يرجع { success: true } أو { success: false, error: ... }
    if (data && typeof data === 'object') {
      // إذا كان success === false، نرمي خطأ
      if (data.success === false) {
        const errorMsg = (data as any)?.error || (data as any)?.message || 'Email sending failed';
        throw new Error(errorMsg);
      }
      // إذا كان success === true أو لم يكن success موجوداً، نعتبره نجاح
      return { success: true, data };
    }

    // إذا لم يكن هناك data، نعتبره نجاح (بعض Edge Functions لا ترجع data)
    // أو إذا كان status code 200، نعتبره نجاح
    return { success: true };
  } catch (error: any) {
    console.error("Supabase Email error:", error);
    const errorMessage = error?.message || error?.toString() || String(error) || "Unknown error";
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
}

// Main handler
Deno.serve(async (req: Request) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Optional: allow POST only
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Use POST method" }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    console.log("📧 Starting welcome email sending process...");
    console.log("📤 Using Resend via send-notification-email function");

    // Fetch users from users table
    const { data, error } = await supabase
      .from("users")
      .select("id, email, username")
      .not("email", "is", null)
      .order("created_at", { ascending: true })
      .limit(10000); // safety cap

    if (error) {
      console.error("❌ Supabase select error:", error);
      return new Response(
        JSON.stringify({ error: "db_select_failed", detail: error.message }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const rows = data as Array<{ id: string; email: string; username: string | null }>;

    // Filter duplicates & invalid emails
    const validUsers = Array.from(
      new Map(
        rows
          .map((r) => ({
            id: r.id,
            email: (r.email || "").trim(),
            username: r.username || null,
          }))
          .filter((r) => r.email && r.email.includes("@"))
          .map((r) => [r.email.toLowerCase(), r])
      ).values()
    );

    console.log(`✅ Found ${validUsers.length} valid users out of ${rows.length} total users`);

    if (validUsers.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, message: "No valid users found", total: 0, results: [] }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Log all emails as queued
    console.log("📝 Logging emails as queued...");
    for (const user of validUsers) {
      await logEmailToDatabase(
        user.id,
        user.email,
        "مرحباً بك في منصة نشر الأبحاث العربية",
        "queued"
      );
    }

    // Process in batches
    const results: Array<{ email: string; status: string; detail?: string }> = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < validUsers.length; i += BATCH_SIZE) {
      const batch = validUsers.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(validUsers.length / BATCH_SIZE);

      console.log(`📤 Processing batch ${batchNumber}/${totalBatches} (${batch.length} emails)...`);

      // Send batch sequentially to respect rate limits (2 req/sec)
      for (const user of batch) {
        const to = user.email;
        const displayName = user.username || to.split("@")[0];
        const subject = "مرحباً بك في منصة نشر الأبحاث العربية";
        const html = generateWelcomeEmailHtml(displayName);

        // Simple retry for transient errors
        const MAX_RETRY = 2;
        let attempt = 0;
        let lastError: Error | null = null;

        while (attempt <= MAX_RETRY) {
          try {
            await sendEmail(to, subject, html, user.id);
            
            // Log success
            await logEmailToDatabase(
              user.id,
              to,
              subject,
              "sent"
            );

            results.push({ email: to, status: "sent" });
            successCount++;
            console.log(`✅ Sent email to: ${to}`);
            break;
          } catch (err: any) {
            attempt++;
            lastError = err;
            console.error(
              `❌ Failed sending to ${to}, attempt ${attempt}/${MAX_RETRY + 1}:`,
              err.message || err
            );

            if (attempt > MAX_RETRY) {
              // Log failure
              await logEmailToDatabase(
                user.id,
                to,
                subject,
                "failed",
                String(err.message || err)
              );

              results.push({
                email: to,
                status: "failed",
                detail: String(err.message || err),
              });
              failCount++;
            } else {
              // Backoff before retry (exponential backoff)
              const backoffDelay = Math.min(2000 * Math.pow(2, attempt - 1), 10000); // Max 10 seconds
              await new Promise((r) => setTimeout(r, backoffDelay));
            }
          }
        }

        // Delay between emails to respect rate limit (2 req/sec = 600ms delay)
        if (batch.indexOf(user) < batch.length - 1) {
          await new Promise((r) => setTimeout(r, DELAY_BETWEEN_EMAILS));
        }
      }

      // Delay between batches to avoid hitting rate limits
      if (i + BATCH_SIZE < validUsers.length) {
        await new Promise((r) => setTimeout(r, DELAY_BETWEEN_BATCHES));
      }
    }

    console.log(`📊 Summary: ${successCount} sent, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        ok: true,
        total: validUsers.length,
        sent: successCount,
        failed: failCount,
        results: results.slice(0, 100), // Limit results in response to avoid large payloads
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err: any) {
    console.error("❌ Unhandled error:", err);
    const errorDetail = err?.message || err?.toString() || String(err) || "Unknown error";
    return new Response(
      JSON.stringify({
        error: "internal",
        detail: errorDetail,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});

