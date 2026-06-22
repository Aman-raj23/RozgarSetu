// Test sending to an external email address
require("dotenv").config();
const nodemailer = require("nodemailer");

(async () => {
  const TARGET = "04freefire.squad04@gmail.com";
  console.log(`\n=== Testing email delivery to: ${TARGET} ===\n`);

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ SMTP verified");

    const info = await transporter.sendMail({
      from: `"RozgarSetu" <${process.env.EMAIL_USER}>`,
      to: TARGET,
      subject: "🔐 RozgarSetu — Test OTP: 123456",
      html: `
        <div style="font-family: Arial; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2>Test OTP Email</h2>
          <p>If you see this email, delivery to <strong>${TARGET}</strong> is working.</p>
          <p style="font-size: 32px; font-weight: bold; text-align: center; padding: 20px; background: #fef3c7; border-radius: 8px;">123456</p>
          <p style="color: gray; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully!");
    console.log("   MessageId:", info.messageId);
    console.log("   Accepted:", info.accepted);
    console.log("   Rejected:", info.rejected);
    console.log("   Response:", info.response);
    console.log("\n📬 Check inbox AND spam folder of:", TARGET);
  } catch (err) {
    console.error("❌ FAILED:", err.message);
    console.error("   Code:", err.code);
    console.error("   Response:", err.response);
    console.error(err);
  }
})();
