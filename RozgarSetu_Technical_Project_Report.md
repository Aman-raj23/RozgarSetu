# RozgarSetu 🌾 — Rural Job Platform: Full Technical Project Report Specification
This document is a highly structured, comprehensive technical blueprint and prompt package for **RozgarSetu**, a full-stack MERN application built specifically for connecting rural workers with nearby job opportunities in India. 

Use the guide below and the exhaustive code descriptions in this file to prompt **Claude** (or any advanced LLM) to generate a professional, academic-grade project report (e.g., 30-50 pages) in Microsoft Word format, complete with formatting guidelines, mathematical formulations, and system designs.

---

# PART A: META-INSTRUCTIONS FOR CLAUDE (HOW TO GENERATE THE WORD REPORT)

> **Instructions for Claude when compiling this into an MS Word Report:**
>
> 1. **Academic/Corporate Tone:** Write in a highly professional, academic style suitable for a final-year engineering thesis or corporate system architecture proposal.
> 2. **Chapter Breakdown:** Structure the generated MS Word document into the following standard sections:
>    - **Title Page:** Project Title, Course/Organization Name, Submitted By, Date.
>    - **Abstract & Executive Summary:** Executive digest of the system, its social impact, and technical highlights (250-400 words).
>    - **Chapter 1: Introduction & Domain Analysis:** Problem statement, limitations of current job portals for rural populations, target demographics, and social vision.
>    - **Chapter 2: Requirements Analysis & Specification:** Functional and non-functional requirements, use-case descriptions, and system constraints.
>    - **Chapter 3: System Architecture & Folder Topography:** MERN stack integration, component layout, detailed breakdown of the backend and frontend structure.
>    - **Chapter 4: Database Design & Schema Modeling:** Entity-Relationship (ER) mapping, Mongoose database schemas, compound indexing, validation layers.
>    - **Chapter 5: Technical Algorithm Deep-Dive:** Mathematical details of Haversine Distance, Jaccard Similarity, Normalization Equations, Multi-Factor Ranking, Rule-Based Fraud Detection.
>    - **Chapter 6: API Specifications & Security Architecture:** RESTful endpoints, payload constraints, JSON schemas, JWT authentication lifecycle, bcrypt hashing.
>    - **Chapter 7: Frontend Interface & Styling System:** Design system, typography (Inter/Sans), Tailwind CSS v4 custom theme, micro-animations, glassmorphism, localized translation pipeline.
>    - **Chapter 8: Installation, Setup & Deployment Blueprint:** Step-by-step instructions for local running, Atlas DB configuration, Render backend hosting, Vercel frontend hosting.
>    - **Chapter 9: Conclusion, Limitations & Future Scope:** Summary of findings, current technical bottlenecks, and future AI/feature enhancements.
> 3. **Formatting Suggestions for MS Word:**
>    - **Typography:** Use **Georgia** or **Times New Roman** for Headings, and **Calibri** or **Inter** (11pt, 1.15 line spacing) for body text.
>    - **Table Designs:** Styled tables with header row background color `#EE7A14` (primary theme orange) or `#059669` (accent green) with white bold text, alternating light gray rows (`#F1F5F9`).
>    - **Mathematical Formulas:** Format all equations using MS Word’s Equation Editor or standard LaTeX markup representing complete mathematical steps.
>    - **Code Snippets:** Surround code blocks with light-gray borders, single-line spacing, and 9.5pt Consolas font with a background of `#F8FAF8`.

---

# PART B: PROJECT GENESIS AND DOMAIN CONTEXT

## 1. Domain Background
Rural India represents one of the largest unorganized labor markets in the world. Workers such as electricians, plumbers, farmers, carpenters, painters, and tailors depend on daily wage contracts. The traditional employment search mechanism in these areas relies almost entirely on localized word-of-mouth networks, which are highly fragmented, geographically limited, and susceptible to severe middleman exploitation.

