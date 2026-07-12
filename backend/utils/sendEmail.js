/**
 * Send OTP verification email using Brevo (formerly Sendinblue) HTTP API.
 * Works on Render free tier because it uses HTTPS (port 443) instead of SMTP (port 465/587).
 */

/**
 * Send OTP verification email
 * @param {string} to - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} userName - User's name for personalization
 */
const sendOtpEmail = async (to, otp, userName = "User") => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER;

  if (!apiKey) {
    throw new Error("BREVO_NOT_CONFIGURED: BREVO_API_KEY environment variable is missing on the server.");
  }

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #ee7a14, #f59e0b); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
          RozgarSetu
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">
          Connecting Workers & Employers Across Bharat
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 32px 24px;">
        <p style="color: #374151; font-size: 16px; margin: 0 0 8px;">
          Hello <strong>${userName}</strong>,
        </p>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
          Thank you for registering on RozgarSetu! Please use the verification code below to complete your registration:
        </p>

        <!-- OTP Box -->
        <div style="text-align: center; margin: 24px 0;">
          <div style="display: inline-block; background: #fef3c7; border: 2px dashed #f59e0b; border-radius: 12px; padding: 16px 40px;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #92400e; font-family: 'Courier New', monospace;">
              ${otp}
            </span>
          </div>
        </div>

        <p style="color: #ef4444; font-size: 13px; text-align: center; margin: 16px 0 0;">
          This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          If you didn't request this, please ignore this email.
        </p>
        <p style="color: #9ca3af; font-size: 11px; margin: 8px 0 0;">
          © ${new Date().getFullYear()} RozgarSetu. All rights reserved.
        </p>
      </div>
    </div>
  `;

  const payload = {
    sender: { name: "RozgarSetu", email: senderEmail },
    to: [{ email: to, name: userName }],
    subject: "RozgarSetu - Email Verification OTP",
    htmlContent,
  };

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Brevo API error:", data);
    throw new Error(`BREVO_ERROR: ${data.message || JSON.stringify(data)}`);
  }

  console.log("OTP email sent to:", to, "| Brevo messageId:", data.messageId);
};

module.exports = { sendOtpEmail };
