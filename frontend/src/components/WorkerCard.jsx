import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function WorkerCard({ worker }) {
  const { t } = useLanguage();

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-surface-variant hover:shadow-md p-5 transition-all animate-fade-in group">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm"
          style={{ backgroundColor: worker.avatarColor || "#1b4332" }}
        >
          <span className="text-white text-xl font-bold">
            {worker.name?.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link to={`/workers/${worker._id}`} className="block">
            <h3 className="font-semibold text-lg text-primary truncate group-hover:underline transition-colors">
              {worker.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-sm font-medium text-secondary">
              <span className="material-symbols-outlined text-sm icon-fill" style={{ color: "#ffab69" }}>star</span>
              <span>{worker.rating?.average || "0.0"}</span>
              <span className="text-on-surface-variant">({worker.rating?.count || 0})</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span className="text-sm text-on-surface-variant font-medium">
              {worker.experience || 0} {t("worker_exp").split(" ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Skills */}
      {worker.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {worker.skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2.5 py-1 rounded-full text-xs font-medium bg-chip-green text-chip-green-text border border-chip-green-border">
              {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-container text-on-surface-variant">
              +{worker.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <a
          href={`tel:${worker.phone}`}
          className="flex items-center justify-center gap-1.5 h-11 rounded-lg bg-secondary-container text-on-secondary-container font-semibold text-sm hover:brightness-95 transition-all"
        >
          <span className="material-symbols-outlined text-lg">call</span>
          {t("card_call").split(" ")[0]}
        </a>
        <Link
          to={`/workers/${worker._id}`}
          className="flex items-center justify-center h-11 rounded-lg bg-surface-container-lowest border-2 border-primary text-primary font-semibold text-sm hover:bg-surface-container-low transition-colors"
        >
          {t("card_view")}
        </Link>
      </div>
    </div>
  );
}
