import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import API from "../api/axios";

export default function WorkerDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Rating states
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingReview, setRatingReview] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [hiring, setHiring] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const isEmployer = user?.role === "employer";
  const hasHired = worker?.hiredBy?.includes(user?._id);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const res = await API.get(`/workers/${id}`);
        setWorker(res.data.worker);
        setReviews(res.data.ratings);
      } catch (err) {
        setError("Failed to load worker profile");
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [id]);

  const handleHire = async () => {
    setHiring(true);
    setActionMessage("");
    try {
      const res = await API.post(`/workers/${id}/hire`);
      setWorker({ ...worker, hiredBy: [...(worker.hiredBy || []), user._id] });
      setActionMessage(res.data.message || "Thanks for your interest! The worker will connect with you soon.");
    } catch (err) {
      setActionMessage(err.response?.data?.message || "Failed to hire worker");
    } finally {
      setHiring(false);
    }
  };

  const handleRate = async (e) => {
    e.preventDefault();
    setSubmittingRating(true);
    setActionMessage("");
    try {
      const res = await API.post(`/workers/${id}/rate`, {
        score: ratingScore,
        review: ratingReview
      });
      setWorker({ ...worker, rating: res.data.rating });
      setActionMessage("Rating submitted successfully!");
      // Reload reviews
      const fresh = await API.get(`/workers/${id}`);
      setReviews(fresh.data.ratings);
    } catch (err) {
      setActionMessage(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
        <div className="skeleton h-64 w-full rounded-2xl mb-8" />
        <div className="skeleton h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error-container text-error flex items-center justify-center">
             <span className="material-symbols-outlined text-4xl">error</span>
        </div>
        <h2 className="font-headline-md font-bold text-on-surface mb-4">{error || "Worker not found"}</h2>
        <Link to="/workers" className="inline-flex items-center gap-2 px-6 h-12 rounded-lg bg-surface-container-lowest border-2 border-primary text-primary font-label-lg font-bold hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Workers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 animate-fade-in-up">
      <Link to="/workers" className="inline-flex items-center gap-2 font-label-lg font-semibold text-on-surface-variant hover:text-primary mb-6 transition-colors">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Workers
      </Link>

      <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 overflow-hidden mb-8 relative">
        <div className="h-32 bg-primary-container relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>
        
        <div className="px-6 md:px-10 pb-10 relative">
          {/* Avatar */}
          <div 
            className="w-32 h-32 rounded-2xl flex items-center justify-center text-5xl text-on-primary font-bold shadow-lg border-4 border-surface-container-lowest absolute -top-16 bg-primary"
            style={worker.avatarColor ? { backgroundColor: worker.avatarColor } : {}}
          >
            {worker.name?.charAt(0).toUpperCase()}
          </div>

          {/* Action Buttons Container (Top Right) */}
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0 sm:absolute sm:top-4 sm:right-6 justify-end pt-20 sm:pt-0">
            <a 
              href={`tel:${worker.phone}`}
              className="h-12 px-6 rounded-lg bg-secondary-container text-on-secondary-container font-label-lg font-bold shadow-sm hover:brightness-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">call</span>
              Call Now
            </a>
            {isEmployer && (
              <button 
                onClick={handleHire}
                disabled={hiring || hasHired}
                className={`h-12 px-6 rounded-lg font-label-lg font-bold shadow-sm transition-all flex items-center gap-2 ${
                  hasHired 
                    ? "bg-tertiary-container text-on-tertiary-container border border-tertiary-container cursor-not-allowed" 
                    : "bg-primary text-on-primary hover:brightness-95"
                }`}
              >
                {hiring ? (
                   <>
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     {t("hire_hiring")}
                   </>
                ) : hasHired ? (
                  <>
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                    Hired
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">work</span>
                    {t("hire_btn")}
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mt-20 sm:mt-20">
            <h1 className="font-display-sm md:font-display-md font-bold text-primary">{worker.name}</h1>
            <div className="flex items-center gap-3 mt-2 font-body-lg text-on-surface-variant">
              <span className="flex items-center gap-1 font-bold text-secondary">
                <span className="material-symbols-outlined icon-fill text-sm">star</span>
                {worker.rating?.average || "0.0"} <span className="text-on-surface-variant font-normal">({worker.rating?.count || 0})</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">work_history</span>
                {worker.experience || 0} Years Experience
              </span>
              {worker.pastCompany && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">business</span>
                    Ex: {worker.pastCompany}
                  </span>
                </>
              )}
            </div>

            {/* Skills */}
            {worker.skills?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {worker.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-full font-label-sm font-semibold bg-chip-green text-chip-green-text border border-chip-green-border">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Bio */}
            {worker.bio && (
              <div className="mt-8 pt-8 border-t border-outline-variant">
                <h3 className="font-headline-sm font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">person_book</span>
                  {t("worker_bio")}
                </h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed whitespace-pre-wrap">{worker.bio}</p>
              </div>
            )}
            
            {actionMessage && (
              <div className={`mt-6 p-4 rounded-xl font-label-md animate-fade-in flex items-start gap-3 border ${
                actionMessage.toLowerCase().includes("fail") || actionMessage.toLowerCase().includes("already") 
                  ? "bg-error-container text-error border-error/20"
                  : "bg-tertiary-container text-on-tertiary-container border-tertiary/20"
              }`}>
                <span className="material-symbols-outlined text-xl mt-0.5 icon-fill">
                  {actionMessage.toLowerCase().includes("fail") || actionMessage.toLowerCase().includes("already") ? "error" : "check_circle"}
                </span>
                <span>{actionMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rating & Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Rating Form (Only if Employer hired this worker) */}
        {isEmployer && hasHired && (
          <div className="lg:col-span-1">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 sticky top-24">
              <h3 className="font-headline-sm font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary icon-fill">stars</span>
                {t("rate_title")}
              </h3>
              <form onSubmit={handleRate} className="space-y-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className={`transition-transform ${star <= ratingScore ? "text-secondary scale-110" : "text-outline hover:text-secondary/70"}`}
                    >
                      <span className={`material-symbols-outlined text-3xl ${star <= ratingScore ? 'icon-fill' : ''}`}>star</span>
                    </button>
                  ))}
                </div>
                <textarea
                  value={ratingReview}
                  onChange={(e) => setRatingReview(e.target.value)}
                  placeholder={t("rate_review_placeholder")}
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant text-on-surface focus-ring font-body-md resize-none"
                />
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="w-full h-12 rounded-lg bg-primary text-on-primary font-label-lg font-bold hover:brightness-95 disabled:opacity-70 transition-colors flex justify-center items-center gap-2"
                >
                  {submittingRating ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">send</span>
                      {t("submit_rating")}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className={isEmployer && hasHired ? "lg:col-span-2" : "lg:col-span-3"}>
          <h3 className="font-headline-sm font-bold text-primary mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">forum</span>
            {t("reviews")} ({reviews.length})
          </h3>
          
          {reviews.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30 border-dashed text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">speaker_notes_off</span>
              <p className="font-body-lg text-on-surface-variant">{t("no_reviews")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
                  <div className="flex items-center gap-4 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-on-primary-container bg-primary-container font-bold text-xl shadow-sm"
                      style={review.employerId?.avatarColor ? { backgroundColor: review.employerId.avatarColor } : {}}
                    >
                      {review.employerId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-label-lg font-bold text-on-surface">{review.employerId?.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="text-secondary flex items-center">
                          {[...Array(5)].map((_, i) => (
                             <span key={i} className={`material-symbols-outlined text-sm ${i < review.score ? 'icon-fill' : 'text-outline-variant'}`}>star</span>
                          ))}
                        </div>
                        <span className="text-xs font-body-sm text-on-surface-variant">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.review && (
                    <p className="font-body-md text-on-surface-variant mt-2 pl-16">{review.review}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
