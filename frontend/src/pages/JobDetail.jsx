import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { getLocationName } from "../utils/geocode";

export default function JobDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [askingPrice, setAskingPrice] = useState(null);
  const [error, setError] = useState("");
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Resolve location name when job loads
  useEffect(() => {
    if (job?.location?.lat && job?.location?.lng) {
      getLocationName(job.location.lat, job.location.lng).then((name) => {
        if (name) setLocationName(name);
      });
    }
  }, [job]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl p-8 border border-dark-100">
          <div className="skeleton h-8 w-3/4 mb-4" />
          <div className="skeleton h-10 w-1/3 mb-6" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-full mb-2" />
          <div className="skeleton h-4 w-2/3 mb-6" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-danger-500/10 flex items-center justify-center text-4xl">
            ❌
          </div>
          <h3 className="text-xl font-bold text-dark-800 mb-2">{error}</h3>
          <Link to="/jobs" className="text-primary-600 font-semibold hover:underline">
            ← {t("detail_back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-dark-500 hover:text-primary-600 font-medium mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t("detail_back")}
      </Link>

      <div className="bg-white rounded-2xl shadow-lg border border-dark-100 overflow-hidden">
        {/* Header gradient */}
        <div className="h-2 bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500" />

        <div className="p-6 sm:p-8">
          {/* Suspicious Warning */}
          {job.isSuspicious && (
            <div className="mb-6 p-4 rounded-xl bg-warning-500/10 border border-warning-500/20">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-warning-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-warning-700">{t("detail_flagged")}</p>
                  <ul className="mt-1 space-y-1">
                    {job.suspiciousReasons?.map((r, i) => (
                      <li key={i} className="text-sm text-warning-600">• {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900 leading-tight">
            {job.title}
          </h1>

          {/* Payment */}
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-accent-600">
              ₹{job.salary?.toLocaleString("en-IN")}
            </span>
            <span className="text-dark-400 font-medium">{t("card_offered")}</span>
          </div>

          {/* Worker: Price negotiation */}
          {user?.role === "worker" && (() => {
            const salary = job.salary || 0;
            const price = askingPrice ?? salary;
            const step = salary >= 1000 ? 100 : 50;
            const priceChanged = price !== salary;
            return (
              <div className="mt-4 p-4 rounded-xl bg-primary-50/60 border border-primary-100">
                <p className="text-sm font-bold text-primary-700 mb-3">{t("card_negotiate")}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAskingPrice(Math.max(step, price - step))}
                    className="w-12 h-12 rounded-xl bg-white border-2 border-dark-200 text-dark-600 font-bold text-2xl flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-600 active:scale-90 transition-all shadow-sm"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className={`text-3xl font-extrabold ${priceChanged ? "text-primary-600" : "text-accent-600"}`}>
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    {priceChanged && (
                      <p className="text-xs text-dark-400 mt-1">
                        {price > salary ? "+" : ""}₹{(price - salary).toLocaleString("en-IN")} vs {t("card_offered")}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setAskingPrice(price + step)}
                    className="w-12 h-12 rounded-xl bg-white border-2 border-dark-200 text-dark-600 font-bold text-2xl flex items-center justify-center hover:bg-green-50 hover:border-green-300 hover:text-green-600 active:scale-90 transition-all shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mt-5">
            {job.skills?.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary-50 text-primary-700 border border-primary-100"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-dark-800 mb-2">{t("detail_description")}</h2>
            <p className="text-dark-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {/* Location */}
            <div className="p-4 rounded-xl bg-dark-50 border border-dark-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-dark-400 font-medium">{t("detail_location")}</p>
                  <p className="text-sm font-semibold text-dark-700">
                    {locationName || `${job.location?.lat?.toFixed(4)}, ${job.location?.lng?.toFixed(4)}`}
                  </p>
                  {job.distance !== undefined && (
                    <p className="text-xs text-accent-600 font-semibold mt-0.5">
                      {job.distance} {t("detail_km_away")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Posted Date */}
            <div className="p-4 rounded-xl bg-dark-50 border border-dark-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-dark-400 font-medium">{t("detail_posted")}</p>
                  <p className="text-sm font-semibold text-dark-700">
                    {new Date(job.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Employer Info */}
          {job.employerId && (
            <div className="mt-6 p-4 rounded-xl bg-primary-50/50 border border-primary-100">
              <h3 className="text-sm font-bold text-dark-700 mb-2">{t("detail_posted_by")}</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {job.employerId.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-dark-800">{job.employerId.name}</p>
                  <p className="text-sm text-dark-400">{job.employerId.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Call Button */}
          <div className="mt-8">
            <a
              href={`tel:${job.phone}`}
              className="flex items-center justify-center gap-3 w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold text-lg sm:text-xl shadow-xl shadow-accent-500/25 hover:shadow-2xl hover:from-accent-600 hover:to-accent-700 active:scale-[0.98] transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {askingPrice && askingPrice !== job.salary
                ? `${t("card_call_with_price")} ₹${askingPrice.toLocaleString("en-IN")} — ${job.phone}`
                : `${t("detail_call_employer")} — ${job.phone}`}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
