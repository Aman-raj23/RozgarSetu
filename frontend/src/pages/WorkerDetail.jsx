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
      await API.post(`/workers/${id}/hire`);
      setWorker({ ...worker, hiredBy: [...worker.hiredBy, user._id] });
      setActionMessage("Worker hired successfully!");
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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="skeleton h-64 w-full rounded-2xl mb-8" />
        <div className="skeleton h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-dark-900">{error || "Worker not found"}</h2>
        <Link to="/workers" className="mt-4 inline-block text-primary-600 hover:underline">
          Back to Workers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in-up">
      <Link to="/workers" className="inline-flex items-center text-sm font-semibold text-dark-500 hover:text-primary-600 mb-6 transition-colors">
        ← Back to Workers
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-dark-100 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-primary-400 to-accent-500" />
        
        <div className="px-6 sm:px-10 pb-10 relative">
          {/* Avatar */}
          <div 
            className="w-32 h-32 rounded-2xl flex items-center justify-center text-5xl text-white font-bold shadow-xl border-4 border-white absolute -top-16"
            style={{ backgroundColor: worker.avatarColor || "#ee7a14" }}
          >
            {worker.name?.charAt(0).toUpperCase()}
          </div>

          {/* Action Buttons Container (Top Right) */}
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0 sm:absolute sm:top-4 sm:right-6 justify-end pt-20 sm:pt-0">
            <a 
              href={`tel:${worker.phone}`}
              className="px-6 py-2.5 rounded-xl bg-dark-900 text-white font-semibold shadow-md hover:bg-dark-800 transition-colors"
            >
              📞 Call Now
            </a>
            {isEmployer && (
              <button 
                onClick={handleHire}
                disabled={hiring || hasHired}
                className={`px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all ${
                  hasHired 
                    ? "bg-success-50 text-success-700 border border-success-200 cursor-not-allowed" 
                    : "bg-primary-500 text-white hover:bg-primary-600 active:scale-95"
                }`}
              >
                {hiring ? t("hire_hiring") : hasHired ? "✓ Hired" : t("hire_btn")}
              </button>
            )}
          </div>

          <div className="mt-20 sm:mt-16">
            <h1 className="text-3xl font-extrabold text-dark-900">{worker.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-dark-600 font-medium">
              <span className="flex items-center gap-1 text-warning-500">
                ⭐ {worker.rating?.average || "0.0"} <span className="text-dark-400">({worker.rating?.count || 0})</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-dark-300"></span>
              <span>{worker.experience || 0} Years Experience</span>
              {worker.pastCompany && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-dark-300"></span>
                  <span>Ex: {worker.pastCompany}</span>
                </>
              )}
            </div>

            {/* Skills */}
            {worker.skills?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {worker.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Bio */}
            {worker.bio && (
              <div className="mt-8 pt-8 border-t border-dark-100">
                <h3 className="text-lg font-bold text-dark-900 mb-3">{t("worker_bio")}</h3>
                <p className="text-dark-600 leading-relaxed whitespace-pre-wrap">{worker.bio}</p>
              </div>
            )}
            
            {actionMessage && (
              <div className="mt-6 p-4 rounded-xl bg-accent-50 text-accent-700 font-medium border border-accent-100 animate-fade-in">
                {actionMessage}
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-dark-100 sticky top-24">
              <h3 className="text-lg font-bold text-dark-900 mb-4">{t("rate_title")}</h3>
              <form onSubmit={handleRate}>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className={`text-2xl transition-transform ${star <= ratingScore ? "text-warning-500 scale-110" : "text-dark-200 hover:text-warning-300"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={ratingReview}
                  onChange={(e) => setRatingReview(e.target.value)}
                  placeholder={t("rate_review_placeholder")}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl bg-dark-50 border border-dark-200 text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-4"
                />
                <button
                  type="submit"
                  disabled={submittingRating}
                  className="w-full py-3 rounded-xl bg-dark-900 text-white font-bold hover:bg-dark-800 disabled:opacity-70 transition-colors"
                >
                  {submittingRating ? "Submitting..." : t("submit_rating")}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className={isEmployer && hasHired ? "lg:col-span-2" : "lg:col-span-3"}>
          <h3 className="text-xl font-bold text-dark-900 mb-6">{t("reviews")} ({reviews.length})</h3>
          
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-dark-100 text-center text-dark-500">
              {t("no_reviews")}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review._id} className="bg-white rounded-2xl p-6 shadow-sm border border-dark-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: review.employerId?.avatarColor || "#3b82f6" }}
                    >
                      {review.employerId?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900">{review.employerId?.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="text-warning-500 text-sm">
                          {"★".repeat(review.score)}{"☆".repeat(5 - review.score)}
                        </div>
                        <span className="text-xs text-dark-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.review && (
                    <p className="text-dark-700 mt-2">{review.review}</p>
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
