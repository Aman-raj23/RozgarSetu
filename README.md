# RozgarSetu 🌾 — Rural Job Platform

A full-stack MERN application that connects rural workers with nearby job opportunities. Built with React, Node.js, Express, and MongoDB.

---

## 🚀 Features

- **Worker & Employer roles** — register as a worker to find jobs or an employer to post them
- **Location-based job search** — uses browser geolocation + Haversine formula to find jobs within 10 km
- **Smart recommendations** — ranks jobs by skill match, distance, and salary
- **Fraud detection** — flags suspicious jobs with unrealistic salary or missing details
- **Voice search** — speak to search for jobs using Web Speech API
- **Direct calling** — contact employers directly via phone (tel: links)
- **Mobile-first design** — large buttons, simple navigation for rural users

---

## 📁 Project Structure

```
RozgarSetu/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Profile
│   │   └── jobController.js      # CRUD + Nearby + Recommendations
│   ├── middleware/auth.js        # JWT authentication
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Job.js                # Job schema with fraud flags
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   ├── utils/
│   │   ├── haversine.js          # Distance calculation
│   │   ├── recommendation.js     # Smart ranking engine
│   │   └── fraudDetection.js     # Fraud detection logic
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js          # Axios instance
│   │   ├── context/AuthContext.jsx # Auth state management
│   │   ├── components/           # Reusable components
│   │   └── pages/                # Page components
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** v18+ — [Download here](https://nodejs.org/)
- **Git** — [Download here](https://git-scm.com/)
- A web browser (Chrome recommended for voice search)

---

### Step 1: MongoDB Atlas Setup (Free — No Credit Card)

MongoDB Atlas gives you a **free 512MB database** in the cloud. Here's how to set it up:

#### 1.1 Create an Account
1. Go to **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with Google or email (completely free)
3. Choose the **FREE Shared** plan

#### 1.2 Create a Cluster
1. After signing in, click **"Build a Database"**
2. Select **M0 Free Tier** (the free option)
3. Choose a cloud provider (any — AWS, Google Cloud, or Azure)
4. Choose a region **closest to you** (e.g., Mumbai for India)
5. Name it **"RozgarSetu"** (or keep default)
6. Click **"Create Deployment"**
7. Wait 1-3 minutes for it to be ready

#### 1.3 Create a Database User
1. You'll be prompted to create a user
2. **Username:** `rozgarsetu_admin` (or anything you like)
3. **Password:** Click **"Autogenerate Secure Password"** and **COPY THIS PASSWORD** somewhere safe
4. Click **"Create Database User"**

#### 1.4 Allow Network Access
1. You'll be prompted for connection method
2. Click **"Add My Current IP Address"**
3. For deployment, also add: `0.0.0.0/0` (allows all IPs — needed for Render)
4. Click **"Finish and Close"**

#### 1.5 Get Your Connection String
1. Click **"Connect"** button on your cluster
2. Choose **"Drivers"**
3. Copy the connection string. It looks like:
   ```
   mongodb+srv://rozgarsetu_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **Replace `<password>`** with the password you copied in step 1.3
5. **Add the database name** `rozgarsetu` before the `?`:
   ```
   mongodb+srv://rozgarsetu_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rozgarsetu?retryWrites=true&w=majority
   ```

That's your `MONGO_URI`! Save it for the next step.

---

### Step 2: Backend Setup

```bash
# Navigate to backend
cd RozgarSetu/backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env
```

**Important:** Make sure to place your real keys inside the **`.env`** file. Do not put sensitive information in `.env.example`, as that file is usually uploaded to source control like GitHub!

Edit `backend/.env` with your values:
```env
MONGO_URI=mongodb+srv://rozgarsetu_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rozgarsetu?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_change_this_to_something_random
PORT=5000
```

> **How do I get a JWT_SECRET?**  
> A JWT Secret is just a random, complex string of characters used to securely sign user login tokens.  
> You can generate a secure one quickly by running this command in your terminal:  
> `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`  
> Copy the output and paste it as your `JWT_SECRET` in the `.env` file.

Start the backend:
```bash
npm run dev
```

You should see:
```
🚀 RozgarSetu Server running on port 5000
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

---

### Step 3: Frontend Setup

Open a **new terminal**:

```bash
# Navigate to frontend
cd RozgarSetu/frontend

# Install dependencies (already done, but just in case)
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

### Step 4: Test the App

1. **Register** as an **Employer** — fill name, email, password, phone
2. **Post a Job** — go to Post Job page, fill details
3. **Open another browser** or use incognito
4. **Register** as a **Worker**
5. **Browse Jobs** — you should see the job you posted
6. **Allow location** when prompted for nearby filtering
7. **Try voice search** — click the mic icon and say "electrician"

---

## 📡 API Routes

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Current user | Yes |
| GET | `/api/jobs` | All jobs | No |
| GET | `/api/jobs/nearby` | Nearby jobs (with ranking) | No |
| GET | `/api/jobs/:id` | Job details | No |
| POST | `/api/jobs` | Create job | Yes (Employer) |
| PUT | `/api/jobs/:id` | Update job | Yes (Owner) |
| DELETE | `/api/jobs/:id` | Delete job | Yes (Owner) |

**Query params for `/api/jobs/nearby`:**
- `lat` — user latitude (required)
- `lng` — user longitude (required)
- `skill` — comma-separated skills
- `radius` — search radius in km (default: 10)

---

## 🚀 Deployment Guide

### Deploy Backend to Render (Free)

1. Push your code to a **GitHub repository**
2. Go to **https://render.com** and sign up (free)
3. Click **"New" → "Web Service"**
4. Connect your GitHub repo
5. Configure:
   - **Name:** `rozgarsetu-api`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
6. Add **Environment Variables:**
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = your secret key
   - `PORT` = 5000
7. Click **"Create Web Service"**
8. Wait for deployment (~5 min). Note your URL: `https://rozgarsetu-api.onrender.com`

### Deploy Frontend to Vercel (Free)

1. Go to **https://vercel.com** and sign up (free)
2. Click **"New Project"** → Import your GitHub repo
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variable:**
   - `VITE_API_URL` = `https://rozgarsetu-api.onrender.com/api`
5. Click **"Deploy"**

Your app will be live at `https://your-project.vercel.app` 🎉

---

## 🔧 Environment Variables Summary

### Backend (`backend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `my_super_secret_2024` |
| `PORT` | Server port | `5000` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `/api` (dev) or `https://api.example.com/api` (prod) |

---

## 🤖 AI Features (No Paid APIs)

### Smart Job Recommendations
Jobs are ranked using a weighted algorithm:
- **Skill Match (50%)** — Jaccard similarity between worker and job skills
- **Distance (30%)** — closer jobs score higher (Haversine formula)
- **Salary (20%)** — higher salary jobs rank better

### Fraud Detection
Jobs are automatically flagged if:
- Salary < ₹100/day or > ₹50,000/day
- Description is missing or < 20 characters
- Phone number is missing
- Title contains suspicious keywords (lottery, MLM, etc.)

---

## 📱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| State | Context API |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcrypt |
| Voice | Web Speech API |
| Location | Browser Geolocation API |

---

## 📜 License

MIT — Free to use, modify, and distribute.