## 2. The Problem Statement
Existing mainstream employment platforms (such as LinkedIn, Indeed, or Naukri.com) are structurally incompatible with rural labor ecosystems for several key reasons:
1. **High Cognitive Barrier:** Text-heavy, English-dominant forms require complex digital literacy.
2. **Missing Hyper-Local Coordinates:** Traditional job sites display search radii of 50-100 km, whereas rural daily laborers require opportunities within immediate walking, cycling, or local transport distance (typically under 10 km).
3. **Priceless Exploitation & Information Asymmetry:** Workers are often hired without pre-negotiated salaries, resulting in wage theft.
4. **Lack of Trust / Rampant Scams:** High rates of fake/suspicious job offers (multi-level marketing schemes, lottery traps) target vulnerable job-seekers.
5. **No Visual or Vocal Assistance:** Lack of voice search prevents semi-literate or illiterate individuals from discovering jobs.

## 3. The RozgarSetu Solution
**RozgarSetu (रोज़गारसेतु)**—meaning *Employment Bridge*—is a mobile-first, dual-language MERN (MongoDB, Express, React, Node.js) web application designed specifically to bridge this gap. Key highlights:
* **Zero-Cost Operation:** Built completely without premium, third-party APIs (utilizing browser geocoding, Nominatim OpenStreetMap, and browser-native Web Speech synthesis).
* **Location-Aware Smart Matching:** Calculates real-time geographical distance using the Haversine formula to surface jobs strictly within reasonable travel limits.
* **Hybrid Recommendation Algorithm:** Combines skill matching (Jaccard similarity index), geographical proximity, and daily salary weights.
* **OLX-Style Interactive Bargaining:** Empowers workers with an interactive negotiation interface to adjust salaries directly and instantly generate calling hooks with their proposed wages.
* **In-Built Anti-Fraud Guard:** Employs an automated, rule-based screening engine that flags suspicious salary claims, incomplete listings, or fraudulent titles prior to publication.
* **Dual-Language Interoperability:** Implements full English-Hindi internationalization (i18n) across all pages, allowing a seamless toggle to instantly re-render the layout with native terminology.

---

# PART C: COMPREHENSIVE ARCHITECTURE & DIRECTORY STRUCTURE

RozgarSetu is architected using a decoupled **Client-Server paradigm**. The frontend client is built with React 19 and bundled using Vite, while the backend is an Express.js server interacting with MongoDB Atlas via the Mongoose ODM layer.

```mermaid
graph TD
    User([Rural User / Employer]) -->|Interacts with| ReactClient[Vite + React 19 Frontend Client]
    ReactClient -->|Auth: Bearer JWT Token| ExpressServer[Express.js Server]
    ExpressServer -->|Business Logic| Controllers[Auth & Job Controllers]
    Controllers -->|Geospatial Proximity| Haversine[Haversine Utility]
    Controllers -->|Smart Matching| Recommendation[Recommendation Engine]
    Controllers -->|Scan Job Posts| FraudDetection[Anti-Fraud Guard]
    Controllers -->|Schema Validation & Indexes| Mongoose[Mongoose Models]
    Mongoose -->|Persistent Data| MongoAtlas[(MongoDB Atlas Cloud)]
    ReactClient -->|Free Geocoding| Nominatim[OSM Nominatim API]
    ReactClient -->|Free Speech-to-Text| WebSpeech[Browser Web Speech API]
```

## Complete Project Directory Topography

