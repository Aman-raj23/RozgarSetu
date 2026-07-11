// Quick test for Brevo email sending
require("dotenv").config();

(async () => {
  const TARGET = "04freefire.squad04@gmail.com";
  console.log(`\n=== Testing Brevo email delivery to: ${TARGET} ===\n`);
  console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? "SET (length: " + process.env.BREVO_API_KEY.length + ")" : "NOT SET");
  console.log("EMAIL_USER:", process.env.EMAIL_USER || "NOT SET");

  try {
    const { sendOtpEmail } = require("./utils/sendEmail");
    await sendOtpEmail(TARGET, "123456", "Test User");
    console.log("\n✅ Email sent successfully via Brevo!");
  } catch (err) {
    console.error("\n❌ FAILED:", err.message);
  }
})();
