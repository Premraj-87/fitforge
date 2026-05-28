# FitForge

FitForge is a full-stack fitness planning platform that turns a user's biometrics, goals, activity level, and available equipment into personalized workout and nutrition protocols. It includes JWT authentication, MongoDB-backed progress tracking, dynamic plan generation, an exercise database, a gamified leaderboard, and a Gemini-powered fitness coach.

The project is built as a resume-ready MERN-style application with a production-oriented split between a React/Vite frontend and an Express/MongoDB backend.

## Live Services

- Backend API: `https://fitforge-fo5r.onrender.com/api`
- Frontend: deployable on Vercel from the `frontend` directory

## Key Highlights

- Personalized fitness plan generation using BMR, TDEE, goal-based calorie adjustment, and macro calculations.
- Equipment-aware workout programming for bodyweight, basic home, and full gym users.
- Secure authentication with JWT, bcrypt password hashing, and protected API routes.
- Progress analytics with weight logs, workout completion history, streak tracking, and charts.
- Gamification layer with workout points, tier progression, and leaderboard ranking.
- AI coach powered by Google Gemini with user context from profile, progress, diet, and workout data.
- Public exercise and nutrition databases with search, filtering, and cached frontend reads.
- 108-exercise movement dataset scraped with Axios and Cheerio from Muscle & Strength.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite 7, React Router, Tailwind CSS 4, Recharts, Lucide React, Axios |
| Backend | Node.js, Express 5, MongoDB, Mongoose, JWT, bcryptjs, Joi |
| AI | Google Gemini API via `@google/generative-ai` |
| Data | MongoDB collections, local exercise JSON dataset, static Indian nutrition dataset |
| Tooling | ESLint, Nodemon, Vercel config, Render-compatible backend |

## Features

### Authentication and User Profile

- User registration and login.
- Password hashing with bcrypt.
- JWT-based session handling.
- Protected dashboard routes.
- Fitness profile fields including age, weight, height, gender, goal, activity level, equipment, and experience level.

### Dynamic Plan Generation

FitForge generates both diet and workout plans from the user's profile.

Diet logic:

- Calculates BMR with the Mifflin-St Jeor equation.
- Calculates TDEE from activity multiplier.
- Adjusts calories based on Fat Loss, Muscle Gain, or Maintenance.
- Calculates macro targets for calories, protein, carbs, and fats.

Workout logic:

- Full gym users receive a 6-day Push/Pull/Legs split.
- Bodyweight users receive a home workout program.
- Basic home users receive equipment-filtered routines.
- Exercises are selected from the local movement database by target muscle and equipment.

### Dashboard and Analytics

- Current workout and nutrition protocol summary.
- Weight progression chart.
- Active streak counter.
- Consistency/adherence visualizations.
- Local caching for faster repeat dashboard loads.

### Workout Tracking

- Day-by-day workout tabs.
- Exercise sets, reps, rest, duration, and difficulty.
- Workout completion logging.
- Automatic points awarded after completing a workout.
- Duplicate completion prevention for already completed modules.

### Nutrition Tools

- Generated daily calorie and macro targets.
- Meal schedule with calories and macro breakdown.
- Indian food database with calories, protein, carbs, and fats.
- Custom plate builder to calculate selected food totals against the user's target.

### AI Fitness Coach

- Protected `/api/chat` endpoint.
- Gemini-powered responses.
- Context-aware prompt includes user profile, current progress, active diet plan, and active workout plan.
- Supports natural language coaching and simple commands such as logging weight.

### Public Databases

- Exercise database with search and muscle-group filtering.
- Nutrition database with search and category filtering.
- Public routes available without authentication.

## Architecture

```txt
fitforge/
|-- backend/
|   |-- src/
|   |   |-- config/          # MongoDB connection
|   |   |-- controllers/     # Request handlers
|   |   |-- data/            # Exercise dataset
|   |   |-- middleware/      # JWT auth middleware
|   |   |-- models/          # Mongoose schemas
|   |   |-- routes/          # API route definitions
|   |   |-- services/        # Plan generation logic
|   |   |-- utils/           # Calculations and scraping utilities
|   |   `-- server.js        # Express entry point
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   |-- components/      # Sidebar, topbar, protected route
|   |   |-- context/         # Auth context
|   |   |-- layouts/         # Dashboard layout
|   |   |-- pages/           # Landing, dashboard, plans, progress, chat
|   |   |-- services/        # Axios API client
|   |   `-- main.jsx
|   `-- package.json
`-- README.md
```

## API Overview

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT |
| `GET` | `/api/auth/profile` | Private | Get current user profile |
| `POST` | `/api/plans/generate` | Private | Generate diet and workout plans |
| `GET` | `/api/plans` | Private | Fetch active plans |
| `GET` | `/api/progress` | Private | Fetch progress record |
| `POST` | `/api/progress/weight` | Private | Add a weight log |
| `POST` | `/api/progress/workout` | Private | Complete a workout module |
| `GET` | `/api/leaderboard` | Private | Fetch ranked users |
| `POST` | `/api/chat` | Private | Send message to AI fitness coach |
| `GET` | `/api/data/exercises` | Public | Fetch exercise database |
| `GET` | `/api/data/nutrition` | Public | Fetch nutrition database |

## Database Models

- `User`: profile, credentials, goal, activity level, equipment, experience.
- `WorkoutPlan`: active program type, daily workouts, exercises, completion state.
- `DietPlan`: daily macro targets, meals, budget range, active state.
- `Progress`: weight history, workout history, calorie history, streak, consistency score.
- `Leaderboard`: points, rank, tier, achievements.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas or local MongoDB
- Gemini API key for the AI coach

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend:

```bash
npm run dev
```

The API should be available at:

```txt
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend should be available at:

```txt
http://localhost:5173
```

### Local API URL

The frontend API client currently points to the hosted Render backend:

```js
baseURL: 'https://fitforge-fo5r.onrender.com/api'
```

For local development, update `frontend/src/services/api.js`:

```js
baseURL: 'http://localhost:5000/api'
```

## Available Scripts

Backend:

```bash
npm run dev      # Start backend with nodemon
npm start        # Start backend with node
```

Frontend:

```bash
npm run dev      # Start Vite dev server
npm run build    # Build frontend for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Resume Talking Points

- Built a full-stack fitness platform with React, Express, MongoDB, and JWT authentication.
- Implemented personalized diet and workout generation using BMR, TDEE, macro calculations, and equipment-based exercise filtering.
- Integrated Gemini AI to provide context-aware coaching using live user telemetry.
- Designed progress analytics with Recharts, workout streaks, gamified points, and leaderboard tiers.
- Created a scraping utility with Axios and Cheerio to build a 108-exercise movement database.
- Structured the backend with controllers, services, models, middleware, and route modules for maintainability.

## Future Improvements

- Add automated tests for auth, plan generation, progress tracking, and chat flows.
- Move frontend API base URL to environment variables.
- Add refresh tokens or cookie-based authentication.
- Persist custom nutrition logs instead of keeping the custom plate builder client-side only.
- Add plan history views for comparing old and current protocols.
- Add admin tools for managing exercises and nutrition items.

## Author

Built by Prem Raj Anand as a full-stack fitness and AI coaching project.
