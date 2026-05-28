import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function WorkerCard({ worker }) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-dark-100 p-5 transition-all animate-fade-in">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div 
          className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm"
          style={{ backgroundColor: worker.avatarColor || "#ee7a14" }}
        >
          <span className="text-white text-xl font-bold">
            {worker.name?.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link to={`/workers/${worker._id}`} className="block group">
            <h3 className="text-lg font-bold text-dark-900 truncate group-hover:text-primary-600 transition-colors">
              {worker.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-sm font-medium text-warning-500">
              <span>⭐</span>
              <span>{worker.rating?.average || "0.0"}</span>
              <span className="text-dark-400">({worker.rating?.count || 0})</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-dark-300"></span>
            <span className="text-sm text-dark-600 font-medium">
              {worker.experience || 0} {t("worker_exp").split(" ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Skills */}
      {worker.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {worker.skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-1 rounded-md text-xs font-semibold bg-dark-50 text-dark-600 border border-dark-100">
              {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="px-2 py-1 rounded-md text-xs font-semibold bg-dark-50 text-dark-400 border border-dark-100">
              +{worker.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <a 
          href={`tel:${worker.phone}`}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-accent-50 text-accent-700 font-semibold text-sm hover:bg-accent-100 transition-colors"
        >
          📞 {t("card_call").split(" ")[0]}
        </a>
        <Link 
          to={`/workers/${worker._id}`}
          className="flex items-center justify-center py-2.5 rounded-xl bg-primary-50 text-primary-700 font-semibold text-sm hover:bg-primary-100 transition-colors"
        >
          {t("card_view")}
        </Link>
      </div>
    </div>
  );
}
