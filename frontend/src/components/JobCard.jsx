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
    <div
      className="group relative bg-white rounded-2xl border border-dark-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all duration-300 overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Suspicious Badge */}
      {isSuspicious && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-warning-500/10 text-warning-600 border border-warning-500/20">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {t("card_suspicious")}
          </span>
        </div>
      )}

      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500 group-hover:h-1.5 transition-all" />

      <div className="p-5">
        {/* Title */}
        <Link to={`/jobs/${_id}`} className="block">
          <h3 className="text-lg font-bold text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
        </Link>

        {/* Payment offered */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-2xl font-extrabold text-accent-600">₹{salary?.toLocaleString("en-IN")}</span>
          <span className="text-sm text-dark-400 font-medium">{t("card_offered")}</span>
        </div>

        {/* Worker: OLX-style price negotiation */}
        {isWorker && (
          <div className="mt-3">
            {!showNegotiate ? (
              <button
                onClick={() => setShowNegotiate(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-100 hover:bg-primary-100 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t("card_negotiate")}
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-primary-50/60 border border-primary-100 animate-fade-in">
                <p className="text-xs font-semibold text-primary-700 mb-2">{t("card_your_price")}</p>
                <div className="flex items-center gap-2">
                  {/* Decrease */}
                  <button
                    onClick={decreasePrice}
                    className="w-10 h-10 rounded-xl bg-white border border-dark-200 text-dark-600 font-bold text-xl flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-600 active:scale-90 transition-all shadow-sm"
                  >
                    −
                  </button>

                  {/* Price display */}
                  <div className="flex-1 text-center">
                    <span className={`text-2xl font-extrabold ${priceChanged ? "text-primary-600" : "text-accent-600"}`}>
                      ₹{askingPrice?.toLocaleString("en-IN")}
                    </span>
                    {priceChanged && (
                      <p className="text-[10px] text-dark-400 mt-0.5">
                        {askingPrice > salary ? "+" : ""}
                        ₹{(askingPrice - salary).toLocaleString("en-IN")} vs {t("card_offered")}
                      </p>
                    )}
                  </div>

                  {/* Increase */}
                  <button
                    onClick={increasePrice}
                    className="w-10 h-10 rounded-xl bg-white border border-dark-200 text-dark-600 font-bold text-xl flex items-center justify-center hover:bg-green-50 hover:border-green-300 hover:text-green-600 active:scale-90 transition-all shadow-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {skills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-dark-100 text-dark-500">
              +{skills.length - 4}
            </span>
          )}
        </div>

        {/* Meta Row */}
        <div className="flex items-center gap-4 mt-4 text-sm text-dark-400">
          {distance !== undefined && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {distance} {t("card_km")}
            </span>
          )}
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {timeAgo}
          </span>
          {relevanceScore !== undefined && (
            <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-50 text-accent-700">
              {Math.round(relevanceScore * 100)}% {t("card_match")}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-dark-100">
          <Link
            to={`/jobs/${_id}`}
            className="flex-1 py-3 text-center rounded-xl bg-dark-50 text-dark-700 font-semibold hover:bg-dark-100 transition-all text-sm"
          >
            {t("card_view")}
          </Link>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex-1 py-3 text-center rounded-xl bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-all shadow-sm hover:shadow-accent-500/25 flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {priceChanged && showNegotiate
                ? `${t("card_call_with_price")} ₹${askingPrice.toLocaleString("en-IN")}`
                : t("card_call")}
            </a>
          )}
        </div>
      </div>
    </div>
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
