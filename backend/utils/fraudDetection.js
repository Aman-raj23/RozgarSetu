/**
 * Fraud Detection System
 *
 * Flags jobs as suspicious based on:
 * - Salary too low (< ₹100/day) or too high (> ₹50,000/day)
 * - Description missing or too short (< 20 chars)
 * - Missing phone number
 * - Suspicious keywords in title
 */

const SUSPICIOUS_KEYWORDS = [
  "lottery", "free money", "no work", "guaranteed income",
  "mlm", "pyramid", "easy cash", "click here",
  "earn from home without work", "lakhs per day",
];

const MIN_SALARY = 100;
const MAX_SALARY = 50000;
const MIN_DESCRIPTION_LENGTH = 20;

function detectFraud(jobData) {
  const reasons = [];

  const period = jobData.salaryPeriod || "day";
  let dailyEquivalent = jobData.salary;
  if (period === "month") {
    dailyEquivalent = jobData.salary / 30;
  } else if (period === "annum") {
    dailyEquivalent = jobData.salary / 365;
  }

  // Check salary
  if (dailyEquivalent < MIN_SALARY) {
    reasons.push(`Salary ₹${jobData.salary}/${period} is unrealistically low (minimum expected: ₹${MIN_SALARY}/day equivalent)`);
  }
  if (dailyEquivalent > MAX_SALARY) {
    reasons.push(`Salary ₹${jobData.salary}/${period} is unrealistically high (maximum expected: ₹${MAX_SALARY}/day equivalent)`);
  }

  // Check description
  if (!jobData.description || jobData.description.trim().length < MIN_DESCRIPTION_LENGTH) {
    reasons.push(`Description is too short or missing (minimum ${MIN_DESCRIPTION_LENGTH} characters)`);
  }

  // Check phone
  if (!jobData.phone || jobData.phone.trim().length === 0) {
    reasons.push("Phone number is missing");
  }

  // Check suspicious keywords in title
  if (jobData.title) {
    const lowerTitle = jobData.title.toLowerCase();
    const foundKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => lowerTitle.includes(kw));
    if (foundKeywords.length > 0) {
      reasons.push(`Title contains suspicious keywords: ${foundKeywords.join(", ")}`);
    }
  }

  return {
    isSuspicious: reasons.length > 0,
    suspiciousReasons: reasons,
  };
}

module.exports = { detectFraud };
