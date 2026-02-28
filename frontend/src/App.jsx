import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutPlan from './pages/WorkoutPlan';
import DietPlan from './pages/DietPlan';
import ProgressTracker from './pages/Progress';
import Leaderboard from './pages/Leaderboard';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import PublicExercises from './pages/PublicExercises';
import PublicNutrition from './pages/PublicNutrition';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exercises" element={<PublicExercises />} />
          <Route path="/nutrition" element={<PublicNutrition />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="workout" element={<WorkoutPlan />} />
            <Route path="diet" element={<DietPlan />} />
            <Route path="progress" element={<ProgressTracker />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