```
RozgarSetu/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection and status indicators
│   ├── controllers/
│   │   ├── authController.js     # User Register, Login, Profile updates, JWT creation
│   │   └── jobController.js      # CRUD operations, Nearby jobs controller & recommendations
│   ├── middleware/
│   │   └── auth.js               # JWT decryption & validation middleware
│   ├── models/
│   │   ├── User.js               # User Schema (Worker / Employer, Phone, bcrypt triggers)
│   │   └── Job.js                # Job Schema (Location, Skills array, Anti-fraud flags, Indexes)
│   ├── routes/
│   │   ├── authRoutes.js         # Endpoint mapping for authentication actions
│   │   └── jobRoutes.js          # Endpoint mapping for job creation, queries, and deletion
│   ├── utils/
│   │   ├── haversine.js          # Mathematical calculation of distances on a sphere
│   │   ├── recommendation.js     # Ranked sorting engine based on Skill, Distance, and Salary
│   │   └── fraudDetection.js     # Rule-based scanner flagging suspicious job listings
│   ├── server.js                 # Primary backend entry-point, Express configurations, global error handlers
│   ├── .env                      # Secure environmental variables (JWT Secret, DB URI)
│   └── package.json              # Backend dependencies (bcryptjs, cors, dotenv, express, jwt, mongoose)
│
├── frontend/
│   ├── public/                   # Static assets (icons, images)
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Centralized Axios instance with request and response interceptors
│   │   ├── components/
│   │   │   ├── JobCard.jsx       # Custom job item showcasing price adjustments, distance, match scores
│   │   │   ├── Navbar.jsx        # Dual-language responsive header
│   │   │   ├── ProtectedRoute.jsx# Navigation guard enforcing session validation and roles
│   │   │   ├── SkillSelector.jsx # Selection grid with localized icons for 12 rural skills
│   │   │   └── VoiceSearch.jsx   # Micro-interactive speech recognizer (Eng/Hindi native dialects)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global session state (stores token, handles profile caches)
│   │   │   ├── LanguageContext.jsx# Core internationalization provider
│   │   │   └── i18n.js           # Full English-Hindi localization dictionary (170 keys)
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Interactive hero landing page with voice & skill filters
│   │   │   ├── Jobs.jsx          # Comprehensive, searchable job grid with skeleton states
│   │   │   ├── JobDetail.jsx     # Detail view displaying spatial distance maps and direct dialers
│   │   │   ├── Login.jsx         # Credentials input form
│   │   │   ├── Register.jsx      # Role selector form (Worker / Employer registration)
│   │   │   ├── EmployerDashboard.jsx # Employer job metrics dashboard (total, active, flagged, avg pay)
│   │   │   └── PostJob.jsx       # Multi-step job posting interface with automated anti-fraud response
│   │   ├── utils/
│   │   │   └── geocode.js        # Nominatim reverse geocoder utility with local memory caches
│   │   ├── App.jsx               # Router configurations and Context injectors
│   │   ├── index.css             # Tailwind CSS v4 directives, glassmorphic layout styles, skeleton layers
│   │   ├── main.jsx              # React mounting script
│   │   └── vite.config.js        # Vite configurations using @tailwindcss/vite
│   ├── package.json              # Frontend dependencies (axios, react, react-dom, react-router-dom)
│   └── vite.config.js            # Bundler configurations
└── README.md                     # Initial setup documentation
```

---

# PART D: DEEP TECHNICAL SPECIFICATIONS OF CORE FEATURES

## 1. Geospatial Job Proximity Engine (Haversine Formula)
To locate jobs strictly within a rural worker's proximity without relying on paid Google Maps APIs, RozgarSetu utilizes the **Haversine Formula**. This calculates the shortest distance over the Earth's spherical surface between a worker's coordinates $(\phi_1, \lambda_1)$ and a job listing's coordinates $(\phi_2, \lambda_2)$.

### Mathematical Formulation
Given:
* $R = 6371$ km (Mean radius of Earth)
* $\Delta \phi = \phi_2 - \phi_1$ (Difference in latitude in radians)
* $\Delta \lambda = \lambda_2 - \lambda_1$ (Difference in longitude in radians)

The spherical distance $d$ is determined via:
$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1) \cdot \cos(\phi_2) \cdot \sin^2\left(\frac{\Delta \lambda}{2}\right)$$
$$c = 2 \cdot \operatorname{atan2}\left(\sqrt{a}, \sqrt{1 - a}\right)$$
$$d = R \cdot c$$

### Code Implementation (`backend/utils/haversine.js`)
```javascript
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in kilometers
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Absolute distance in km
}
```

---

## 2. Hybrid Job Recommendation & Ranking Algorithm
The application does not simply sort jobs chronologically. It uses a **Hybrid Recommendation Engine** to calculate an absolute Relevance Score ($Score_{relevance}$) for each job relative to the search query and the user's geocordinates. The score is a weighted linear combination of three normalized coefficients:

