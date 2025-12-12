import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footter";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Courses from "./pages/Courses";
import CourseContinued from "./pages/CourseContinued";
import CourseContinued2 from "./pages/CourseContinued2";
import Todolist from "./pages/Todolist";
import Aichatbot from "./pages/Aichatbot";
import About from "./pages/About";
import MentorDashboard from "./pages/MentorDashboard";
import Profile from "./pages/Profile";
import OnboardingForm from "./components/OnboardingForm";
import DistractionMonitor from "./pages/DistractionMonitor";

import "./App.css";

function App() {
  const location = useLocation();

  const noChromePages = ["/", "/auth", "/onboarding"];

  // Navbar & Footer hide logic
  const hideChrome = noChromePages.includes(location.pathname);

  return (
    <div
      className="app-container"
      style={{
        paddingTop: hideChrome ? "0" : "80px",
      }}
    >
      {!hideChrome && <Navbar />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<OnboardingForm />} />

          {/* Core Pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/courses-continued/:courseId"
            element={<CourseContinued />}
          />
          <Route
            path="/courses-continued2/:courseId"
            element={<CourseContinued2 />}
          />

          {/* Additional Tools */}
          <Route path="/focus" element={<DistractionMonitor />} />
          <Route path="/todolist" element={<Todolist />} />
          <Route path="/aichatbot" element={<Aichatbot />} />

          {/* Info */}
          <Route path="/about" element={<About />} />
          <Route path="/mentor-dashboard" element={<MentorDashboard />} />

          {/* User */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Hide Footer for landing/auth/onboarding */}
      {!hideChrome && <Footer />}
    </div>
  );
}

export default App;
