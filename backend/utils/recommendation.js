const haversine = require("./haversine");

/**
 * Smart Job Recommendation Engine
 *
 * Ranks jobs based on:
 * - Skill match (Jaccard similarity): weight 0.5
 * - Distance (inverse normalized): weight 0.3
 * - Salary (normalized): weight 0.2
 *
 * Returns jobs sorted by relevance score (highest first).
 */
function rankJobs(jobs, userLat, userLng, userSkills = []) {
  if (!jobs || jobs.length === 0) return [];

  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());

  // Calculate raw values
  const jobsWithMetrics = jobs.map((job) => {
    const distance = haversine(userLat, userLng, job.location.lat, job.location.lng);

    // Skill match — Jaccard similarity
    const jobSkills = (job.skills || []).map((s) => s.toLowerCase().trim());
    const intersection = normalizedUserSkills.filter((s) => jobSkills.includes(s));
    const union = new Set([...normalizedUserSkills, ...jobSkills]);
    const skillScore = union.size > 0 ? intersection.length / union.size : 0;

    let dailySalary = job.salary;
    const period = job.salaryPeriod || "day";
    if (period === "month") {
      dailySalary = job.salary / 30;
    } else if (period === "annum") {
      dailySalary = job.salary / 365;
    }

    return {
      ...job.toObject ? job.toObject() : job,
      distance: Math.round(distance * 10) / 10,
      skillScore,
      dailySalary,
    };
  });

  // Find max distance and max salary for normalization
  const maxDistance = Math.max(...jobsWithMetrics.map((j) => j.distance), 1);
  const maxSalary = Math.max(...jobsWithMetrics.map((j) => j.dailySalary), 1);

  // Calculate final score
  const rankedJobs = jobsWithMetrics.map((job) => {
    const distanceScore = 1 - job.distance / maxDistance; // closer = higher
    const salaryScore = job.dailySalary / maxSalary; // higher salary = higher

    const relevanceScore =
      job.skillScore * 0.5 +
      distanceScore * 0.3 +
      salaryScore * 0.2;

    return {
      ...job,
      distanceScore: Math.round(distanceScore * 100) / 100,
      salaryScore: Math.round(salaryScore * 100) / 100,
      relevanceScore: Math.round(relevanceScore * 100) / 100,
    };
  });

  // Sort by relevance score descending
  rankedJobs.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return rankedJobs;
}

module.exports = { rankJobs };
