import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function JobCard({ job, index = 0 }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    _id,
    title,
    salary,
    skills = [],
    distance,
    phone,
    isSuspicious,
    relevanceScore,
    createdAt,
  } = job;

  const isWorker = user?.role === "worker";
  const step = salary >= 1000 ? 100 : 50;

  // OLX-style price negotiation state (only for workers)
  const [askingPrice, setAskingPrice] = useState(salary);
  const [showNegotiate, setShowNegotiate] = useState(false);

  const priceChanged = askingPrice !== salary;

  const increasePrice = () => setAskingPrice((p) => p + step);
  const decreasePrice = () =>
    setAskingPrice((p) => Math.max(step, p - step));

  const timeAgo = getTimeAgo(createdAt, t);

  return (
    <article
      className="group relative bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-surface-variant hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-tertiary-fixed opacity-20 rounded-bl-full transition-transform group-hover:scale-110" />

      {/* Suspicious Badge */}
      {isSuspicious && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-error-container text-on-error-container">
            <span className="material-symbols-outlined text-sm">warning</span>
            {t("card_suspicious")}
          </span>
        </div>
      )}

      {/* Header: Icon + Title + Bookmark */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[28px]">work</span>
          </div>
          <div>
            <Link to={`/jobs/${_id}`}>
              <h3 className="font-semibold text-xl text-primary mb-0.5 leading-tight line-clamp-2 hover:underline">
                {title}
              </h3>
            </Link>
            <p className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {timeAgo}
            </p>
          </div>
        </div>
      </div>

      {/* Salary & Distance */}
      <div className="flex items-center gap-4 my-3 text-sm font-semibold">
        <div className="flex items-center gap-1 text-secondary font-bold">
          <span className="material-symbols-outlined text-[20px]">currency_rupee</span>
          ₹{salary?.toLocaleString("en-IN")} / {t(`period_${job.salaryPeriod || "day"}`)}
        </div>
        {distance !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
            distance > 15
              ? "text-error bg-error-container"
              : "text-on-surface-variant bg-surface-container-low"
          }`}>
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            {distance} {t("card_km")}
          </div>
        )}
        {relevanceScore !== undefined && (
          <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
            {Math.round(relevanceScore * 100)}% {t("card_match")}
          </span>
        )}
      </div>

      {/* Worker: OLX-style price negotiation */}
      {isWorker && (
        <div className="my-3">
          {!showNegotiate ? (
            <button
              onClick={() => setShowNegotiate(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary-fixed/30 border border-primary-fixed hover:bg-primary-fixed/50 transition-all"
            >
              <span className="material-symbols-outlined text-sm">payments</span>
              {t("card_negotiate")}
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-primary-fixed/20 border border-primary-fixed animate-fade-in">
              <p className="text-xs font-semibold text-primary mb-2">{t("card_your_price")}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreasePrice}
                  className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface-variant font-bold text-xl flex items-center justify-center hover:bg-error-container hover:text-error active:scale-90 transition-all shadow-sm"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <span className={`text-2xl font-extrabold ${priceChanged ? "text-primary" : "text-secondary"}`}>
                    ₹{askingPrice?.toLocaleString("en-IN")}
                  </span>
                  {priceChanged && (
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      {askingPrice > salary ? "+" : ""}
                      ₹{(askingPrice - salary).toLocaleString("en-IN")} vs {t("card_offered")}
                    </p>
                  )}
                </div>
                <button
                  onClick={increasePrice}
                  className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface-variant font-bold text-xl flex items-center justify-center hover:bg-tertiary-fixed hover:text-tertiary active:scale-90 transition-all shadow-sm"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.slice(0, 3).map((skill, i) => (
          <span
            key={i}
            className="bg-chip-green text-chip-green-text px-3 py-1 rounded-full text-xs font-medium border border-chip-green-border"
          >
            {skill}
          </span>
        ))}
        {skills.length > 3 && (
          <span className="bg-surface-container text-on-surface px-3 py-1 rounded-full text-xs font-medium">
            +{skills.length - 3} more
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          to={`/jobs/${_id}`}
          className="flex-1 bg-surface-container-lowest border-2 border-primary text-primary h-12 rounded-lg font-semibold text-sm hover:bg-surface-container-low transition-colors flex items-center justify-center"
        >
          {t("card_view")}
        </Link>
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex-1 bg-secondary-container text-on-secondary-container h-12 rounded-lg font-semibold text-sm hover:brightness-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">call</span>
            {priceChanged && showNegotiate
              ? `${t("card_call_with_price")} ₹${askingPrice.toLocaleString("en-IN")}`
              : t("card_call")}
          </a>
        )}
      </div>
    </article>
  );
}

function getTimeAgo(dateStr, t) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("card_just_now");
  if (mins < 60) return `${mins}m ${t("card_ago")}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${t("card_ago")}`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ${t("card_ago")}`;
  return `${Math.floor(days / 7)}w ${t("card_ago")}`;
}
