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
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 flex flex-col gap-6">
        <div className="skeleton h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-6">
            <div className="skeleton h-32 w-full rounded-2xl" />
            <div className="skeleton h-48 w-full rounded-2xl" />
          </div>
          <div className="md:col-span-4">
            <div className="skeleton h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
        <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 shadow-sm text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error-container text-error flex items-center justify-center">
               <span className="material-symbols-outlined text-4xl">error</span>
          </div>
          <h2 className="font-headline-md font-bold text-on-surface mb-4">{error || "Worker not found"}</h2>
          <Link to="/workers" className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-surface-container-lowest border-2 border-primary text-primary font-label-lg font-bold hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Workers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 animate-fade-in-up">
      {/* Breadcrumbs */}
      <Link 
        to="/workers" 
        className="inline-flex items-center gap-2 font-label-md font-semibold text-on-surface-variant hover:text-primary mb-6 transition-all duration-200 hover:translate-x-[-4px]"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Workers
      </Link>

      {/* Profile Header Block */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/20 overflow-hidden mb-8 relative">
        <div className="h-40 bg-gradient-to-r from-primary via-primary/95 to-primary-container relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          {/* Accent decoration */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-42 h-42 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="px-6 md:px-10 pb-8 relative">
          {/* Avatar frame */}
          <div 
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl text-on-primary font-black shadow-xl border-4 border-surface-container-lowest absolute -top-14 sm:-top-16 bg-primary select-none transition-transform duration-300 hover:rotate-3"
            style={worker.avatarColor ? { backgroundColor: worker.avatarColor } : {}}
          >
            {worker.name?.charAt(0).toUpperCase()}
          </div>

          {/* Actions top bar (Top Right) */}
          <div className="flex flex-wrap gap-3 justify-end pt-20 sm:pt-4">
            <a 
              href={`tel:${worker.phone}`}
              className="h-12 px-6 rounded-xl bg-secondary-container text-on-secondary-container font-label-md font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 border border-secondary-container-outline"
            >
              <span className="material-symbols-outlined text-xl">call</span>
              Call Now
            </a>
            {isEmployer && (
              <button 
                onClick={handleHire}
                disabled={hiring || hasHired}
                className={`h-12 px-6 rounded-xl font-label-md font-bold shadow-sm transition-all flex items-center gap-2 active:scale-[0.98] ${
                  hasHired 
                    ? "bg-tertiary-container text-on-tertiary-container border border-tertiary/20 cursor-not-allowed" 
                    : "bg-primary text-on-primary hover:scale-[1.02] hover:brightness-95"
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

          <div className="mt-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary flex items-center gap-2">
              {worker.name}
              <span className="material-symbols-outlined text-primary text-xl icon-fill" title="Verified Talents">verified</span>
            </h1>
            
            {/* Meta Statistics Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-on-surface-variant font-label-md">
              <span className="flex items-center gap-1 font-bold text-secondary bg-secondary-container/10 px-2.5 py-1 rounded-lg border border-secondary-container-outline/25">
                <span className="material-symbols-outlined icon-fill text-sm">star</span>
                {worker.rating?.average || "0.0"} <span className="text-on-surface-variant/80 font-normal">({worker.rating?.count || 0})</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant hidden sm:inline"></span>
              <span className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-lg border border-outline-variant/30">
                <span className="material-symbols-outlined text-base">work_history</span>
                {worker.experience || 0} Years Experience
              </span>
              {worker.pastCompany && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant hidden sm:inline"></span>
                  <span className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-lg border border-outline-variant/30">
                    <span className="material-symbols-outlined text-base">business</span>
                    Ex: {worker.pastCompany}
                  </span>
                </>
              )}
            </div>
            
            {/* Action feedback message */}
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

      {/* Main content split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Bio, Skills & Reviews */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Biography Card */}
          {worker.bio && (
            <section className="elevation-1 rounded-2xl p-6 md:p-8 border border-outline-variant/10 bg-surface-container-lowest">
              <h3 className="font-label-lg font-extrabold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">person_book</span>
                {t("worker_bio")}
              </h3>
              <div className="p-4 rounded-xl bg-surface-container-low border-l-4 border-primary text-on-surface-variant font-body-md leading-relaxed whitespace-pre-wrap">
                {worker.bio}
              </div>
            </section>
          )}

          {/* Skills Required Card */}
          {worker.skills?.length > 0 && (
            <section className="elevation-1 rounded-2xl p-6 md:p-8 border border-outline-variant/10 bg-surface-container-lowest">
              <h3 className="font-label-lg font-extrabold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">hotel_class</span>
                Expertise & Skills
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {worker.skills.map(skill => (
                  <span 
                    key={skill} 
                    className="px-3.5 py-2 rounded-xl font-label-md font-semibold bg-chip-green text-chip-green-text border border-chip-green-border hover:bg-chip-green-border/20 transition-all duration-200 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Reviews card */}
          <section className="flex flex-col gap-5">
            <h3 className="font-label-lg font-extrabold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">forum</span>
              {t("reviews")} ({reviews.length})
            </h3>
            
            {reviews.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 border-dashed text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">speaker_notes_off</span>
                <p className="font-body-lg text-on-surface-variant font-semibold">{t("no_reviews")}</p>
                <p className="font-body-sm text-on-surface-variant/70 mt-1">Be the first employer to rate and leave feedback!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/10 flex flex-col gap-3 transition-all duration-200 hover:scale-[1.01]">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-on-primary-container bg-primary-container font-bold text-xl shadow-sm border border-primary-container-outline"
                        style={review.employerId?.avatarColor ? { backgroundColor: review.employerId.avatarColor } : {}}
                      >
                        {review.employerId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-label-lg font-extrabold text-primary leading-none">{review.employerId?.name}</h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="text-secondary flex items-center">
                            {[...Array(5)].map((_, i) => (
                               <span key={i} className={`material-symbols-outlined text-sm ${i < review.score ? 'icon-fill' : 'text-outline-variant'}`}>star</span>
                            ))}
                          </div>
                          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                          <span className="text-xs font-body-sm text-on-surface-variant/80">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.review && (
                      <p className="font-body-md text-on-surface-variant leading-relaxed pl-16">
                        "{review.review}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column: Stats dashboard card & Rate Form */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Worker Stats Metrics Card */}
          <section className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 flex flex-col gap-4 text-center">
            <h4 className="font-label-lg font-extrabold text-primary tracking-wide text-left mb-2">Worker Performance</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary icon-fill text-2xl">stars</span>
                <span className="block text-2xl font-black text-primary mt-1">{worker.rating?.average || "0.0"}</span>
                <span className="text-xs font-label-sm text-on-surface-variant uppercase tracking-wider">Avg Rating</span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
                <span className="material-symbols-outlined text-primary text-2xl">rate_review</span>
                <span className="block text-2xl font-black text-primary mt-1">{reviews.length}</span>
                <span className="text-xs font-label-sm text-on-surface-variant uppercase tracking-wider">Total Reviews</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 w-full flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">workspace_premium</span>
                <span className="text-sm font-label-md font-bold text-on-surface-variant">Profile Status</span>
              </div>
              <span className="text-sm font-label-sm font-bold bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-lg uppercase tracking-wider">Active</span>
            </div>
          </section>

          {/* Rating Form (Only if Employer hired this worker) */}
          {isEmployer && hasHired && (
            <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-secondary/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
              <h3 className="font-label-lg font-extrabold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary icon-fill">stars</span>
                {t("rate_title")}
              </h3>
              
              <form onSubmit={handleRate} className="space-y-4">
                <div className="flex gap-2 justify-center py-2 bg-surface-container-low rounded-xl border border-outline-variant/20">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className={`transition-all duration-200 transform hover:scale-125 ${star <= ratingScore ? "text-secondary" : "text-outline hover:text-secondary/70"}`}
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
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant text-on-surface focus-ring font-body-md resize-none focus:outline-none"
                />
                
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 transition-all flex justify-center items-center gap-2 shadow-sm"
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
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
