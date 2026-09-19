# PreventiX — AI Health Monitor

<div align="center">

<img src="https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/FastAPI-0.104.1-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Neon-00E699?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-black?style=for-the-badge&logo=vercel" />

<br/><br/>

**AI-powered health risk prediction with personalized recommendations.**
Predict diabetes and hypertension risk using machine learning, track your health over time, and get actionable insights — all in a modern, responsive web app.

[🌐 Live Demo](https://preventi-x-ai-health-monitor.vercel.app) · [🐛 Report a Bug](https://github.com/nikhhiilsingghvi/PreventiX---AI-Health-Monitor/issues) · [💡 Request Feature](https://github.com/nikhhiilsingghvi/PreventiX---AI-Health-Monitor/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [ML Models](#-machine-learning-models)
- [Contributing](#-contributing)

---

## 🌟 Overview

PreventiX is a full-stack AI health monitoring platform that uses scikit-learn ML models trained on clinical datasets to assess a user's risk for **diabetes** and **hypertension**. Users fill out a comprehensive health assessment form, receive instant risk predictions with SHAP-based explanations, and can track their health metrics over time with interactive charts and PDF reports.

---

## ✨ Features

### 🏥 Health Risk Assessment
- **Diabetes Risk Prediction** — ML model with 95%+ accuracy
- **Hypertension Risk Analysis** — Cardiovascular health assessment
- **Metabolic Health Scoring** — Personalized metabolic evaluation
- **SHAP Explanations** — Understand which factors drive your risk
- **PDF Health Reports** — Downloadable, shareable reports

### 📊 Analytics & Tracking
- **Interactive Health Trends** — 2D charts powered by Recharts
- **Assessment History** — Full timeline of past assessments
- **Step & Activity Tracking** — Daily health logging
- **Gamification System** — Points, streaks, and goals to stay motivated

### 🎨 User Experience
- **Dark / Light Theme** — System-aware with manual toggle
- **Fully Responsive** — Mobile, tablet, and desktop optimized
- **Real-time Notifications** — Smart health alerts and tips
- **Smooth Animations** — Polished micro-interactions throughout

### 🔒 Security
- **JWT Authentication** — Secure, stateless sessions (7-day tokens)
- **bcrypt Password Hashing** — Industry-standard security
- **CORS Protection** — Configurable origin allowlist
- **Input Validation** — Pydantic models on every endpoint

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 7, TailwindCSS 3, Recharts, React Router 7 |
| **Backend** | FastAPI 0.104, Python 3.11, SQLAlchemy 2.0, Uvicorn |
| **Database** | PostgreSQL via [Neon](https://neon.tech) (serverless) |
| **ML** | scikit-learn 1.3, NumPy 1.26, Pandas 2.1, SHAP 0.43 |
| **Auth** | JWT (python-jose), bcrypt (passlib) |
| **PDF** | ReportLab 4.0 |
| **Hosting** | Vercel (frontend) + Render (backend) |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Browser                      │
│         React 19 + Vite + TailwindCSS               │
│         Hosted on Vercel                            │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────────┐
│              FastAPI Backend                        │
│         Python 3.11 + SQLAlchemy                   │
│         Hosted on Render                            │
│                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Auth    │  │  Predictions │  │   Tracking   │  │
│  │ /auth/*  │  │  /predict    │  │  /tracking/* │  │
│  └──────────┘  └──────────────┘  └──────────────┘  │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │      scikit-learn ML Models (.joblib)         │  │
│  │  Diabetes Model  |  Hypertension Model        │  │
│  └───────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │ SQLAlchemy + psycopg2
┌────────────────────▼────────────────────────────────┐
│         Neon PostgreSQL (Serverless)                │
│   Tables: users | predictions | tracking_data      │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **Python** 3.11+
- A **PostgreSQL** database — [neon.tech](https://neon.tech) (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/nikhhiilsingghvi/PreventiX---AI-Health-Monitor.git
cd PreventiX---AI-Health-Monitor
```

### 2. Backend setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL and SECRET_KEY

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local

# Start dev server
npm run dev
```

### 4. Open the app
| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

---

## 🔧 Environment Variables

### Backend — `backend/.env`

```env
# PostgreSQL connection string (get from neon.tech)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# JWT secret — use a long random string (min 32 chars)
SECRET_KEY=your-super-secret-key-min-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS — comma-separated list of allowed frontend origins
BACKEND_CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

### Frontend — `frontend/.env.local`

```env
# Your deployed backend URL
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## 🚢 Deployment

| Service | Platform | Free Tier |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | ✅ Forever free |
| Backend | [Render](https://render.com) | ✅ Free tier |
| Database | [Neon](https://neon.tech) | ✅ Forever free |

### Frontend — Vercel

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | `Vite` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variable | `VITE_API_BASE_URL=https://your-backend.onrender.com` |

### Backend — Render

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | `Python 3.11` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Environment Variables | `DATABASE_URL`, `SECRET_KEY`, `BACKEND_CORS_ORIGINS` |

> A `render.yaml` is included at the project root for one-click Render configuration.

---

## 📡 API Reference

Full interactive docs at `/docs` (Swagger UI) when the backend is running.

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register new user | — |
| `POST` | `/auth/login` | Login, receive JWT | — |
| `GET` | `/auth/me` | Get current user profile | ✅ |
| `PUT` | `/auth/me` | Update profile | ✅ |
| `POST` | `/predict` | Run health risk prediction | ✅ |
| `GET` | `/predictions/history` | Get past predictions | ✅ |
| `POST` | `/predict/current-pdf` | Generate PDF health report | ✅ |
| `POST` | `/tracking/log` | Log daily health data | ✅ |
| `GET` | `/tracking/history` | Get tracking history | ✅ |
| `GET` | `/assessments/recent` | Recent assessments | ✅ |
| `GET` | `/health` | API health check | — |

---

## 🧠 Machine Learning Models

Pre-trained models are stored as `.joblib` files. Retrain with:

```bash
python train_pipeline.py
```

| Model | Accuracy | Algorithm |
|---|---|---|
| Diabetes Risk | 95%+ | Optimized Gradient Boosting |
| Hypertension Risk | 92%+ | Optimized Gradient Boosting |

**Input features:** Age, BMI, Blood Pressure, Glucose Level, Cholesterol, Smoking, Physical Activity, Family History, and more.

**Explainability:** SHAP values are computed per prediction, highlighting which health factors contribute most to each risk score.

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repository on GitHub

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git commit -m "feat: add your feature"

# 4. Push and open a Pull Request
git push origin feature/your-feature-name
```

Please keep code style consistent and ensure `npm run build` passes before submitting.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <p>Built with ❤️ for better health outcomes</p>
  <p>
    <a href="https://preventi-x-ai-health-monitor.vercel.app">🌐 Live Demo</a> ·
    <a href="https://github.com/nikhhiilsingghvi/PreventiX---AI-Health-Monitor/issues">🐛 Issues</a>
  </p>
  <sub>© 2024 PreventiX. All rights reserved.</sub>
</div>
