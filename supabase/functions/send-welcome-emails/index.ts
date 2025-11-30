import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.33.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "info@researcha.net"; // عنوان المرسل المسجّل في Resend
const BATCH_SIZE = Number(Deno.env.get("BATCH_SIZE") || "20");
const PROVIDER = Deno.env.get("EMAIL_PROVIDER") || "resend"; // future-proofing

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables.");
  Deno.exit(1);
}
if (!RESEND_API_KEY) {
  console.warn("RESEND_API_KEY not set; sending will fail until set.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function fetchQueuedBatch() {
  // select queued items that are scheduled to run (scheduled_at IS NULL or <= now())
  const now = new Date().toISOString();
  
  // Fetch items where scheduled_at is null or <= now
  const { data, error } = await supabase
    .from("email_queue")
    .select("*")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE * 2); // Fetch more to account for filtering

  if (error) {
    console.error("Error fetching queued batch:", error);
    throw error;
  }
  
  // Filter: scheduled_at is null or <= now
  const filtered = (data || []).filter((item: any) => 
    !item.scheduled_at || new Date(item.scheduled_at) <= new Date(now)
  ).slice(0, BATCH_SIZE);
  
  return filtered as Array<any>;
}

async function markProcessing(ids: string[]) {
  if (!ids || ids.length === 0) return;
  
  const { error } = await supabase
    .from("email_queue")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .in("id", ids);
  
  if (error) {
    console.error("Error marking processing:", error);
    throw error;
  }
}

async function sendViaResend(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(JSON.stringify({ status: res.status, body }));
  return body;
}

function renderTemplate(type: string, payload: any) {
  if (type === "welcome") {
    const name = payload?.name || "عزيزي الباحث";
    const currentYear = new Date().getFullYear();
    const platformUrl = Deno.env.get("PLATFORM_URL") || "https://arabresearch.com";
    
    return {
      subject: "مرحباً بك في منصة نشر الأبحاث العربية",
      html: `
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
      font-weight: bold;
    }
    .content {
      padding: 30px 25px 40px;
    }
    .welcome-icon {
      font-size: 60px;
      text-align: center;
      margin: 20px 0;
    }
    .features-list {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
    }
    .features-list ul {
      margin: 0;
      padding-right: 20px;
    }
    .features-list li {
      margin: 10px 0;
      line-height: 1.8;
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
    .button:hover {
      background-color: #5176B8;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 16px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .highlight-box {
      background-color: #e7f3ff;
      border-right: 4px solid #3D5A94;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>مرحباً بك في منصة نشر الأبحاث العربية</h1>
    </div>
    <div class="content">
      <div class="welcome-icon">🎉</div>
      <p style="font-size: 18px; margin-bottom: 20px;">السلام عليكم <strong>${name}</strong>،</p>
      <p>
        نشكرك على انضمامك إلى <strong>منصة نشر الأبحاث العربية</strong>، المنصة المخصصة لدعم الباحثين العرب
        وتمكينهم من نشر أبحاثهم وأعمالهم العلمية للجمهور العربي والعالمي.
      </p>
      
      <div class="features-list">
        <p style="margin-top: 0; font-weight: bold; color: #3D5A94;">من خلال حسابك يمكنك:</p>
        <ul>
          <li>تقديم الأبحاث والكتب للمراجعة والنشر</li>
          <li>متابعة حالة الطلبات والإشعارات خطوة بخطوة</li>
          <li>استلام تحديثات عبر البريد الإلكتروني عند تغيير حالة البحث</li>
          <li>التواصل مع فريق الإدارة مباشرة</li>
        </ul>
      </div>
      
      <div class="highlight-box">
        <p style="margin: 0;"><strong>💡 نصيحة:</strong> ندعوك الآن لتسجيل الدخول واستكمال بياناتك والبدء في تقديم أبحاثك.</p>
      </div>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${platformUrl}" class="button">الدخول إلى المنصة</a>
      </p>
      
      <p>
        إذا كان لديك أي استفسارات أو اقتراحات، يسعدنا تواصلك معنا.
      </p>
      
      <p style="margin-top: 30px;">
        مع أطيب التحيات،<br>
        <strong>فريق منصة نشر الأبحاث العربية</strong>
      </p>
    </div>
    <div class="footer">
      <p>© ${currentYear} منصة نشر الأبحاث العربية. جميع الحقوق محفوظة.</p>
      <p style="margin-top: 8px;">البريد الإلكتروني: info@researcha.net</p>
    </div>
  </div>
</body>
</html>
      `,
    };
  }
  if (type === "status_change") {
    const { old_status, new_status, comment, reference } = payload || {};
    return {
      subject: `تم تحديث حالة تقديمك: ${new_status}`,
      html: `<p>الحالة القديمة: ${old_status}<br/>الحالة الجديدة: ${new_status}</p>
             ${comment ? `<p>تعليق الإدارة: ${comment}</p>` : "" }
             ${reference ? `<p>مرجع التقديم: ${reference}</p>` : "" }`,
    };
  }
  // fallback
  return { subject: "إشعار من النظام", html: `<pre>${JSON.stringify(payload)}</pre>` };
}

