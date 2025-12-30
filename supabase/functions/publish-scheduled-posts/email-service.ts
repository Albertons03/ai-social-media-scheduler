/**
 * Email notification service using Resend
 * Sends email notifications when posts are published or fail
 */

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_EMAIL = "onboarding@resend.dev";
const APP_URL = "https://landingbits.net";

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email via Resend API
 */
async function sendEmail(data: EmailData): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email notification");
    return false;
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: data.to,
        subject: data.subject,
        html: data.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return false;
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Generate success email HTML
 */
function generateSuccessEmailHTML(
  platform: string,
  postContent: string,
  postId: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; }
    .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
    .post-preview { background: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .platform-badge { display: inline-block; background: #667eea; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 10px 0; }
    .button { display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Post Published Successfully!</h1>
    </div>
    <div class="content">
      <div class="success-icon">🎉</div>
      <p>Great news! Your scheduled post has been successfully published to <strong>${platform}</strong>.</p>

      <div class="post-preview">
        <span class="platform-badge">${platform}</span>
        <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${postContent.substring(
          0,
          200
        )}${postContent.length > 200 ? "..." : ""}</p>
      </div>

      <p>Your content is now live and reaching your audience! 🚀</p>

      <div style="text-align: center;">
        <a href="${APP_URL}/dashboard" class="button">View Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>© 2025 TikTok Scheduler | <a href="${APP_URL}" style="color: #667eea;">landingbits.net</a></p>
      <p style="font-size: 12px; color: #999;">This is an automated notification. You can manage your notification settings in your dashboard.</p>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generate failure email HTML
 */
function generateFailureEmailHTML(
  platform: string,
  postContent: string,
  errorMessage: string,
  postId: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #f56565 0%, #c53030 100%); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; }
    .error-icon { font-size: 48px; text-align: center; margin: 20px 0; }
    .post-preview { background: #fff5f5; border-left: 4px solid #f56565; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .error-box { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .platform-badge { display: inline-block; background: #f56565; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 10px 0; }
    .button { display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; margin: 20px 0; font-weight: 600; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
    .action-list { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .action-list li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>❌ Post Publishing Failed</h1>
    </div>
    <div class="content">
      <div class="error-icon">⚠️</div>
      <p>Your scheduled post could not be published to <strong>${platform}</strong>.</p>

      <div class="post-preview">
        <span class="platform-badge">${platform}</span>
        <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${postContent.substring(
          0,
          200
        )}${postContent.length > 200 ? "..." : ""}</p>
      </div>

      <div class="error-box">
        <strong>Error Details:</strong>
        <p style="margin: 10px 0 0 0; color: #c53030; font-family: monospace; font-size: 14px;">${errorMessage}</p>
      </div>

      <p><strong>What to do next:</strong></p>
      <div class="action-list">
        <ul>
          <li>Check if your ${platform} account is still connected</li>
          <li>Verify your post content meets ${platform}'s requirements</li>
          <li>Try rescheduling the post</li>
          <li>Contact support if the issue persists</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="${APP_URL}/dashboard" class="button">Go to Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>© 2025 TikTok Scheduler | <a href="${APP_URL}" style="color: #667eea;">landingbits.net</a></p>
      <p style="font-size: 12px; color: #999;">This is an automated notification. You can manage your notification settings in your dashboard.</p>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Send success notification email
 */
export async function sendSuccessEmail(
  userEmail: string,
  platform: string,
  postContent: string,
  postId: string
): Promise<void> {
  const html = generateSuccessEmailHTML(platform, postContent, postId);

  await sendEmail({
    to: userEmail,
    subject: `✅ Your ${platform} post was published successfully`,
    html,
  });

  console.log(
    `Success email sent to ${userEmail} for ${platform} post ${postId}`
  );
}

/**
 * Send failure notification email
 */
export async function sendFailureEmail(
  userEmail: string,
  platform: string,
  postContent: string,
  errorMessage: string,
  postId: string
): Promise<void> {
  const html = generateFailureEmailHTML(
    platform,
    postContent,
    errorMessage,
    postId
  );

  await sendEmail({
    to: userEmail,
    subject: `❌ Failed to publish your ${platform} post`,
    html,
  });

  console.log(
    `Failure email sent to ${userEmail} for ${platform} post ${postId}`
  );
}
