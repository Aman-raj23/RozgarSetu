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
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in-up">
        <div>
          <h1 className="font-display-md md:font-display-lg font-bold text-primary">
            {t("nav_dashboard")}
          </h1>
          <p className="font-body-lg text-on-surface-variant mt-1">
            {t("dash_manage")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <Link
            to="/workers"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-12 rounded-lg bg-surface-container-lowest border-2 border-primary text-primary font-label-lg font-bold hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-lg">groups</span>
            {t("dash_browse_workers")}
          </Link>
          <Link
            to="/post-job"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 h-12 rounded-lg bg-primary hover:brightness-95 text-on-primary font-label-lg font-bold shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            {t("dash_post_new")}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col items-start gap-1">
          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-1">
            <span className="material-symbols-outlined icon-fill">work</span>
          </div>
          <p className="font-display-sm font-bold text-primary">{jobs.length}</p>
          <p className="font-label-md text-on-surface-variant">{t("dash_total")}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col items-start gap-1">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-1">
            <span className="material-symbols-outlined icon-fill">check_circle</span>
          </div>
          <p className="font-display-sm font-bold text-secondary">
            {jobs.filter((j) => !j.isSuspicious).length}
          </p>
          <p className="font-label-md text-on-surface-variant">{t("dash_active")}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col items-start gap-1">
          <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center mb-1">
            <span className="material-symbols-outlined icon-fill">warning</span>
          </div>
          <p className="font-display-sm font-bold text-error">
            {jobs.filter((j) => j.isSuspicious).length}
          </p>
          <p className="font-label-md text-on-surface-variant">{t("dash_flagged")}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 flex flex-col items-start gap-1">
          <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center mb-1 p-1.5">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded" />
          </div>
          <p className="font-display-sm font-bold text-tertiary">
            {hiredCount}
          </p>
          <p className="font-label-md text-on-surface-variant">{t("workers_hired")}</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-error-container border border-error/20 text-error font-body-md flex items-center gap-2">
          <span className="material-symbols-outlined text-xl">error</span>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 shadow-sm flex items-center justify-between">
              <div className="flex-1">
                <div className="skeleton h-5 w-1/3 mb-2" />
                <div className="skeleton h-4 w-1/4" />
              </div>
              <div className="flex gap-2">
                <div className="skeleton h-10 w-20 rounded-lg" />
                <div className="skeleton h-10 w-20 rounded-lg" />
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
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="font-headline-sm font-bold text-primary group-hover:underline transition-colors truncate"
                  >
                    {job.title}
                  </Link>
                  {job.isSuspicious && (
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full font-label-sm font-semibold bg-error-container text-error flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">warning</span> Flagged
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 font-body-sm text-on-surface-variant">
                  <span className="font-bold text-secondary flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-sm">payments</span>
                    ₹{job.salary?.toLocaleString("en-IN")} / {t(`period_${job.salaryPeriod || "day"}`)}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">work</span>
                    {job.skills?.slice(0, 2).join(", ")}
                    {job.skills?.length > 2 ? ` +${job.skills.length - 2}` : ""}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {new Date(job.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0 w-full md:w-auto">
                <Link
                  to={`/post-job?edit=${job._id}`}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 h-10 rounded-lg bg-surface-container text-on-surface font-label-md font-bold hover:bg-surface-container-highest transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job._id)}
                  disabled={deletingId === job._id}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 h-10 rounded-lg bg-error-container text-error font-label-md font-bold hover:brightness-95 transition-all disabled:opacity-50"
                >
                  {deletingId === job._id ? (
                    <span className="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && jobs.length === 0 && !error && (
        <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-outline-variant/30 border-dashed animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl icon-fill">assignment</span>
          </div>
          <h3 className="font-headline-sm font-bold text-primary mb-2">{t("dash_empty_title")}</h3>
          <p className="font-body-md text-on-surface-variant mb-6 max-w-md mx-auto">{t("dash_empty_desc")}</p>
          <Link
            to="/post-job"
            className="inline-flex items-center gap-2 px-6 h-12 rounded-lg bg-primary text-on-primary font-label-lg font-bold hover:brightness-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">add</span>
            {t("dash_post_first")}
          </Link>
        </div>
      )}
    </div>
  );
}
