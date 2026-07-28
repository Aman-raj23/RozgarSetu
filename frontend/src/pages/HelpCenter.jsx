import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function HelpCenter() {
  const { lang, t } = useLanguage();
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

  const isHi = lang === "hi";

  const faqs = [
    {
      q: isHi ? "क्या रोज़गारसेतु इस्तेमाल करने के लिए पैसे देने पड़ते हैं?" : "Is RozgarSetu free to use?",
      a: isHi
        ? "नहीं! रोज़गारसेतु पूरी तरह मुफ़्त है। किसी भी नौकरी के लिए या ऐप इस्तेमाल करने के लिए कभी भी पैसे न दें।"
        : "No! RozgarSetu is completely free for workers and hirers. Never pay any fee for applying or getting a job."
    },
    {
      q: isHi ? "मैं पास की नौकरियाँ कैसे ढूँढूँ?" : "How do I find jobs near my location?",
      a: isHi
        ? "होम पेज या 'नौकरी खोजें' टैब पर जाएँ, अपना कौशल चुनें और स्थान अनुमति चालू करें। ऐप स्वचालित रूप से आपके 10 किमी दायरे में नौकरियाँ दिखाएगा।"
        : "Go to the Home page or 'Find Jobs' tab, select your skill, and enable location access. The app will automatically show matching jobs within 10 km."
    },
    {
      q: isHi ? "संदिग्ध या धोखाधड़ी वाले काम की शिकायत कैसे करें?" : "How to report a fake or suspicious job?",
      a: isHi
        ? "किसी भी नौकरी कार्ड पर 'संदिग्ध' बटन दबाएँ या इस सहायता केंद्र में 'रिपोर्ट फ़ेक जॉब' फ़ॉर्म भरें। हमारी टीम 24 घंटे के अंदर समीक्षा करेगी।"
        : "Click the 'Suspicious' tag on any job card or fill out the 'Report Fake Job' form right here in the Help Center. Our team reviews flags within 24 hours."
    },
    {
      q: isHi ? "क्या मैं सीधे नियोक्ता को कॉल कर सकता हूँ?" : "Can I call the employer directly?",
      a: isHi
        ? "हाँ! नौकरी के विवरण में 'अभी कॉल करें' बटन दबाकर आप सीधे नियोक्ता से बात करके काम तय कर सकते हैं।"
        : "Yes! Click the 'Call Now' button on any job listing to connect directly with the employer via phone call."
    }
  ];

  const videoTutorials = [
    {
      title: isHi ? "रोज़गारसेतु पर खाता कैसे बनाएँ" : "How to Register on RozgarSetu",
      duration: "1:45 min",
      thumb: "bg-gradient-to-br from-emerald-700 to-emerald-900",
      desc: isHi ? "मज़दूर या काम देने वाले के रूप में 1 मिनट में रजिस्टर करना सीखें।" : "Learn how to register as a worker or hirer in just 1 minute."
    },
    {
      title: isHi ? "पास की नौकरी खोजें और कॉल करें" : "How to Search Jobs Near Your Village",
      duration: "2:10 min",
      thumb: "bg-gradient-to-br from-amber-700 to-amber-900",
      desc: isHi ? "स्थान चालू करके अपने गाँव के 10 किमी में काम खोजें।" : "Find jobs within 10 km of your village using GPS location."
    },
    {
      title: isHi ? "नया काम कैसे पोस्ट करें (नियोक्ताओं के लिए)" : "How to Post a New Job (For Hirers)",
      duration: "2:30 min",
      thumb: "bg-gradient-to-br from-teal-700 to-teal-900",
      desc: isHi ? "काम की पेमेंट और विवरण डालकर पास के मज़दूरों को बुलाएँ।" : "Post daily wage work and connect with verified local workers."
    }
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
              {isHi ? "हम आपकी कैसे मदद कर सकते हैं?" : "How can we help you today?"}
            </h1>
            <p className="mt-2 text-on-primary-container text-sm md:text-base max-w-2xl">
              {isHi
                ? "नौकरी खोजने, काम पोस्ट करने, सुरक्षा नियमों और सहायता के लिए सभी मार्गदर्शन यहाँ पाएं।"
                : "Find guides on searching jobs, posting work, safety guidelines, and reporting fake listings."}
            </p>
          </div>
          <a
            href="tel:18001234567"
            className="flex items-center gap-3 bg-secondary text-on-secondary px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:bg-secondary-container hover:text-on-secondary-container transition-all active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-2xl">call</span>
            <span>{isHi ? "हेल्पलाइन: 1800-123-4567" : "Toll-Free: 1800-123-4567"}</span>
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
              { id: "all", label: isHi ? "सभी विषय" : "All Topics", icon: "dashboard" },
              { id: "works", label: isHi ? "कैसे काम करता है" : "How it Works", icon: "schema" },
              { id: "find-job", label: isHi ? "नौकरी खोजें" : "Find Job Guide", icon: "work" },
              { id: "post-job", label: isHi ? "काम डालें" : "Post Job Guide", icon: "post_add" },
              { id: "safety", label: isHi ? "सुरक्षा सुझाव" : "Safety Tips", icon: "shield" },
              { id: "report-fake", label: isHi ? "रिपोर्ट फ़ेक जॉब" : "Report Fake Job", icon: "report" },
              // { id: "videos", label: isHi ? "वीडियो ट्यूटोरियल" : "Video Guides", icon: "play_circle" },
              { id: "faq", label: isHi ? "अक्सर पूछे जाने वाले प्रश्न" : "FAQs", icon: "quiz" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all focus:outline-none active:scale-95 ${
                  activeTab === tab.id
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
            className={`absolute right-0 top-0 bottom-3 flex items-center pointer-events-none transition-opacity duration-300 md:hidden ${
              canScrollRight ? "opacity-100" : "opacity-0"
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
                <span>{isHi ? "सुरक्षित रहें — Stay Safe" : "Stay Safe Guidelines"}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
                {isHi ? "सुरक्षा नियम: धोखाधड़ी से सावधान रहें" : "RozgarSetu Safety First Rules"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {[
                  {
                    title: isHi ? "नौकरी के लिए कभी पैसे न दें" : "Never pay money for a job",
                    desc: isHi ? "कोई भी असली नियोक्ता नौकरी या इंटरव्यू देने के बदले पैसे नहीं मांगता।" : "Legitimate employers never demand registration fees or security deposits."
                  },
                  {
                    title: isHi ? "नियोक्ता का विवरण सत्यापित करें" : "Verify employer details",
                    desc: isHi ? "काम शुरू करने से पहले फ़ोन पर बात करें और जगह की पुष्टि करें।" : "Call the employer, ask clear questions about work location and payment terms."
                  },
                  {
                    title: isHi ? "सार्वजनिक या सुरक्षित स्थान पर मिलें" : "Meet in safe & public places",
                    desc: isHi ? "पहले मुलाकात या काम के लिए जाने से पहले अपने परिवार को सूचित करें।" : "Inform family members about work locations before travelling to a new site."
                  },
                  {
                    title: isHi ? "संदिग्ध नौकरियों की शिकायत करें" : "Report suspicious jobs",
                    desc: isHi ? "अगर कोई झूठी जानकारी दे तो तुरंत 'रिपोर्ट फ़ेक जॉब' पर क्लिक करें।" : "Flag job listings asking for money or offering unrealistic wages immediately."
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
              <span>{isHi ? "प्रक्रिया" : "Overview"}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">
              {isHi ? "रोज़गारसेतु कैसे काम करता है?" : "How RozgarSetu Works"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {[
                {
                  step: "01",
                  icon: "touch_app",
                  title: isHi ? "अपना कौशल चुनें" : "Select Your Skill",
                  desc: isHi ? "इलेक्ट्रीशियन, प्लम्बर, पेंटर, सिलाई जैसे 12+ विकल्पों में से चुनें।" : "Choose from electrician, plumber, carpenter, farming, and 12+ categories."
                },
                {
                  step: "02",
                  icon: "near_me",
                  title: isHi ? "पास की नौकरी ढूँढें" : "Find Nearby Jobs",
                  desc: isHi ? "GPS द्वारा अपने 10 किमी दायरे में ताज़ा नौकरियाँ देखें।" : "View active jobs within 10 km of your village ranked by distance."
                },
                {
                  step: "03",
                  icon: "phone_in_talk",
                  title: isHi ? "कॉल करें और काम शुरू करें" : "Call & Start Working",
                  desc: isHi ? "नियोक्ता से सीधे फ़ोन पर बात करके वेतन और समय तय करें।" : "Call the hirer directly by phone and start earning daily wages."
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
                  <span>{isHi ? "मज़दूरों के लिए" : "For Workers"}</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface">
                  {isHi ? "नौकरी कैसे खोजें?" : "How to Find a Job"}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">filter_alt</span>
                    <span>{isHi ? "ब्राउज़ पेज पर जाकर पसंदीदा कौशल और दूरी फ़िल्टर सेट करें।" : "Set your preferred skill and distance radius on the Jobs page."}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                    <span>{isHi ? "स्थान अनुमति चालू करें ताकि गाँव के पास की सटीक नौकरियाँ दिखें।" : "Enable location access to get precise jobs in your village radius."}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">call</span>
                    <span>{isHi ? "नौकरी कार्ड पर 'अभी कॉल करें' बटन दबाकर नियोक्ता को सीधे फ़ोन मिलाएँ।" : "Click 'Call Now' on the job card to ring the hirer directly."}</span>
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
                  {isHi ? "काम कैसे पोस्ट करें?" : "How to Post a Job"}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-lg mt-0.5">edit_note</span>
                    <span>{isHi ? "नियोक्ता खाते से लॉगिन करें और '+ काम डालें' बटन पर क्लिक करें।" : "Log in with an employer account and click the '+ Post Work' navbar button."}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-lg mt-0.5">payments</span>
                    <span>{isHi ? "काम का शीर्षक, कौशल, दैनिक वेतन (₹) और गाँव/स्थान भरें।" : "Fill job title, required skill, daily pay rate (₹), and village location."}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-lg mt-0.5">groups</span>
                    <span>{isHi ? "काम सबमिट करने के बाद पास के स्थानीय मज़दूर आपसे सीधे कॉल करेंगे।" : "After posting, local skilled workers will call you directly."}</span>
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
              <span>{isHi ? "सुरक्षा केंद्र" : "Fraud Prevention"}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">
              {isHi ? "फ़ेक या धोखाधड़ी वाली नौकरी की शिकायत करें" : "Report a Fake or Suspicious Job"}
            </h2>
            <p className="text-xs md:text-sm text-on-surface-variant mt-1">
              {isHi
                ? "यदि किसी नौकरी में आपसे पैसे मांगे गए हैं या धोखाधड़ी की कोशिश हुई है, तो तुरंत नीचे रिपोर्ट दर्ज करें।"
                : "If a job listing asks for money, registration fees, or seems fraudulent, submit a report below."}
            </p>

            {reportSubmitted ? (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-emerald-700">check_circle</span>
                <span className="text-sm font-bold">
                  {isHi ? "शिकायत दर्ज कर ली गई है! हमारी टीम 24 घंटे के अंदर जांच करेगी।" : "Report submitted successfully! Our safety team will review it within 24 hours."}
                </span>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    {isHi ? "नौकरी का नाम / विषय *" : "Job Title / Subject *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={reportData.jobTitle}
                    onChange={(e) => setReportData({ ...reportData, jobTitle: e.target.value })}
                    placeholder={isHi ? "उदा. प्लम्बर की नौकरी" : "e.g. Electrician job in Rampur"}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-error"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    {isHi ? "नियोक्ता का नाम या नंबर" : "Employer Name or Phone"}
                  </label>
                  <input
                    type="text"
                    value={reportData.employerName}
                    onChange={(e) => setReportData({ ...reportData, employerName: e.target.value })}
                    placeholder={isHi ? "उदा. 9876543210" : "e.g. Ramesh Singh / 9876543210"}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-error"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    {isHi ? "शिकायत का कारण *" : "Reason for Report *"}
                  </label>
                  <select
                    required
                    value={reportData.reason}
                    onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-error"
                  >
                    <option value="">{isHi ? "-- कारण चुनें --" : "-- Select Reason --"}</option>
                    <option value="asked_money">{isHi ? "नौकरी के लिए पैसे मांगे (Asked for Money)" : "Asked for money or deposit"}</option>
                    <option value="fake_location">{isHi ? "गलत स्थान या पता (Fake Location)" : "Fake or non-existent location"}</option>
                    <option value="abuse">{isHi ? "अभद्र व्यवहार या धोखाधड़ी (Abusive / Scam)" : "Abusive behavior or scam"}</option>
                    <option value="other">{isHi ? "अन्य कारण (Other)" : "Other reason"}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    {isHi ? "अतिरिक्त विवरण" : "Additional Details"}
                  </label>
                  <textarea
                    rows={3}
                    value={reportData.details}
                    onChange={(e) => setReportData({ ...reportData, details: e.target.value })}
                    placeholder={isHi ? "घटना का विवरण लिखें..." : "Describe what happened..."}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm focus:outline-none focus:border-error"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-error text-on-error font-bold text-sm hover:brightness-110 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">flag</span>
                    <span>{isHi ? "शिकायत सबमिट करें" : "Submit Report"}</span>
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
              <span>{isHi ? "वीडियो गाइड" : "Video Guides"}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">
              {isHi ? "वीडियो ट्यूटोरियल देखें" : "Video Tutorials"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {videoTutorials.map((v, i) => (
                <div key={i} className="rounded-2xl border border-outline-variant/30 overflow-hidden bg-surface-container-low group hover:shadow-md transition-all">
                  <div className={`${v.thumb} h-40 flex items-center justify-center relative`}>
                    <span className="material-symbols-outlined text-5xl text-white group-hover:scale-110 transition-transform">
                      play_circle_filled
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      {v.duration}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-on-surface text-sm">{v.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )} */}

        {/* ─── 6. FAQs ─── */}
        {(activeTab === "all" || activeTab === "faq") && (
          <section id="faq" className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-xs">
            <div className="flex items-center gap-2.5 text-primary font-bold text-sm mb-2">
              <span className="material-symbols-outlined text-xl">quiz</span>
              <span>{isHi ? "सवाल-जवाब" : "Questions & Answers"}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">
              {isHi ? "अक्सर पूछे जाने वाले प्रश्न (FAQs)" : "Frequently Asked Questions"}
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
            {isHi ? "क्या आपको और सहायता चाहिए?" : "Still need help?"}
          </h3>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1 max-w-md mx-auto">
            {isHi
              ? "हमारी कस्टमर सपोर्ट टीम आपकी सेवा में 24/7 उपलब्ध है।"
              : "Our customer support team is available 24/7 to assist workers and hirers."}
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
