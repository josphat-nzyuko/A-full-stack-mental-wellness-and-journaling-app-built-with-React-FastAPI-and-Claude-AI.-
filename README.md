# 🌿 MindfulSpace

> A full-stack mental wellness and journaling web application built with React, FastAPI, and Claude AI.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)
![SQLite](https://img.shields.io/badge/SQLite-aiosqlite-003B57?style=flat-square&logo=sqlite)
![Claude AI](https://img.shields.io/badge/Claude-AI_Powered-6C63FF?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📖 About

MindfulSpace is a personal mental wellness journal that helps you reflect on your thoughts, track your daily mood, and receive personalised AI-generated insights — all in a private, secure environment.

### ✨ Key Features

- **📝 Private Journaling** — Write, edit, and manage daily journal entries with mood tagging
- **🤖 AI Insights** — Every journal entry automatically receives a compassionate AI-generated reflection powered by Claude
- **📊 Mood Tracking** — Log your daily mood on a scale of 1–10 with optional notes
- **📈 Trend Charts** — Visualise your mood patterns over the last 30 days
- **✨ Wellness Summary** — A big-picture AI analysis of your emotional patterns and journaling habits
- **🔒 Secure & Private** — JWT authentication, bcrypt password hashing, no data sharing

---

## 🖥️ Screenshots

| Auth Page | Dashboard | Journal | Insights |
|-----------|-----------|---------|----------|
| Login & Register | Stats, mood logger, charts | Write & manage entries | AI summary & analytics |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| JavaScript (ES6+) | No TypeScript — kept simple |
| Plain CSS | Custom styling with CSS variables |
| React Router DOM v6 | Client-side routing |
| Zustand | Global auth state management |
| Axios | HTTP client with JWT interceptors |
| React Hook Form | Form handling and validation |
| Recharts | Mood trend visualisations |
| date-fns | Date formatting utilities |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | High-performance Python web framework |
| SQLAlchemy (async) | ORM for database interactions |
| SQLite + aiosqlite | Lightweight async database |
| Pydantic v2 | Data validation and schemas |
| python-jose | JWT token creation and verification |
| passlib + bcrypt | Secure password hashing |
| Anthropic SDK | Claude AI API integration |

---

## 📁 Project Structure

```
mindfulspace/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── api/
│   │   │   ├── deps.py          # JWT auth dependency
│   │   │   └── routes/
│   │   │       ├── auth.py      # /auth endpoints
│   │   │       ├── journal.py   # /journal endpoints
│   │   │       ├── mood.py      # /mood endpoints
│   │   │       └── insights.py  # /insights endpoint
│   │   ├── core/
│   │   │   ├── config.py        # Settings from .env
│   │   │   ├── database.py      # DB connection
│   │   │   └── security.py      # JWT + password hashing
│   │   ├── models/              # SQLAlchemy table definitions
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   └── services/            # Business logic + AI integration
│   ├── .env                     # Environment variables (never commit)
│   ├── requirements.txt
│   └── wellness.db              # SQLite database (auto-created)
│
└── frontend/
    └── src/
        ├── api/                 # Axios API call wrappers
        ├── components/layout/   # Navbar, Sidebar, Layout
        ├── pages/               # Auth, Dashboard, Journal, Insights
        ├── store/               # Zustand auth store
        ├── styles/              # CSS per page + global styles
        ├── App.jsx              # Route definitions
        └── main.jsx             # React entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm 8+

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mindfulspace.git
cd mindfulspace
```

### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env and fill in your values
```

**`.env` file:**
```env
SECRET_KEY=your_super_secret_key_change_this_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DATABASE_URL=sqlite+aiosqlite:///./wellness.db
```

```bash
# Start the backend server
uvicorn app.main:app --reload
```

Backend runs at → **http://127.0.0.1:8000**
Interactive API docs → **http://127.0.0.1:8000/docs**

### 3. Frontend setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend runs at → **http://localhost:5173**

> ⚠️ Both servers must be running simultaneously for the app to work.

---

## 🤖 AI Integration

MindfulSpace uses **Anthropic's Claude API** for two AI features:

| Feature | Trigger | Output |
|---|---|---|
| Entry Insight | Every time a journal entry is saved | 3–4 sentence compassionate reflection |
| Wellness Summary | Insights page load | Big-picture wellness overview with actionable tip |

### Graceful Degradation

If your Anthropic API key is not configured or has no credits, the app continues to work normally. AI features will display a placeholder message instead of crashing.

Get your API key at [console.anthropic.com](https://console.anthropic.com)

---

## 🗄️ Database Schema

```
users
  id, username, email, hashed_password, is_active, created_at

journal_entries
  id, user_id (FK), title, content, mood_score, ai_insight, created_at, updated_at

mood_logs
  id, user_id (FK), mood_score, mood_label, note, logged_at
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login and get JWT token |
| POST | `/journal/` | ✅ | Create a journal entry |
| GET | `/journal/` | ✅ | Get all journal entries |
| GET | `/journal/{id}` | ✅ | Get a single entry |
| PUT | `/journal/{id}` | ✅ | Update an entry |
| DELETE | `/journal/{id}` | ✅ | Delete an entry |
| POST | `/mood/` | ✅ | Log a mood check-in |
| GET | `/mood/history` | ✅ | Get mood history (last N days) |
| GET | `/insights/summary` | ✅ | Get AI wellness summary |

---

## 🔐 Security

- Passwords are hashed with **bcrypt** — never stored as plain text
- Authentication uses **JWT tokens** that expire after 30 minutes
- All data endpoints are scoped to the **authenticated user only**
- The `.env` file is excluded from version control via `.gitignore`

---

## 🐛 Troubleshooting

| Error | Fix |
|---|---|
| `externally-managed-environment` | Use a virtual environment: `python3 -m venv venv && source venv/bin/activate` |
| `Import could not be resolved` in VS Code | `Ctrl+Shift+P` → `Python: Select Interpreter` → select the venv path |
| `500` on `/auth/register` | Pin bcrypt version: `pip uninstall bcrypt -y && pip install bcrypt==4.0.1` |
| Blank white page on React | Install correct React version: `npm install react@18.3.1 react-dom@18.3.1` |
| `Missing script: dev` | Navigate into the frontend folder first: `cd frontend` |
| `Could not import module main` | Run from backend folder: `uvicorn app.main:app --reload` |
| AI shows placeholder text | Add your Anthropic API key to `.env` and purchase credits |

---

## 🗺️ Roadmap

- [ ] JWT refresh tokens for seamless sessions
- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] Journal entry search and filtering
- [ ] Export entries as PDF
- [ ] Journaling streak tracker
- [ ] Weekly mood digest email
- [ ] PostgreSQL support for production
- [ ] React Native mobile app

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Anthropic](https://www.anthropic.com) — Claude AI API
- [FastAPI](https://fastapi.tiangolo.com) — Python web framework
- [React](https://react.dev) — UI framework
- [Recharts](https://recharts.org) — Chart library

---

<p align="center">Built with 💜 using React, FastAPI, and Claude AI</p>
