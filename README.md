# MUNYUN

MUNYUN is a full-stack personal finance app for tracking expenses, planning budgets, and organizing events in one workflow. It supports Google sign-in for private user data and a demo mode for quick exploration.

## Portfolio Snapshot

### What It Does
MUNYUN helps users manage money day-to-day by combining expense tracking, budget planning, and event reminders in one app.

### Feature Highlights
| Area | What Users Can Do |
|---|---|
| Expense Tracking | Add, edit, delete, and review expenses |
| Smart Categorization | Auto-categorize new expenses and manually re-categorize with drag-and-drop |
| Budgeting | Plan daily, weekly, and monthly budgets |
| Reports | View category-based spending in a visual pie chart |
| Planning | Add and review calendar events |
| Onboarding | Try demo mode without signing in |

### Built With
- React + Vite frontend
- Node.js + Express backend
- MongoDB + Mongoose
- Firebase Auth (Google sign-in)
- Chakra UI, Recharts, D3, React Big Calendar

### Why It Matters
- Gives users clear visibility into spending behavior
- Encourages proactive budgeting and planning
- Reduces friction with a fast demo experience

## Technical Reference

### Features
- Create, view, update, and delete expenses
- Upload receipt images (stored as base64)
- Auto-categorize new expenses with rule-based categorization
- Manually recategorize expenses with drag-and-drop
- Visual expense reporting by category (pie chart)
- Create and track daily, weekly, and monthly budgets
- Create and view calendar events
- Finance quote and news widgets
- Demo mode for testing without authentication

### Tech Stack
- Frontend: React, Vite, Chakra UI, Bootstrap
- State: Zustand
- Charts/Visualization: Recharts, D3
- Calendar/Drag-and-drop: React Big Calendar, React Beautiful DnD
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Authentication: Firebase Auth + Firebase Admin

### Repository Structure
```text
.
├── backend/      # Express API, Mongoose models, controllers, routes
├── frontend/     # React app (Vite)
├── PROJECT_NOTES.md
└── netlify.toml  # Frontend deployment config
```

### Environment Variables

#### Backend (`.env` at repo root)
- `MONGO_URI`
- `PORT` (default: `8000`)
- `FRONTEND_ORIGINS` (optional, comma-separated)
- `FIREBASE_SERVICE_ACCOUNT` (JSON string for Firebase Admin)

#### Frontend (`frontend/.env`)
- `VITE_API_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### Getting Started
1. Install root dependencies:
```bash
npm install
```
2. Install frontend dependencies:
```bash
cd frontend && npm install
```
3. Start backend (from repo root):
```bash
npm run dev
```
4. Start frontend (from `frontend/` in a second terminal):
```bash
npm run dev
```
5. Open the app at the Vite local URL (typically `http://localhost:5173`).

### Available Scripts

#### Root
- `npm run dev` - start backend with nodemon
- `npm run start` - start backend with node
- `npm run seed:demo` - seed demo data
- `npm run migrate:demo` - migrate legacy records to demo user

#### Frontend (`frontend/`)
- `npm run dev` - start Vite dev server
- `npm run build` - build production assets
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

### API Overview
- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `PUT /api/expenses/update-category/:id`
- `GET /api/expenses/report`
- `GET /api/events`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `GET /api/budgets`
- `POST /api/budgets`
- `PUT /api/budgets/:id`
- `DELETE /api/budgets/:id`
- `GET /api/quote`

### Real-World Value
- Makes spending patterns visible by category and time
- Supports better financial decisions through budget planning
- Combines money tracking and event reminders in a single app
- Low-friction onboarding through demo mode

### Current Improvement Opportunities
- Complete/clean up category-learning implementation for smarter correction-based categorization
- Move all external API keys fully to environment variables
- Remove or refactor older/unused component files
- Standardize local config paths and frontend proxy behavior
