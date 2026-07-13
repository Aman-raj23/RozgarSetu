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
  const [askingPrice, setAskingPrice] = useState("");
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

  useEffect(() => {
    if (job?.location?.lat && job?.location?.lng) {
      getLocationName(job.location.lat, job.location.lng).then((name) => {
        if (name) setLocationName(name);
      });
    }
  }, [job]);

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-4 md:px-8 py-12 flex flex-col gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 shadow-sm animate-pulse">
          <div className="h-4 bg-outline-variant/30 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-outline-variant/30 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-outline-variant/30 rounded w-1/3 mb-8"></div>
          <div className="space-y-3 mb-8">
            <div className="h-4 bg-outline-variant/30 rounded w-full"></div>
            <div className="h-4 bg-outline-variant/30 rounded w-full"></div>
            <div className="h-4 bg-outline-variant/30 rounded w-5/6"></div>
          </div>
          <div className="h-12 bg-outline-variant/30 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-container-max mx-auto px-4 md:px-8 py-12">
        <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 shadow-sm text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-error-container text-error flex items-center justify-center text-4xl">
            <span className="material-symbols-outlined text-[40px]">error</span>
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">{error}</h3>
          <Link to="/jobs" className="text-primary font-semibold hover:underline flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            {t("detail_back")}
          </Link>
        </div>
      </div>
    );
  }

  const isWorker = user?.role === "worker";

  return (
    <div className="bg-background min-h-screen pb-safe">
      {/* ─── Header ─── */}
      <header className="sticky top-16 md:static w-full z-40 flex justify-between items-center px-4 md:px-8 h-16 border-b border-outline-variant/20 bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link 
            to="/jobs" 
            aria-label="Go Back" 
            className="p-2 hover:bg-surface-container-high rounded-full transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <div>
            <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Platform / Jobs</span>
            <h1 className="font-headline-sm font-extrabold text-primary leading-none">Job Details</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            aria-label="Share" 
            className="p-2 hover:bg-surface-container-high rounded-full transition-all duration-200 text-primary flex items-center justify-center hover:scale-105 active:scale-95 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </header>

      {/* ─── Main Content Canvas ─── */}
      <main className="w-full max-w-container-max mx-auto px-4 md:px-8 py-8 flex flex-col gap-6 animate-fade-in-up">
        
        {/* Safety Banner */}
        {job.isSuspicious ? (
          <div className="elevation-1 rounded-2xl p-5 flex items-start gap-4 border-l-4 border-error bg-error-container/30 border border-error/20">
            <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error shrink-0">
              <span className="material-symbols-outlined icon-fill">warning</span>
            </div>
            <div>
              <h2 className="font-label-lg text-error font-bold mb-1">{t("detail_flagged")}</h2>
              <ul className="mt-1 space-y-1">
                {job.suspiciousReasons?.map((r, i) => (
                  <li key={i} className="text-sm text-error/90 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="elevation-1 rounded-2xl p-5 flex items-start gap-4 border-l-4 border-primary bg-primary-container/20 border border-primary-container/30">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined icon-fill">verified_user</span>
            </div>
            <div>
              <h2 className="font-label-lg text-primary font-bold mb-1">Verified Listing</h2>
              <p className="font-body-md text-on-primary-fixed-variant leading-relaxed">
                This job posting and employer identity have been verified by the RozgarSetu Moderation team. Safe to contact.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* ─── Left Column: Job Core Info ─── */}
          <div className="md:col-span-8 flex flex-col gap-6">
            
            {/* Job Header Card */}
            <section className="elevation-1 rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden border border-outline-variant/10">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-primary-container to-secondary"></div>
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-primary mb-3">
                    {job.title}
                  </h1>
                  
                  {/* Info Badges Row */}
                  <div className="flex flex-wrap gap-2.5 mt-2">
                    {job.skills?.slice(0, 1).map((skill, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container text-on-surface-variant font-label-md border border-outline-variant/30">
                        <span className="material-symbols-outlined text-base">work</span>
                        <span>{skill}</span>
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container text-on-surface-variant font-label-md border border-outline-variant/30">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      <span>{job.distance !== undefined ? `${job.distance} ${t("detail_km_away")}` : t("detail_location")}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container text-on-surface-variant font-label-md border border-outline-variant/30">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
                
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary border border-primary/20 hover:scale-105 transition-transform duration-200">
                  <span className="material-symbols-outlined text-2xl">business_center</span>
                </div>
              </div>
              
              <hr className="border-outline-variant/30" />
              
              {/* Pay Metric Card */}
              <div className="bg-secondary-container/20 border border-secondary-container/30 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/50 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined icon-fill">payments</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-on-surface-variant block uppercase tracking-wider">Estimated Salary Range</span>
                    <span className="text-xl sm:text-2xl font-black text-secondary">₹{job.salary?.toLocaleString("en-IN")} <span className="text-sm font-medium text-on-surface-variant">/ Day</span></span>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-label-sm font-bold uppercase tracking-wider">
                  Negotiable Rate
                </div>
              </div>
              
              {/* Skills Required */}
              <div className="flex flex-col gap-3">
                <h3 className="font-label-lg font-extrabold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">hotel_class</span>
                  Skills Required
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-3.5 py-2 rounded-xl bg-chip-green text-chip-green-text font-label-md border border-chip-green-border hover:bg-chip-green-border/20 transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              {job.description && (
                <div className="flex flex-col gap-3 mt-2">
                  <h3 className="font-label-lg font-extrabold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-lg">subject</span>
                    {t("detail_description")}
                  </h3>
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 font-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {job.description}
                  </div>
                </div>
              )}
            </section>
 
            {/* Location Details Card */}
            <section className="elevation-1 rounded-2xl p-6 md:p-8 flex flex-col gap-5 border border-outline-variant/10">
              <h3 className="font-label-lg font-extrabold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">map</span>
                Location Details
              </h3>
              <p className="font-body-md text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">pin_drop</span>
                {locationName || `${job.location?.lat?.toFixed(4)}, ${job.location?.lng?.toFixed(4)}`}
              </p>
              
              <div className="w-full h-56 bg-surface-container rounded-2xl overflow-hidden relative border border-outline-variant/30 group">
                <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high flex flex-col items-center justify-center text-on-surface-variant">
                   <span className="material-symbols-outlined text-5xl mb-3 text-primary/50 group-hover:scale-110 transition-transform duration-300">map</span>
                   <span className="font-label-md tracking-wide text-on-surface-variant/80 uppercase">Static Map Preview</span>
                </div>
                {/* Decorative map elements for realistic look */}
                <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full border-2 border-dashed border-primary/20 pointer-events-none animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-secondary shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2 ring-4 ring-secondary/35"></div>
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-colors duration-300">
                  <button className="bg-surface-container-lowest text-primary font-label-md px-5 h-12 rounded-xl shadow-lg flex items-center gap-2 hover:bg-surface active:scale-95 transition-all border border-outline-variant/20">
                    <span className="material-symbols-outlined text-xl text-secondary">directions</span>
                    Get Directions
                  </button>
                </div>
              </div>
            </section>

            {/* Bidding Section */}
            {isWorker && (
              <section className="elevation-1 rounded-2xl p-6 md:p-8 flex flex-col gap-5 border border-secondary/20 bg-secondary-container/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2.5 h-full bg-secondary"></div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary icon-fill">payments</span>
                  <h3 className="font-label-lg font-extrabold text-primary">Propose Your Rate</h3>
                </div>
                <p className="font-body-md text-on-surface-variant">
                  The employer is open to negotiation. Enter your expected daily wage below to update your calling rate indicator.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="w-full focus-ring rounded-xl transition-shadow bg-surface-container-lowest">
                    <label className="block font-label-sm text-on-surface-variant mb-1 ml-1 uppercase tracking-wider" htmlFor="bid-amount">Your Daily Wage (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-lg">₹</span>
                      <input 
                        className="w-full h-12 pl-8 pr-4 rounded-xl border border-outline-variant bg-transparent text-on-surface font-headline-sm focus:border-secondary focus:ring-0 focus:outline-none transition-colors" 
                        id="bid-amount" 
                        placeholder={`e.g. ${job.salary + 50}`} 
                        type="number"
                        value={askingPrice}
                        onChange={(e) => setAskingPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <button className="w-full sm:w-auto h-12 px-6 rounded-xl bg-primary text-on-primary font-label-md hover:brightness-95 transition-all shadow-sm active:scale-95">
                    Set Rate Indicator
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* ─── Right Column: Employer Profile & Actions ─── */}
          <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* Employer Summary */}
            {job.employerId && (
              <section className="elevation-1 rounded-2xl p-6 flex flex-col gap-5 items-center text-center border border-outline-variant/10 bg-surface-container-low">
                <div className="relative">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-primary-container text-4xl font-extrabold border-4 border-surface-container-lowest shadow-md"
                    style={{ backgroundColor: job.employerId.avatarColor || 'var(--color-primary)' }}
                  >
                    {job.employerId.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary border-4 border-surface-container-lowest flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-sm icon-fill">verified</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-headline-sm font-extrabold text-primary leading-tight">{job.employerId.name}</h3>
                  <p className="font-label-sm text-on-surface-variant mt-1">{job.employerId.email}</p>
                </div>
                
                <hr className="w-full border-outline-variant/40" />
                
                <div className="flex justify-around w-full text-on-surface-variant py-2">
                  <div className="flex flex-col items-center">
                    <span className="font-label-sm uppercase tracking-wider text-on-surface-variant/80">Status</span>
                    <span className="font-label-lg font-black text-primary flex items-center gap-0.5 mt-1">
                      <span className="material-symbols-outlined text-sm icon-fill text-primary">verified</span>
                      Verified
                    </span>
                  </div>
                  <div className="w-px h-8 bg-outline-variant/50"></div>
                  <div className="flex flex-col items-center">
                    <span className="font-label-sm uppercase tracking-wider text-on-surface-variant/80">Rating</span>
                    <span className="font-label-lg font-black text-primary flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-secondary text-sm icon-fill">star</span>
                      4.8
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Action Card (Static on Web, sticky/floating on mobile) */}
            <section className="elevation-2 md:elevation-1 rounded-t-2xl md:rounded-2xl p-6 bg-surface-container-lowest flex flex-col gap-4 fixed bottom-0 left-0 w-full md:static z-40 pb-safe md:pb-6 border-t border-outline-variant/30 md:border border-outline-variant/10">
              <h4 className="hidden md:block font-label-lg font-extrabold text-primary text-center mb-1">Contact Employer</h4>
              
              <div className="flex flex-col gap-3">
                <a 
                  href={`tel:${job.phone}`}
                  className="w-full h-12 rounded-xl bg-secondary-container text-on-secondary-container font-label-md flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm border border-secondary-container-outline"
                >
                  <span className="material-symbols-outlined text-xl">call</span>
                  {askingPrice 
                    ? `Call & Ask ₹${askingPrice}`
                    : "Call Now"}
                </a>
                
                <a 
                  href={`https://wa.me/91${job.phone?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-12 rounded-xl bg-[#25D366] text-white font-label-md flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
                >
                  <svg fill="currentColor" height="18" viewBox="0 0 24 24" width="18">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path>
                  </svg>
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="hidden md:flex w-full px-4 py-8 flex-col gap-6 bg-primary text-on-primary mt-16 border-t border-primary-container">
        <div className="flex justify-between items-center max-w-container-max mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-on-primary tracking-wide">RozgarSetu</span>
          </div>
          <div className="flex gap-6">
            <a className="font-label-sm text-on-primary/80 hover:text-secondary hover:underline transition-all" href="#">Contact Us</a>
            <a className="font-label-sm text-on-primary/80 hover:text-secondary hover:underline transition-all" href="#">Safety Tips</a>
          </div>
        </div>
        <hr className="border-on-primary/10 max-w-container-max mx-auto w-full" />
        <div className="max-w-container-max mx-auto w-full text-center">
          <span className="font-body-md text-on-primary/60">© 2024 RozgarSetu. Connecting Rural Talents with Opportunities.</span>
        </div>
      </footer>
    </div>
  );
}