### Mathematical Modeling
$$Score_{relevance} = (0.5 \times Score_{skill}) + (0.3 \times Score_{distance}) + (0.2 \times Score_{salary})$$

1. **Skill Match ($Score_{skill}$):** Employs **Jaccard Similarity Index** comparing the set of worker skills ($S_{worker}$) with the job requirement skills ($S_{job}$):
   $$Score_{skill} = J(S_{worker}, S_{job}) = \frac{|S_{worker} \cap S_{job}|}{|S_{worker} \cup S_{job}|}$$

2. **Distance Match ($Score_{distance}$):** Inverses normalized distance to favor closer listings. Let $d_{max}$ be the maximum distance within the retrieved batch:
   $$Score_{distance} = 1 - \frac{d}{d_{max}}$$

3. **Salary Match ($Score_{salary}$):** Normalizes daily wage $Salary$ relative to the highest offered salary in the system $Salary_{max}$:
   $$Score_{salary} = \frac{Salary}{Salary_{max}}$$

### Code Implementation (`backend/utils/recommendation.js`)
```javascript
const haversine = require("./haversine");

function rankJobs(jobs, userLat, userLng, userSkills = []) {
  if (!jobs || jobs.length === 0) return [];

  const normalizedUserSkills = userSkills.map((s) => s.toLowerCase().trim());

  // Step 1: Calculate raw distance and Jaccard similarity metrics
  const jobsWithMetrics = jobs.map((job) => {
    const distance = haversine(userLat, userLng, job.location.lat, job.location.lng);

    const jobSkills = (job.skills || []).map((s) => s.toLowerCase().trim());
    const intersection = normalizedUserSkills.filter((s) => jobSkills.includes(s));
    const union = new Set([...normalizedUserSkills, ...jobSkills]);
    const skillScore = union.size > 0 ? intersection.length / union.size : 0;

    return {
      ...job.toObject ? job.toObject() : job,
      distance: Math.round(distance * 10) / 10,
      skillScore,
    };
  });

  // Step 2: Establish boundaries for normalization
  const maxDistance = Math.max(...jobsWithMetrics.map((j) => j.distance), 1);
  const maxSalary = Math.max(...jobsWithMetrics.map((j) => j.salary), 1);

  // Step 3: Apply relative weights and calculate final scores
  const rankedJobs = jobsWithMetrics.map((job) => {
    const distanceScore = 1 - job.distance / maxDistance; // Proximity score
    const salaryScore = job.salary / maxSalary;           // Salary utility score

    const relevanceScore =
      job.skillScore * 0.5 +
      distanceScore * 0.3 +
      salaryScore * 0.2;

    return {
      ...job,
      distanceScore: Math.round(distanceScore * 100) / 100,
      salaryScore: Math.round(salaryScore * 100) / 100,
      relevanceScore: Math.round(relevanceScore * 100) / 100,
    };
  });

  // Step 4: Sort descending by relevance score
  return rankedJobs.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
```

---

## 3. Automated Anti-Fraud Guard (Pre-Publication Scan)
To protect rural job-seekers from predatory employers and scam networks, a dedicated **Fraud Detection System** acts as middleware before job records are committed to MongoDB. Listings that trip any of the security thresholds are automatically flagged (`isSuspicious: true`) and their violation metrics are recorded in `suspiciousReasons`.

### Security Threshold Constants
* **Minimum Daily Wage:** Under ₹100/day ($MIN\_SALARY$) → flagged (highly exploitative or human-trafficking indicator).
* **Maximum Daily Wage:** Over ₹50,000/day ($MAX\_SALARY$) → flagged (implausible bait scam, pyramid schemes, or lottery fraud).
* **Under-described Content:** Total characters $< 20$ → flagged (scam posts lack details).
* **Suspicious Lexicon Map:** String checks against blacklisted keywords (e.g., *"lottery"*, *"easy cash"*, *"mlm"*, *"guaranteed income"*, *"no work"*).

