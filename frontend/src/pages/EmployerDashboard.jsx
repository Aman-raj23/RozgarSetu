import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [hiredCount, setHiredCount] = useState(0);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await API.get("/jobs");
      // Filter jobs posted by current user
      const myJobs = res.data.filter(
        (j) => j.employerId?._id === user?._id || j.employerId === user?._id
      );
      setJobs(myJobs);

      // Fetch workers to count how many this employer has hired
      const workersRes = await API.get("/workers");
      const hiredWorkers = workersRes.data.filter(w => w.hiredBy?.includes(user?._id));
      setHiredCount(hiredWorkers.length);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch your jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    setDeletingId(jobId);
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-900">
            {t("nav_dashboard")}
          </h1>
          <p className="mt-1 text-dark-500">
            {t("dash_manage")}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/workers"
            className="px-6 py-3 rounded-xl bg-primary-50 text-primary-700 font-bold border border-primary-200 hover:bg-primary-100 transition-all active:scale-95"
          >
            {t("dash_browse_workers")}
          </Link>
          <Link
            to="/post-job"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold shadow-lg shadow-accent-500/20 hover:from-accent-600 hover:to-accent-700 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("dash_post_new")}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="bg-white rounded-xl border border-dark-100 p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-extrabold text-dark-900">{jobs.length}</p>
          <p className="text-sm text-dark-400 font-medium">{t("dash_total")}</p>
        </div>
        <div className="bg-white rounded-xl border border-dark-100 p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-extrabold text-accent-600">
            {jobs.filter((j) => !j.isSuspicious).length}
          </p>
          <p className="text-sm text-dark-400 font-medium">{t("dash_active")}</p>
        </div>
        <div className="bg-white rounded-xl border border-dark-100 p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-extrabold text-warning-600">
            {jobs.filter((j) => j.isSuspicious).length}
          </p>
          <p className="text-sm text-dark-400 font-medium">{t("dash_flagged")}</p>
        </div>
        <div className="bg-white rounded-xl border border-dark-100 p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-extrabold text-primary-600">
            {hiredCount}
          </p>
          <p className="text-sm text-dark-400 font-medium">{t("workers_hired")}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-600 font-medium">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-dark-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="skeleton h-5 w-1/3 mb-2" />
                  <div className="skeleton h-4 w-1/4" />
                </div>
                <div className="flex gap-2">
                  <div className="skeleton h-9 w-16" />
                  <div className="skeleton h-9 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job List */}
      {!loading && jobs.length > 0 && (
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl border border-dark-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-lg font-bold text-dark-900 hover:text-primary-600 transition-colors truncate"
                    >
                      {job.title}
                    </Link>
                    {job.isSuspicious && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-warning-500/10 text-warning-600">
                        ⚠ Flagged
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-dark-400">
                    <span className="font-semibold text-accent-600">₹{job.salary?.toLocaleString("en-IN")}</span>
                    <span>•</span>
                    <span>{job.skills?.join(", ")}</span>
                    <span>•</span>
                    <span>
                      {new Date(job.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Link
                    to={`/post-job?edit=${job._id}`}
                    className="px-4 py-2 rounded-lg bg-dark-50 text-dark-600 font-semibold text-sm hover:bg-dark-100 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    disabled={deletingId === job._id}
                    className="px-4 py-2 rounded-lg bg-danger-500/10 text-danger-600 font-semibold text-sm hover:bg-danger-500/20 transition disabled:opacity-50"
                  >
                    {deletingId === job._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && !error && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary-50 flex items-center justify-center text-4xl">
            📋
          </div>
          <h3 className="text-xl font-bold text-dark-800 mb-2">{t("dash_empty_title")}</h3>
          <p className="text-dark-400 mb-6">{t("dash_empty_desc")}</p>
          <Link
            to="/post-job"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all"
          >
            {t("dash_post_first")} →
          </Link>
        </div>
      )}
    </div>
  );
}
