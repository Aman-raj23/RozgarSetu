import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function HelpCenter() {
  const { t } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportData, setReportData] = useState({ jobTitle: "", employerName: "", reason: "", details: "" });
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hasMore = el.scrollWidth - el.scrollLeft - el.clientWidth > 8;
    setCanScrollRight(hasMore);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const target = location.hash.replace("#", "");
      setActiveTab(target);
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportData({ jobTitle: "", employerName: "", reason: "", details: "" });
    }, 4000);
  };

  const faqs = [
    { q: t("help_faq_1_q"), a: t("help_faq_1_a") },
    { q: t("help_faq_2_q"), a: t("help_faq_2_a") },
    { q: t("help_faq_3_q"), a: t("help_faq_3_a") },
    { q: t("help_faq_4_q"), a: t("help_faq_4_a") }
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-tertiary text-on-primary py-12 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-secondary-fixed mb-2 font-semibold text-sm">
              <span className="material-symbols-outlined text-lg">support_agent</span>
              <span>RozgarSetu Help Center</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {t("help_title")}
            </h1>
            <p className="mt-2 text-on-primary-container text-sm md:text-base max-w-2xl">
              {t("help_subtitle")}
            </p>
          </div>
          <a
            href="tel:18001234567"
            className="flex items-center gap-3 bg-secondary text-on-secondary px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:bg-secondary-container hover:text-on-secondary-container transition-all active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-2xl">call</span>
            <span>{t("help_toll_free")}</span>
          </a>
        </div>
      </div>

      {/* Navigation Quick Filters */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth touch-pan-x border-b border-outline-variant/30 hide-scrollbar"
          >
            {[
              { id: "all", label: t("help_tab_all"), icon: "dashboard" },
              { id: "works", label: t("help_tab_works"), icon: "schema" },
              { id: "find-job", label: t("help_tab_find_job"), icon: "work" },
              { id: "post-job", label: t("help_tab_post_job"), icon: "post_add" },
              { id: "safety", label: t("help_tab_safety"), icon: "shield" },
              { id: "report-fake", label: t("help_tab_report_fake"), icon: "report" },
              // { id: "videos", label: t("help_tab_videos"), icon: "play_circle" },
              { id: "faq", label: t("help_tab_faq"), icon: "quiz" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all focus:outline-none active:scale-95 ${activeTab === tab.id
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
              >
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Scroll-right fade + arrow indicator */}
          <div
            className={`absolute right-0 top-0 bottom-3 flex items-center pointer-events-none transition-opacity duration-300 md:hidden ${canScrollRight ? "opacity-100" : "opacity-0"
              }`}
          >
            <div className="w-12 h-full bg-gradient-to-l from-background via-background/80 to-transparent"></div>
            <button
              onClick={() => {
                if (scrollRef.current) scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
              }}
              className="pointer-events-auto -ml-1 w-8 h-8 rounded-full bg-primary/90 text-on-primary flex items-center justify-center shadow-md animate-bounce"
              aria-label="Scroll for more"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8 space-y-12">
        {/* ─── 1. Safety Tips (Stay Safe Highlight) ─── */}
        {(activeTab === "all" || activeTab === "safety") && (
          <section id="safety" className="bg-gradient-to-r from-emerald-950 to-primary text-on-primary rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
              <span className="material-symbols-outlined text-[200px]">verified_user</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-secondary-fixed mb-3 font-bold text-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-2xl">shield</span>
                <span>{t("help_safety_badge")}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
                {t("help_safety_title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[
                  {
                    title: t("help_safety_1_title"),
                    desc: t("help_safety_1_desc")
                  },
                  {
                    title: t("help_safety_2_title"),
                    desc: t("help_safety_2_desc")
                  },
                  {
                    title: t("help_safety_3_title"),
                    desc: t("help_safety_3_desc")
                  },
                  {
                    title: t("help_safety_4_title"),
                    desc: t("help_safety_4_desc")
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-start gap-3.5">
                    <span className="material-symbols-outlined text-secondary-fixed text-2xl shrink-0 mt-0.5">check_circle</span>
                    <div>
                      <h3 className="font-bold text-sm md:text-base text-white">{item.title}</h3>
                      <p className="text-xs md:text-sm text-emerald-100/90 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── 2. How RozgarSetu Works ─── */}
        {(activeTab === "all" || activeTab === "works") && (
          <section id="works" className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-xs">
            <div className="flex items-center gap-3 text-primary font-bold text-sm mb-2">
              <span className="material-symbols-outlined text-xl">schema</span>
              <span>{t("help_works_badge")}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">
              {t("help_works_title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {[
                {
                  step: "01",
                  icon: "touch_app",
                  title: t("help_works_step1_title"),
                  desc: t("help_works_step1_desc")
                },
                {
                  step: "02",
                  icon: "near_me",
                  title: t("help_works_step2_title"),
                  desc: t("help_works_step2_desc")
                },
                {
                  step: "03",
                  icon: "phone_in_talk",
                  title: t("help_works_step3_title"),
                  desc: t("help_works_step3_desc")
                }
              ].map((s, idx) => (
                <div key={idx} className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 relative">
                  <span className="text-3xl font-extrabold text-primary/20 absolute right-4 top-4">{s.step}</span>
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                  </div>
                  <h3 className="font-bold text-on-surface text-base">{s.title}</h3>
                  <p className="text-xs md:text-sm text-on-surface-variant mt-2 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 3. Guides: How to Find & How to Post ─── */}
        {(activeTab === "all" || activeTab === "find-job" || activeTab === "post-job") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Find Job Guide */}
            {(activeTab === "all" || activeTab === "find-job") && (
              <div id="find-job" className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs">
                <div className="flex items-center gap-2.5 text-primary font-bold text-sm mb-2">
                  <span className="material-symbols-outlined text-xl">work</span>
                  <span>{t("help_find_badge")}</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface">
                  {t("help_find_title")}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">filter_alt</span>
                    <span>{t("help_find_step1")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                    <span>{t("help_find_step2")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">call</span>
                    <span>{t("help_find_step3")}</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Post Job Guide */}
            {(activeTab === "all" || activeTab === "post-job") && (
              <div id="post-job" className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs">
                <div className="flex items-center gap-2.5 text-secondary font-bold text-sm mb-2">
                  <span className="material-symbols-outlined text-xl">post_add</span>
                  <span>{t("profile_employer")}</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface">
                  {t("help_post_title")}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-lg mt-0.5">edit_note</span>
                    <span>{t("help_post_step1")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-lg mt-0.5">payments</span>
                    <span>{t("help_post_step2")}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-lg mt-0.5">groups</span>
                    <span>{t("help_post_step3")}</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ─── 4. Report Fake Job Form ─── */}
        {(activeTab === "all" || activeTab === "report-fake") && (
          <section id="report-fake" className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-error/20 shadow-xs">
            <div className="flex items-center gap-2.5 text-error font-bold text-sm mb-2">
              <span className="material-symbols-outlined text-xl">report</span>
              <span>{t("help_report_badge")}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">
              {t("help_report_title")}
            </h2>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1">
              {t("help_report_subtitle")}
            </p>

            {reportSubmitted ? (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-emerald-700">check_circle</span>
                <span className="text-sm font-bold">
                  {t("help_report_success")}
                </span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    {t("help_report_job_title")}
                  </label>
                  <input
                    type="text"
                    required
                    value={reportData.jobTitle}
                    onChange={(e) => setReportData({ ...reportData, jobTitle: e.target.value })}
                    placeholder={t("help_report_job_title_ph")}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-error"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    {t("help_report_employer_name")}
                  </label>
                  <input
                    type="text"
                    value={reportData.employerName}
                    onChange={(e) => setReportData({ ...reportData, employerName: e.target.value })}
                    placeholder={t("help_report_employer_name_ph")}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-error"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    {t("help_report_reason")}
                  </label>
                  <select
                    required
                    value={reportData.reason}
                    onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-error"
                  >
                    <option value="">{t("help_report_reason_select")}</option>
                    <option value="asked_money">{t("help_report_reason_money")}</option>
                    <option value="fake_location">{t("help_report_reason_location")}</option>
                    <option value="abuse">{t("help_report_reason_abuse")}</option>
                    <option value="other">{t("help_report_reason_other")}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    {t("help_report_details")}
                  </label>
                  <textarea
                    rows={3}
                    value={reportData.details}
                    onChange={(e) => setReportData({ ...reportData, details: e.target.value })}
                    placeholder={t("help_report_details_ph")}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-error"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-error text-on-error font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">flag</span>
                    <span>{t("help_report_btn")}</span>
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {/* ─── 5. Video Tutorials (Commented out for future release) ─── */}
        {/* {(activeTab === "all" || activeTab === "videos") && (
          <section id="videos" className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-xs">
            <div className="flex items-center gap-2.5 text-primary font-bold text-sm mb-2">
              <span className="material-symbols-outlined text-xl">play_circle</span>
              <span>{t("help_video_badge")}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">
              {t("help_video_title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              ...
            </div>
          </section>
        )} */}

        {/* ─── 6. FAQs ─── */}
        {(activeTab === "all" || activeTab === "faq") && (
          <section id="faq" className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-xs">
            <div className="flex items-center gap-2.5 text-primary font-bold text-sm mb-2">
              <span className="material-symbols-outlined text-xl">quiz</span>
              <span>{t("help_faq_badge")}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">
              {t("help_faq_title")}
            </h2>
            <div className="mt-6 space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-outline-variant/30 rounded-2xl overflow-hidden bg-surface-container-low">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left p-4 font-bold text-sm text-on-surface flex justify-between items-center gap-4 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-xl text-primary transition-transform">
                      {openFaq === i ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-xs md:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 7. Contact Support Footer ─── */}
        <section className="bg-gradient-to-r from-surface-container-high to-surface-container rounded-3xl p-6 md:p-8 text-center border border-outline-variant/30">
          <span className="material-symbols-outlined text-4xl text-primary mb-2">contact_support</span>
          <h3 className="text-xl font-bold text-on-surface">
            {t("help_need_more")}
          </h3>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-md mx-auto">
            {t("help_need_more_sub")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a
              href="tel:18001234567"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-xs hover:bg-primary-container transition-all"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              <span>1800-123-4567</span>
            </a>
            <a
              href="mailto:support@rozgarsetu.in"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-bold text-sm border border-outline-variant/40 hover:bg-surface-container-high transition-all"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
              <span>support@rozgarsetu.in</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
