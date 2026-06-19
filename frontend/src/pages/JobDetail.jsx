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
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/30">
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
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <div className="text-center py-20">
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
      <header className="sticky top-16 md:static w-full z-40 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 shadow-sm bg-surface">
        <div className="flex items-center gap-4">
          <Link to="/jobs" aria-label="Go Back" className="p-2 hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <h1 className="font-headline-md font-bold text-primary">Job Details</h1>
        </div>
        <div className="flex items-center gap-4">
          <button aria-label="Share" className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </header>

      {/* ─── Main Content Canvas ─── */}
      <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-md flex flex-col gap-lg animate-fade-in-up">
        
        {/* Safety Banner */}
        {job.isSuspicious ? (
          <div className="elevation-1 rounded-xl p-md flex items-start gap-sm border-l-4 border-error bg-error-container">
            <span className="material-symbols-outlined text-error mt-1 icon-fill">warning</span>
            <div>
              <h2 className="font-label-lg text-error mb-1">{t("detail_flagged")}</h2>
              <ul className="mt-1 space-y-1">
                {job.suspiciousReasons?.map((r, i) => (
                  <li key={i} className="text-sm text-error/80">• {r}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="elevation-1 rounded-xl p-md flex items-start gap-sm border-l-4 border-surface-tint bg-primary-fixed">
            <span className="material-symbols-outlined text-primary mt-1 icon-fill">verified_user</span>
            <div>
              <h2 className="font-label-lg text-primary mb-1">Verified Employer</h2>
              <p className="font-body-md text-on-primary-fixed-variant">This employer's identity and past hiring history have been verified by RozgarSetu. Safe to contact.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
          {/* ─── Left Column: Job Core Info ─── */}
          <div className="md:col-span-8 flex flex-col gap-lg">
            
            {/* Job Header Card */}
            <section className="elevation-1 rounded-xl p-lg flex flex-col gap-md">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-2">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-on-surface-variant font-label-lg">
                    {job.skills?.slice(0, 1).map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">work</span>
                        <span>{skill}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span>{job.distance !== undefined ? `${job.distance} ${t("detail_km_away")}` : t("detail_location")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center shrink-0 overflow-hidden text-secondary">
                  <span className="material-symbols-outlined text-3xl">business_center</span>
                </div>
              </div>
              
              <div className="h-px w-full bg-outline-variant my-2"></div>
              
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-on-surface-variant">Estimated Pay</span>
                <span className="font-headline-md text-secondary font-bold">₹{job.salary?.toLocaleString("en-IN")} / Day</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-headline-sm text-primary">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-chip-green text-chip-green-text font-label-sm border border-chip-green-border">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {job.description && (
                <div className="flex flex-col gap-2 mt-2">
                  <h3 className="font-headline-sm text-primary">{t("detail_description")}</h3>
                  <p className="font-body-md text-on-surface whitespace-pre-line">{job.description}</p>
                </div>
              )}
            </section>

            {/* Location Details Card */}
            <section className="elevation-1 rounded-xl p-lg flex flex-col gap-md">
              <h3 className="font-headline-sm text-primary">Location Details</h3>
              <p className="font-body-md text-on-surface">
                {locationName || `${job.location?.lat?.toFixed(4)}, ${job.location?.lng?.toFixed(4)}`}
              </p>
              <div className="w-full h-48 bg-surface-container rounded-lg overflow-hidden relative border border-outline-variant/20">
                <div className="absolute inset-0 bg-surface-container-high flex flex-col items-center justify-center text-on-surface-variant">
                   <span className="material-symbols-outlined text-4xl mb-2">map</span>
                   <span className="font-label-lg">Map View Placeholder</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-surface-container-lowest text-primary font-label-lg px-4 py-2 rounded-full shadow-md flex items-center gap-2 hover:bg-surface transition-colors">
                    <span className="material-symbols-outlined text-lg">directions</span>
                    Get Directions
                  </button>
                </div>
              </div>
            </section>

            {/* Negotiation / Bidding Section */}
            {isWorker && (
              <section className="elevation-1 rounded-xl p-lg flex flex-col gap-md border border-secondary-fixed">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary icon-fill">payments</span>
                  <h3 className="font-headline-sm text-primary">Propose Your Rate</h3>
                </div>
                <p className="font-body-md text-on-surface-variant">The employer is open to negotiation. Enter your expected daily wage.</p>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="w-full focus-ring rounded-lg transition-shadow">
                    <label className="block font-label-sm text-on-surface-variant mb-1 ml-1" htmlFor="bid-amount">Your Daily Wage (₹)</label>
                    <input 
                      className="w-full h-[48px] px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:border-secondary focus:ring-0" 
                      id="bid-amount" 
                      placeholder={`e.g. ${job.salary + 50}`} 
                      type="number"
                      value={askingPrice}
                      onChange={(e) => setAskingPrice(e.target.value)}
                    />
                  </div>
                  <button className="w-full md:w-auto h-[48px] px-6 rounded-lg bg-surface-container-lowest text-primary border-2 border-primary font-label-lg hover:bg-surface-container transition-colors whitespace-nowrap shadow-sm">
                    Set Negotiation Rate
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* ─── Right Column: Employer Profile & Actions ─── */}
          <div className="md:col-span-4 flex flex-col gap-lg">
            
            {/* Employer Summary */}
            {job.employerId && (
              <section className="elevation-1 rounded-xl p-lg flex flex-col gap-md items-center text-center">
                <div className="w-24 h-24 rounded-full bg-surface-container overflow-hidden mb-2 flex items-center justify-center text-primary-container text-4xl font-bold border-4 border-surface-container-lowest shadow-sm">
                  {job.employerId.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-headline-sm text-primary">{job.employerId.name}</h3>
                  <p className="font-label-sm text-on-surface-variant">{job.employerId.email}</p>
                </div>
                <div className="flex items-center gap-4 text-on-surface-variant my-2">
                  <div className="flex flex-col items-center">
                    <span className="font-headline-sm text-primary font-bold">Verified</span>
                    <span className="font-label-sm">Employer Status</span>
                  </div>
                  <div className="w-px h-8 bg-outline-variant"></div>
                  <div className="flex flex-col items-center">
                    <span className="font-headline-sm text-primary font-bold">4.8</span>
                    <span className="font-label-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-secondary text-sm icon-fill">star</span> Rating
                    </span>
                  </div>
                </div>
              </section>
            )}

            {/* Fixed Action Buttons (Sticky on mobile, static on web) */}
            <section className="elevation-2 md:elevation-1 rounded-t-xl md:rounded-xl p-lg bg-surface-container-lowest flex flex-col gap-4 fixed bottom-0 left-0 w-full md:static z-40 pb-safe md:pb-lg border-t border-outline-variant md:border-none">
              <h4 className="hidden md:block font-label-lg text-on-surface-variant text-center mb-2">Contact Employer</h4>
              <a 
                href={`tel:${job.phone}`}
                className="w-full h-[48px] rounded-lg bg-secondary-container text-on-secondary-container font-label-lg flex justify-center items-center gap-2 hover:brightness-95 transition-all shadow-sm"
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
                className="w-full h-[48px] rounded-lg bg-[#25D366] text-white font-label-lg flex justify-center items-center gap-2 hover:brightness-95 transition-all shadow-sm"
              >
                <svg fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path>
                </svg>
                WhatsApp
              </a>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="hidden md:flex w-full px-margin-mobile py-lg flex-col gap-md bg-primary text-on-primary mt-12">
        <div className="flex justify-between items-center max-w-container-max mx-auto w-full">
          <span className="text-headline-sm font-bold text-on-primary">RozgarSetu</span>
          <div className="flex gap-4">
            <a className="font-label-sm text-on-primary/80 hover:text-secondary-container transition-all" href="#">Contact Us</a>
            <a className="font-label-sm text-on-primary/80 hover:text-secondary-container transition-all" href="#">Safety Tips</a>
          </div>
        </div>
        <div className="max-w-container-max mx-auto w-full text-center mt-4">
          <span className="font-body-md text-on-primary/60">© 2024 RozgarSetu. Built for Bharat.</span>
        </div>
      </footer>
    </div>
  );
}