async function logEmail(queueItem: any, status: string, providerResponse: any = null, errorText: string | null = null) {
  const { error } = await supabase.from("email_log").insert([{
    queue_id: queueItem.id,
    user_id: queueItem.user_id,
    recipient_email: queueItem.recipient_email,
    type: queueItem.type,
    status,
    provider: PROVIDER,
    provider_response: providerResponse ? providerResponse : null,
    error_text: errorText,
    attempts: queueItem.attempts + (status === "failed" ? 1 : 0),
    created_at: new Date().toISOString()
  }]);
  
  if (error) {
    console.error("Failed to insert email_log:", error);
  }
}

async function updateQueueAfterSuccess(id: string) {
  const { error } = await supabase.from("email_queue").update({
    status: "sent",
    attempts: 0,
    updated_at: new Date().toISOString()
  }).eq("id", id);
  
  if (error) {
    console.error("Failed to update email_queue after success:", error);
  }
}

async function updateQueueAfterFailure(id: string, attempts: number, errorText: string) {
  const MAX_ATTEMPTS = 5;
  const nextAttempts = attempts + 1;
  const newStatus = nextAttempts >= MAX_ATTEMPTS ? "failed" : "queued";
  const nextTryAt = newStatus === "queued" ? new Date(Date.now() + Math.min(60 * 1000 * Math.pow(2, attempts), 60 * 60 * 1000)).toISOString() : null; // exponential backoff
  const { error } = await supabase.from("email_queue").update({
    status: newStatus,
    attempts: nextAttempts,
    last_error: errorText,
    scheduled_at: nextTryAt,
    updated_at: new Date().toISOString()
  }).eq("id", id);
  
  if (error) {
    console.error("Failed to update email_queue after failure:", error);
  }
}

async function checkPreferencesAndSend(item: any) {
  // If user_id is present, fetch preferences; otherwise assume allowed
  let preferences = { email_enabled: true };
  if (item.user_id) {
    const { data, error } = await supabase.from("notification_preferences").select("*").eq("user_id", item.user_id).single();
    if (!error && data) {
      preferences = data;
    }
  }

  // Respect master toggle
  if (!preferences.email_enabled) {
    await logEmail(item, "failed", null, "email_disabled_in_preferences");
    // mark queue as failed to avoid retries (or you may choose to delete)
    await updateQueueAfterFailure(item.id, item.attempts || 0, "email_disabled_in_preferences");
    return;
  }

  // Check specific preference per type (example mapping)
  const mapping: Record<string, string> = {
    welcome: "email_enabled",
    status_change: "status_change_email",
    comment_added: "comments_email",
    reminder: "reminders_email",
    system: "news_email",
    new_submission: "email_enabled"
  };
  const prefKey = mapping[item.type] || "email_enabled";
  if (prefKey && preferences[prefKey] === false) {
    await logEmail(item, "failed", null, `preference_disabled:${prefKey}`);
    await updateQueueAfterFailure(item.id, item.attempts || 0, `preference_disabled:${prefKey}`);
    return;
  }

  // Render template and send
  const tpl = renderTemplate(item.type, item.payload || {});
  try {
    let providerResponse = null;
    if (PROVIDER === "resend") {
      providerResponse = await sendViaResend(item.recipient_email, tpl.subject, tpl.html);
    } else {
      throw new Error("Unsupported provider");
    }
    await logEmail(item, "sent", providerResponse, null);
    await updateQueueAfterSuccess(item.id);

    // If it's a welcome email and user exists, update welcome_sent_at
    if (item.type === "welcome" && item.user_id) {
      const { error } = await supabase.from("users").update({ welcome_sent_at: new Date().toISOString() }).eq("id", item.user_id);
      if (error) {
        console.error("Failed to update welcome_sent_at:", error);
      }
    }
  } catch (err: any) {
    const errText = String(err.message || err);
    console.error("Send failed for", item.recipient_email, errText);
    await logEmail(item, "failed", null, errText);
    await updateQueueAfterFailure(item.id, item.attempts || 0, errText);
  }
}

Deno.serve(async (req) => {
  try {
    // Only allow POST (triggering a run) or GET for health
    if (req.method === "GET") {
      return new Response(JSON.stringify({ 
        ok: true, 
        supabase_initialized: !!supabase,
        env_vars: {
          has_url: !!SUPABASE_URL,
          has_key: !!SUPABASE_SERVICE_ROLE_KEY,
          has_resend: !!RESEND_API_KEY
        }
      }), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Verify supabase is initialized
    if (!supabase) {
      throw new Error("Supabase client not initialized");
    }

    console.log("Starting email queue processing...");

    // Fetch queued items
    const batch = await fetchQueuedBatch();
    console.log(`Found ${batch?.length || 0} items in queue`);
    
    if (!batch || batch.length === 0) {
      return new Response(JSON.stringify({ ok: true, processed: 0 }), { 
        headers: { "Content-Type": "application/json" } 
      });
    }

    const ids = batch.map((b) => b.id);
    await markProcessing(ids);

    // Process each item sequentially (or do controlled concurrency if desired)
    for (const item of batch) {
      await checkPreferencesAndSend(item);
    }

    return new Response(JSON.stringify({ ok: true, processed: batch.length }), { 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (err: any) {
    console.error("Unhandled error in function:", err);
    const errorMessage = err?.message || String(err) || "Unknown error";
    const errorStack = err?.stack || "";
    console.error("Error details:", { errorMessage, errorStack });
    return new Response(JSON.stringify({ 
      ok: false, 
      error: errorMessage,
      stack: errorStack 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
});
