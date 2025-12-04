import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { getEmailSettings, shouldSendEmail } from '../_shared/get-email-settings.ts';
import { getUserPreferences, shouldSendEmailToUser } from '../_shared/get-user-preferences.ts';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  type: 'status_change' | 'comment_added' | 'new_submission' | 'reminder' | 'system';
  userId?: string;
  submissionId?: string;
}

interface StatusChangeData {
  researcherName: string;
  referenceNumber: string;
  oldStatus: string;
  newStatus: string;
  newStatusLabel: string;
  oldStatusLabel: string;
  researchTitle?: string;
  researchType?: string;
  submissionDate?: string;
  comment?: string;
  submissionLink?: string;
}

Deno.serve(async (req: Request) => {
  let emailData: EmailData | null = null;
  let statusData: StatusChangeData | null = null;
  
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const requestBody = await req.json();
    emailData = requestBody.emailData;
    statusData = requestBody.statusData;

    if (!emailData || !emailData.to || !emailData.subject) {
      return new Response(
        JSON.stringify({ error: 'Missing required email data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Check email settings from platform_settings table (Master Switch)
    const emailSettings = await getEmailSettings(supabaseClient);
    
    // Check if email should be sent based on platform settings
    if (!shouldSendEmail(emailSettings, emailData.type)) {
      console.log(`Email not sent: ${emailData.type} is disabled in platform settings`);
      
      // Log that email was skipped due to platform settings
      await supabaseClient
        .from('email_log')
        .insert([{
          user_id: emailData.userId || null,
          email_type: emailData.type,
          recipient_email: emailData.to,
          subject: emailData.subject,
          status: 'failed',
          error_message: `Email disabled in platform settings for type: ${emailData.type}`,
        }]);

      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Email notifications are disabled for type: ${emailData.type} in platform settings`,
          skipped: true 
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Step 2: Check user preferences if userId is provided
    if (emailData.userId) {
      const userPreferences = await getUserPreferences(supabaseClient, emailData.userId);
      
      // Check if email should be sent based on user preferences
      if (!shouldSendEmailToUser(userPreferences, emailData.type)) {
        console.log(`Email not sent: ${emailData.type} is disabled in user preferences for user ${emailData.userId}`);
        
        // Log that email was skipped due to user preferences
        await supabaseClient
          .from('email_log')
          .insert([{
            user_id: emailData.userId,
            email_type: emailData.type,
            recipient_email: emailData.to,
            subject: emailData.subject,
            status: 'failed',
            error_message: `Email disabled in user preferences for type: ${emailData.type}`,
          }]);

        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Email notifications are disabled in user preferences for type: ${emailData.type}`,
            skipped: true 
          }),
          { 
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    }

    // Generate HTML email based on type
    let htmlContent = emailData.html;
    
    if (emailData.type === 'status_change' && statusData) {
      htmlContent = generateStatusChangeEmail(statusData);
    }

    // Log email to database
    const { error: logError } = await supabaseClient
      .from('email_log')
      .insert([{
        user_id: emailData.userId || null,
        email_type: emailData.type,
        recipient_email: emailData.to,
        subject: emailData.subject,
        status: 'queued',
      }]);

    // Get email service configuration
    const emailProvider = Deno.env.get('EMAIL_PROVIDER') || 'smtp'; // 'resend', 'sendgrid', or 'smtp'
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'noreply@arabresearch.com';
    const fromName = Deno.env.get('FROM_NAME') || 'منصة نشر الأبحاث العربية';
    
    // SMTP configuration
    const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.resend.com';
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '465');
    const smtpUser = Deno.env.get('SMTP_USER') || 'resend';
    const smtpPassword = Deno.env.get('SMTP_PASSWORD') || resendApiKey;

    let emailSent = false;
    let errorMessage: string | null = null;

    // Send email using Resend (recommended)
    if (emailProvider === 'resend' && resendApiKey) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: `${fromName} <${fromEmail}>`,
            to: [emailData.to],
            subject: emailData.subject,
            html: htmlContent,
          }),
        });

        const resendData = await resendResponse.json();

        if (resendResponse.ok && resendData.id) {
          emailSent = true;
          console.log('Email sent via Resend:', resendData.id);
        } else {
          errorMessage = resendData.message || 'Failed to send email via Resend';
          console.error('Resend error:', resendData);
        }
      } catch (error) {
        errorMessage = error.message;
        console.error('Resend exception:', error);
      }
    }
    // Send email using SendGrid
    else if (emailProvider === 'sendgrid' && sendgridApiKey) {
      try {
        const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sendgridApiKey}`,
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: emailData.to }],
            }],
            from: {
              email: fromEmail,
              name: fromName,
            },
            subject: emailData.subject,
            content: [{
              type: 'text/html',
              value: htmlContent,
            }],
          }),
        });

        if (sendgridResponse.ok) {
          emailSent = true;
          console.log('Email sent via SendGrid');
        } else {
          const errorText = await sendgridResponse.text();
          errorMessage = errorText || 'Failed to send email via SendGrid';
          console.error('SendGrid error:', errorText);
        }
      } catch (error: any) {
        errorMessage = error?.message || String(error) || 'SendGrid exception occurred';
        console.error('SendGrid exception:', error);
      }
    }
    // Send email using SMTP
    else if (emailProvider === 'smtp' && smtpPassword) {
      try {
        // For Resend SMTP, use the API with SMTP credentials
        // This works because Resend's API key is the same as SMTP password
        if (smtpHost === 'smtp.resend.com') {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${smtpPassword}`,
            },
            body: JSON.stringify({
              from: `${fromName} <${fromEmail}>`,
              to: [emailData.to],
              subject: emailData.subject,
              html: htmlContent,
            }),
          });

          const resendData = await resendResponse.json();

          if (resendResponse.ok && resendData.id) {
            emailSent = true;
            console.log('Email sent via SMTP (Resend API):', resendData.id);
          } else {
            errorMessage = resendData.message || 'Failed to send email via SMTP';
            console.error('SMTP (Resend) error:', resendData);
          }
        } else {
          // For other SMTP providers, you would need to implement proper SMTP protocol
          // Since Deno Edge Functions have limitations with raw TCP/TLS,
          // it's recommended to configure SMTP in Supabase Dashboard > Settings > Auth > SMTP Settings
          console.warn('Custom SMTP hosts require configuration in Supabase Dashboard > Settings > Auth > SMTP Settings');
          errorMessage = 'SMTP configuration required in Supabase Dashboard';
        }
      } catch (error: any) {
        errorMessage = error?.message || String(error) || 'SMTP exception occurred';
        console.error('SMTP exception:', error);
      }
    }
    // Fallback: Log only (for development/testing)
    else {
      console.warn('Email service not configured. Email logged but not sent.');
      console.log('To enable email sending, set:');
      console.log('- EMAIL_PROVIDER=resend and RESEND_API_KEY=your_key');
      console.log('- OR EMAIL_PROVIDER=sendgrid and SENDGRID_API_KEY=your_key');
      console.log('- OR EMAIL_PROVIDER=smtp and SMTP_PASSWORD=your_key (with SMTP_HOST, SMTP_PORT, SMTP_USER)');
    }

    // Update email log
    await supabaseClient
      .from('email_log')
      .update({ 
        status: emailSent ? 'sent' : (errorMessage ? 'failed' : 'queued'),
        sent_at: emailSent ? new Date().toISOString() : null,
        error_message: errorMessage || null,
      })
      .eq('recipient_email', emailData.to)
      .order('created_at', { ascending: false })
      .limit(1);

    if (emailSent) {
      return new Response(
        JSON.stringify({ success: true, message: 'Email sent successfully' }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } else if (errorMessage) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: errorMessage,
          message: 'Email service configured but sending failed. Check logs for details.',
        }),
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email queued. Configure email service (Resend/SendGrid) to send emails.',
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

  } catch (error: any) {
    console.error('Error sending email:', error);
    
    // Log failure
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      
      // Use emailData from outer scope
      const recipientEmail = (emailData as EmailData | null)?.to || 'unknown';
      
      await supabaseClient
        .from('email_log')
        .update({ 
          status: 'failed',
          error_message: error?.message || String(error) || 'Unknown error'
        })
        .eq('recipient_email', recipientEmail)
        .order('created_at', { ascending: false })
        .limit(1);
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error?.message || String(error) || 'Unknown error',
        message: 'Failed to send email'
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});

