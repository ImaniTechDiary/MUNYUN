# MUNYUN Project Notes

## Project Summary
MUNYUN is a full-stack personal finance app that helps users track expenses, categorize spending, set budgets, and manage calendar events in one place. It supports both authenticated users (Google login) and a demo mode for quick exploration.

## Core Features
- Expense CRUD: create, view, edit, and delete expenses.
- Receipt image support: uploads are converted to base64 and stored with expense records.
- Auto-categorization: new expenses are assigned categories using keyword-based rules.
- Manual recategorization: drag-and-drop between categories, with backend update support.
- Expense analytics: category totals are aggregated server-side and visualized as a pie chart.
- Budget planner: create daily/weekly/monthly budgets and view upcoming monthly budget cards.
- Calendar/events: create and view events with time ranges.
- Quote widget: motivational quote pulled via backend endpoint.
- Finance news widget: latest finance headlines pulled from an external news API.
- Demo mode: lets users test the app without signing in.

## Technology Stack
- Frontend: React + Vite
- UI: Chakra UI, Bootstrap
- State/Data: Zustand
- Charts/Visualization: Recharts, D3
- Calendar/Interaction: React Big Calendar, React Beautiful DnD
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: Firebase Auth (frontend) + Firebase Admin token verification (backend)
- Deployment config: Netlify SPA redirects and CORS origin controls for local + hosted environments

## Architecture Notes
- Frontend uses token-aware fetch helpers (`authFetch`) to pass Firebase auth tokens.
- Backend middleware verifies Firebase tokens and sets `req.user` when valid.
- API data access is scoped by `userId` where available.
- Demo/legacy records are supported through fallback user handling.
- Expense reports are generated with MongoDB aggregation (`group` by category + sum price).

## Why This Is Useful In The Real World
- Helps users clearly see where their money is going by category and over time.
- Improves decision-making with visual reporting and category-level spending insight.
- Supports practical planning with budget setup and event scheduling in one workflow.
- Low-friction onboarding via demo mode makes it easy for new users to try before signing in.

## Current Limitations / Improvement Opportunities
- Category learning from manual corrections appears partially implemented and may not be fully active yet.
- Some component files look older/unused and could be cleaned up to reduce maintenance risk.
- External finance API key handling should be moved fully to environment variables.
- Local/dev config can be further standardized (proxy/env consistency between frontend and backend).