### Code Implementation (`backend/utils/fraudDetection.js`)
```javascript
const SUSPICIOUS_KEYWORDS = [
  "lottery", "free money", "no work", "guaranteed income",
  "mlm", "pyramid", "easy cash", "click here",
  "earn from home without work", "lakhs per day",
];

const MIN_SALARY = 100;
const MAX_SALARY = 50000;
const MIN_DESCRIPTION_LENGTH = 20;

function detectFraud(jobData) {
  const reasons = [];

  // 1. Check salary bounds
  if (jobData.salary < MIN_SALARY) {
    reasons.push(`Salary ₹${jobData.salary} is unrealistically low (minimum expected: ₹${MIN_SALARY}/day)`);
  }
  if (jobData.salary > MAX_SALARY) {
    reasons.push(`Salary ₹${jobData.salary} is unrealistically high (maximum expected: ₹${MAX_SALARY}/day)`);
  }

  // 2. Validate details length
  if (!jobData.description || jobData.description.trim().length < MIN_DESCRIPTION_LENGTH) {
    reasons.push(`Description is too short or missing (minimum ${MIN_DESCRIPTION_LENGTH} characters)`);
  }

  // 3. Ensure contact pathways exist
  if (!jobData.phone || jobData.phone.trim().length === 0) {
    reasons.push("Phone number is missing");
  }

  // 4. Analyze keywords in title
  if (jobData.title) {
    const lowerTitle = jobData.title.toLowerCase();
    const foundKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => lowerTitle.includes(kw));
    if (foundKeywords.length > 0) {
      reasons.push(`Title contains suspicious keywords: ${foundKeywords.join(", ")}`);
    }
  }

  return {
    isSuspicious: reasons.length > 0,
    suspiciousReasons: reasons,
  };
}
```

---

## 4. OLX-Style Interactive Price Bargaining Interface
Since daily laborers in rural areas are highly sensitive to price and often negotiate their day rates, RozgarSetu implements an **OLX-Style Interactive Price Bargaining Component** directly on the job cards (for users registered under the `worker` role). 

* Workers can adjust the listed wage using coarse steps (e.g., increments of ₹50 or ₹100).
* The UI dynamically calculates the difference compared to the original offer.
* Clicking "Call Now" dynamically formats a local calling intent (`tel:<number>`) pre-negotiated by the worker’s pricing selection.

### Key Logic in Card
```javascript
const step = salary >= 1000 ? 100 : 50;
const [askingPrice, setAskingPrice] = useState(salary);
const increasePrice = () => setAskingPrice((p) => p + step);
const decreasePrice = () => setAskingPrice((p) => Math.max(step, p - step));
```

---

## 5. Client-Side Speech Recognition Pipeline (Voice Search)
To accommodate semi-literate users, the platform integrates a native **Speech-to-Text Pipeline** using Chrome's Web Speech API. 

* The system detects if the user has set their language toggle to English or Hindi (`lang === "hi"`).
* It dynamically reconfigures the speech recognizer’s locale target (switching between `hi-IN` and `en-IN`).
* It automatically intercepts vocal commands, updates search contexts, and routes queries to `jobs?search=...`.

### Code Implementation (`frontend/src/components/VoiceSearch.jsx`)
```javascript
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function VoiceSearch({ onResult, className = "" }) {
  const { lang, t } = useLanguage();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      if (event.results[0].isFinal) {
        setListening(false);
        onResult?.(result);
      }
    };

    recognition.onerror = (e) => {
      console.error(e.error);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;

    return () => recognition.abort();
  }, [lang, onResult]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setListening(true);
    }
  };

  if (!supported) return null;

  return (
    <button onClick={toggleListening} className={listening ? "bg-red-500 text-white animate-pulse" : "bg-orange-50"}>
      {listening ? t("voice_listening") : t("voice_start")}
    </button>
  );
}
```

---

## 6. Reverse Geocoding with Client-Side Memory Caching
To maintain zero runtime costs, RozgarSetu translates coordinate strings (such as `21.2500, 81.6300`) into descriptive village or district names using the **OpenStreetMap Nominatim API**. To comply with Nominatim's strict usage limits and optimize loading times, the frontend implements an in-memory **Map Cache**.

