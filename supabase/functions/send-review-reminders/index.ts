import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

type Json = Record<string, unknown>;

// Basic config
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// Safety limits
const MAX_REMINDERS_PER_RUN = Number(Deno.env.get("MAX_REVIEW_REMINDERS_PER_RUN") || "50");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for send-review-reminders function.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Helper: read integer setting from platform_settings table with a fallback.
 */
async function getNumberSetting(key: string, fallback: number): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("platform_settings")
      .select("setting_value, setting_type")
      .eq("setting_key", key)
      .maybeSingle();

    if (error || !data) return fallback;

    const raw = String(data.setting_value ?? "").trim();
    const num = Number(raw);
    return Number.isFinite(num) && num > 0 ? num : fallback;
  } catch {
    return fallback;
  }
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

async function findNeedsRevisionSubmissions(thresholdIso: string) {
  const { data, error } = await supabase
    .from("submissions")
    .select("id, user_id, email, full_name, main_researcher, reference_number, status, updated_at")
    .eq("status", "needs_revision")
    .eq("is_draft", false)
    .lte("updated_at", thresholdIso)
    .order("updated_at", { ascending: true })
    .limit(MAX_REMINDERS_PER_RUN);

  if (error) {
    console.error("Error fetching needs_revision submissions:", error);
    throw error;
  }

  return (data || []) as Array<{
    id: string;
    user_id: string;
    email: string;
    full_name: string;
    main_researcher: string | null;
    reference_number: string | null;
    status: string;
    updated_at: string;
  }>;
}

async function hasRecentReminder(userId: string, submissionId: string, sinceIso: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("notifications")
    .select("id")
    .eq("user_id", userId)
    .eq("submission_id", submissionId)
    .eq("type", "reminder")
    .gte("created_at", sinceIso)
    .limit(1)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking recent reminder:", error);
  }

  return Boolean(data?.id);
}

async function createInAppReminder(userId: string, submissionId: string, message: string) {
  const { error } = await supabase.from("notifications").insert([
    {
      user_id: userId,
      submission_id: submissionId,
      type: "reminder",
      message,
    },
  ]);

  if (error) {
    console.error("Error inserting reminder notification:", error);
  }
}

async function sendEmailReminder(
  to: string,
  userId: string,
  submissionId: string,
  subject: string,
  html: string
) {
  try {
    const { error } = await supabase.functions.invoke("send-notification-email", {
      body: {
        emailData: {
          to,
          subject,
          html,
          type: "reminder",
          userId,
          submissionId,
        },
      },
    });

    if (error) {
      console.error("Error invoking send-notification-email for reminder:", error);
    }
  } catch (err) {
    console.error("Exception while invoking send-notification-email:", err);
  }
}

async function processNeedsRevisionReminders() {
  // عدد الأيام قبل إرسال أول تذكير (افتراضي 7 أيام)
  const remindAfterDays = await getNumberSetting("needs_revision_reminder_days", 7);
  // عدد الأيام لمنع التذكير المتكرر لنفس الطلب (افتراضي 3 أيام)
  const coolDownDays = await getNumberSetting("needs_revision_reminder_cooldown_days", 3);

  const thresholdIso = daysAgo(remindAfterDays);
  const cooldownIso = daysAgo(coolDownDays);

  const submissions = await findNeedsRevisionSubmissions(thresholdIso);
  const results: Json[] = [];

  for (const s of submissions) {
    if (!s.user_id) continue;

    const alreadyReminded = await hasRecentReminder(s.user_id, s.id, cooldownIso);
    if (alreadyReminded) {
      results.push({
        submission_id: s.id,
        status: "skipped_recent_reminder",
      });
      continue;
    }

    const displayName = s.full_name || s.main_researcher || "الباحث";
    const ref = s.reference_number || s.id.slice(0, 8).toUpperCase();

    const message =
      `تذكير: ما زال طلبك البحثي رقم المرجع ${ref} في حالة "يحتاج مراجعة". ` +
      `يرجى مراجعة ملاحظات الإدارة وإعادة التقديم بعد إجراء التعديلات المطلوبة.`;

    await createInAppReminder(s.user_id, s.id, message);

    if (s.email) {
      const subject = `تذكير بمراجعة طلبك البحثي - المرجع ${ref}`;
      const html = `
        <p>السلام عليكم <strong>${displayName}</strong>,</p>
        <p>
          هذا تذكير بأن طلبك البحثي رقم المرجع <strong>${ref}</strong> ما زال في حالة
          <strong>"يحتاج مراجعة"</strong>.
        </p>
        <p>
          نرجو منك مراجعة ملاحظات الإدارة على الطلب في المنصة، وإجراء التعديلات اللازمة ثم إعادة التقديم
          (أو تقديم طلب جديد محدث) وفق التعليمات.
        </p>
        <p>مع أطيب التحيات،<br />فريق منصة نشر الأبحاث العربية</p>
      `;

      await sendEmailReminder(s.email, s.user_id, s.id, subject, html);
    }

    results.push({
      submission_id: s.id,
      status: "reminder_sent",
    });
  }

  return results;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "GET") {
      return new Response(
        JSON.stringify({
          ok: true,
          message: "send-review-reminders function is healthy.",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const results = await processNeedsRevisionReminders();

    return new Response(
      JSON.stringify({
        ok: true,
        processed: results.length,
        details: results,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Error in send-review-reminders function:", err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: err?.message || String(err) || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});