function generateStatusChangeEmail(data: StatusChangeData): string {
  const statusColors: Record<string, string> = {
    'pending': '#FFA500',
    'approved': '#28A745',
    'rejected': '#DC3545',
    'needs_revision': '#007BFF',
    'draft': '#6C757D',
  };

  const statusIcons: Record<string, string> = {
    'pending': '⏳',
    'approved': '✅',
    'rejected': '❌',
    'needs_revision': '📝',
    'draft': '📄',
  };

  const statusColor = statusColors[data.newStatus] || '#6C757D';
  const statusIcon = statusIcons[data.newStatus] || '📄';
  const isApproved = data.newStatus === 'approved';
  const needsRevision = data.newStatus === 'needs_revision';
  const isRejected = data.newStatus === 'rejected';

  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تحديث حالة البحث</title>
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
      background: ${statusColor};
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 40px 30px;
    }
    .status-badge {
      display: inline-block;
      background-color: ${statusColor};
      color: white;
      padding: 10px 20px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 18px;
    }
    .status-icon {
      font-size: 60px;
      text-align: center;
      margin: 20px 0;
    }
    .info-box {
      background-color: #f8f9fa;
      border-right: 4px solid ${statusColor};
      padding: 20px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background-color: ${statusColor};
      color: white;
      text-decoration: none;
      padding: 15px 40px;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>تحديث حالة البحث</h1>
    </div>
    
    <div class="content">
      <div class="status-icon">${statusIcon}</div>
      
      <h2>عزيزي ${data.researcherName}،</h2>
      
      <p>تم تحديث حالة بحثك (رقم المرجع: <strong>${data.referenceNumber}</strong>)</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <span class="status-badge">${data.newStatusLabel}</span>
      </div>
      
      ${data.comment ? `<div class="info-box">
        <h3>💬 ملاحظات المراجع:</h3>
        <p>${data.comment}</p>
      </div>` : ''}
      
      <h3>📋 تفاصيل البحث:</h3>
      <ul>
        ${data.researchTitle ? `<li><strong>العنوان:</strong> ${data.researchTitle}</li>` : ''}
        ${data.researchType ? `<li><strong>النوع:</strong> ${data.researchType}</li>` : ''}
        ${data.submissionDate ? `<li><strong>تاريخ التقديم:</strong> ${data.submissionDate}</li>` : ''}
        <li><strong>الحالة السابقة:</strong> ${data.oldStatusLabel}</li>
        <li><strong>الحالة الجديدة:</strong> ${data.newStatusLabel}</li>
      </ul>
      
      ${isApproved ? `<div style="background-color: #e7f5e9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #28a745; margin-top: 0;">🎉 تهانينا!</h3>
        <p>تم قبول بحثك للنشر. سيتم التواصل معك قريباً بشأن خطوات النشر.</p>
      </div>` : ''}
      
      ${needsRevision ? `<div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #856404; margin-top: 0;">⚠️ مطلوب مراجعة</h3>
        <p>يرجى مراجعة الملاحظات أعلاه وإجراء التعديلات المطلوبة، ثم إعادة التقديم.</p>
      </div>` : ''}
      
      ${isRejected ? `<div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #721c24; margin-top: 0;">❌ عذراً</h3>
        <p>للأسف، لم يتم قبول البحث حالياً. يمكنك مراجعة الملاحظات والتقديم مرة أخرى بعد إجراء التحسينات.</p>
      </div>` : ''}
      
      ${data.submissionLink ? `<div style="text-align: center;">
        <a href="${data.submissionLink}" class="button">عرض التفاصيل</a>
      </div>` : ''}
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p>إذا كان لديك أي استفسارات، لا تتردد في التواصل معنا.</p>
      
      <p>مع أطيب التحيات،<br><strong>فريق منصة نشر الأبحاث العربية</strong></p>
    </div>
    
    <div class="footer">
      <p>© 2025 منصة نشر الأبحاث العربية. جميع الحقوق محفوظة.</p>
      <p>support@res-assistant.com</p>
    </div>
  </div>
</body>
</html>
  `;
}