### Code Implementation (`frontend/src/utils/geocode.js`)
```javascript
const cache = new Map();

export async function getLocationName(lat, lng) {
  if (!lat || !lng) return "";
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;

  if (cache.has(key)) return cache.get(key); // Fast lookup

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    );
    if (!res.ok) throw new Error("OSM Network Failure");

    const data = await res.json();
    const addr = data.address || {};

    const parts = [];
    const place = addr.village || addr.town || addr.city || addr.suburb || "";
    if (place) parts.push(place);

    const district = addr.county || addr.state_district || "";
    if (district && district !== place) parts.push(district);

    const state = addr.state || "";
    if (state && state !== district) parts.push(state);

    const result = parts.length > 0 ? parts.join(", ") : "Nearby Location";
    cache.set(key, result);
    return result;
  } catch (err) {
    console.warn("Nominatim Geocoding Failed:", err.message);
    return "";
  }
}
```

---

# PART E: DATABASE SCHEMAS & COMPOUND INDEXING

RozgarSetu organizes its collections in MongoDB using optimized structures with geospatial indexing for high-performance near-proximity calculations.

## 1. User Database Model (`backend/models/User.js`)
```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["worker", "employer"],
      required: [true, "Role is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    location: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

## 2. Job Database Model (`backend/models/Job.js`)
```javascript
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one skill is required",
      },
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    location: {
      lat: {
        type: Number,
        required: [true, "Location latitude is required"],
      },
      lng: {
        type: Number,
        required: [true, "Location longitude is required"],
      },
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    isSuspicious: {
      type: Boolean,
      default: false,
    },
    suspiciousReasons: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Indexes for ultra-efficient geocount and matching queries
jobSchema.index({ "location.lat": 1, "location.lng": 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ employerId: 1 });

module.exports = mongoose.model("Job", jobSchema);
```

---

# PART F: RESTFUL API SPECIFICATIONS

| Route Path | HTTP Verb | Authentication Requirement | Purpose / Operational Context |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | Public (None) | Validates name, unique email, 10-digit Indian phone number, and creates the User record with a hashed password, returning a JWT token. |
| `/api/auth/login` | `POST` | Public (None) | Validates credentials against bcrypt hashes and returns a signed 7-day JWT token on success. |
| `/api/auth/me` | `GET` | Bearer JWT | Retrieves user profile metadata (excluding sensitive fields like hashed password) based on the token. |
| `/api/auth/profile` | `PUT` | Bearer JWT | Allows users to edit their registered full name, primary phone number, and geocoordinates. |
| `/api/jobs` | `GET` | Public (None) | Fetches all available jobs, supports optional skill filtering via query parameters, and sorts chronologically. |
| `/api/jobs/nearby` | `GET` | Public (None) | Accepts `lat`, `lng`, `skill`, and optional `radius` (default: 10km) query parameters. Computes Haversine distance, filters accordingly, and ranks results. |
| `/api/jobs/:id` | `GET` | Public (None) | Retrieves a specific job listing by its unique `ObjectId`, populating employer metadata. |
| `/api/jobs` | `POST` | Bearer JWT (Employer Only) | Accepts title, description, skills array, salary, location object, and phone. Scans details using the Anti-Fraud Engine and posts the job. |
| `/api/jobs/:id` | `PUT` | Bearer JWT (Owner Only) | Allows employers to update job listings, triggering a re-scan of the updated data through the anti-fraud module. |
| `/api/jobs/:id` | `DELETE` | Bearer JWT (Owner Only) | Permanently deletes a job listing. Enforces owner authorization checks. |

---

# PART G: FRONTEND DESIGN LANGUAGE AND THEME SPECS

RozgarSetu uses custom Tailwind CSS v4 design tokens to deliver an accessible, mobile-first, and highly intuitive user interface.

## Custom Theme Tokens (`frontend/src/index.css`)
* **Primary (Orange Gradient):** Representing agriculture, warmth, and trust. Base primary color is `#EE7A14` (`--color-primary-500`).
* **Accent (Emerald Green):** Representing successful employment and earning growth. Base accent color is `#10B981` (`--color-accent-500`).
* **Dark (Sleek Slate):** Deep slates and solid text fields to avoid generic, unpolished pure blacks. Dark baseline is `#0F172A` (`--color-dark-900`).
* **Typography:** `Inter` typeface for high legibility across variable screen sizes.
* **Glassmorphism:** Leverages high-performance CSS backdrops:
  ```css
  .glass {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  ```

---

# PART H: DEPLOYMENT AND SETUP BLUEPRINT

## 1. MongoDB Atlas Cluster Provisioning (No-Cost Tier)
1. Register a free account at [MongoDB Cloud Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Deploy a **Shared M0 Cluster** named `RozgarSetu` on a nearby cloud region (e.g., AWS / Mumbai for Indian operations).
3. Under Database Access, create a user `rozgarsetu_admin` with a secure auto-generated password.
4. Under Network Access, whitelist `0.0.0.0/0` (allowing public access from hosting environments like Render).
5. Retrieve the connection string:
   `mongodb+srv://rozgarsetu_admin:<password>@cluster0.xxxxx.mongodb.net/rozgarsetu?retryWrites=true&w=majority`

## 2. Environment Configurations
### Backend Environment Configuration (`backend/.env`)
```env
MONGO_URI=mongodb+srv://rozgarsetu_admin:YOUR_COPIED_PASSWORD@cluster0.xxxxx.mongodb.net/rozgarsetu?retryWrites=true&w=majority
JWT_SECRET=44ef91ba63ea5ad256c70b8098c4a4... (Generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
PORT=5000
```
### Frontend Environment Configuration (`frontend/.env`)
```env
VITE_API_URL=https://rozgarsetu-api.onrender.com/api
```

## 3. Local Installation Steps
```bash
# Clone the repository and enter directory
cd RozgarSetu

# --- Set Up Backend ---
cd backend
npm install
npm run dev  # Launches nodemon on port 5000

# --- Set Up Frontend (In a separate terminal shell) ---
cd ../frontend
npm install
npm run dev  # Launches Vite development server on port 5173
```

## 4. Production Deployment Workflow
* **Backend Hosting on Render (Free Web Service):**
  * Connect your GitHub Repository.
  * Define Root Directory: `backend`
  * Build Command: `npm install`
  * Start Command: `node server.js`
  * Bind Environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT=5000`).
* **Frontend Hosting on Vercel (Free Static Hosting):**
  * Import repository into Vercel.
  * Define Root Directory: `frontend`
  * Build Command: `npm run build`
  * Output Directory: `dist`
  * Bind Environmental variable: `VITE_API_URL` pointing to Render api base.

---

# PART I: SUGGESTED THESIS / REPORT STRUCTURING PROMPT FOR CLAUDE
Copy and paste this exact prompt into Claude along with the markdown file above:

```
Hello Claude, I need you to generate a highly detailed, professional, and comprehensive Academic Project Report for my final-year engineering thesis on the project "RozgarSetu — Rural Job Platform". 

I have provided the complete technical blueprint, code architectures, database schemas, API specs, and algorithms in the accompanying text.

Please generate a massive, detailed, and well-written thesis draft. Make sure to:
1. Expand each chapter into thorough explanations. Write detailed, academic paragraphs about the socio-economic challenges of rural daily wage laborers and how RozgarSetu directly addresses them.
2. In the "Technical Algorithm Deep-Dive" chapter, provide complete mathematical write-ups of the Haversine formula, Jaccard Similarity, and Multi-Factor Job Ranking engine. Detail the normalization steps and the linear combination approach.
3. Incorporate complete code block implementations for crucial files: haversine.js, recommendation.js, fraudDetection.js, User.js, and Job.js. Detail how they integrate.
4. Draft the full API Endpoint specification table and detail the purpose of each endpoint.
5. Provide step-by-step setup guides for both development and production (MongoDB Atlas, Render, Vercel).
6. Format your output clearly so that I can easily copy-paste it directly into MS Word to make my final project report. Use clear typography style guides, formatted tables for database models and APIs, and highlighted code sections.
```
