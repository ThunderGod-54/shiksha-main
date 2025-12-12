import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.js'; // Changed: Corrected path to go up two directories

// All the CSS styles are now embedded as a string within the component
const authPageStyles = `
/* --- Global Styles --- */
.auth-page {
  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1f2937;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  overflow: hidden;
}

/* --- Animated Background Elements --- */
.auth-page::before,
.auth-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
}

.auth-page::before {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  top: -100px;
  left: -100px;
}

.auth-page::after {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  bottom: -80px;
  right: -80px;
}

/* --- Auth Card - Glass Morphism --- */
.auth-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* --- Error & Redirect Messages --- */
.auth-message {
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid;
}
.auth-error {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border-color: rgba(220, 38, 38, 0.2);
}
.auth-redirect {
  background: rgba(5, 150, 105, 0.1);
  color: #059669;
  border-color: rgba(5, 150, 105, 0.2);
}

/* --- User Type Radio Pills --- */
.input-group-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #374151;
}

.user-type-container {
  display: flex;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 9999px;
  padding: 0.35rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.user-type-container input[type="radio"] {
  display: none;
}

.user-type-container label {
  flex: 1;
  text-align: center;
  padding: 0.6rem 1rem;
  border-radius: 9999px;
  cursor: pointer;
  color: #4b5563;
  font-weight: 500;
  transition: all 0.3s ease;
}

.user-type-container input[type="radio"]:checked + label {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* --- Social Auth Buttons --- */
.social-icon-container {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.social-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.social-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.4);
}

.social-icon {
  width: 28px;
  height: 28px;
}

/* --- Divider --- */
.auth-divider {
  text-align: center;
  margin: 1.5rem 0;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  font-weight: 500;
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(100, 116, 139, 0.3), transparent);
}

/* --- Form Inputs --- */
.auth-form .input-group {
  margin-bottom: 1.25rem;
}

.auth-input {
  width: 100%;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0.75rem;
  color: #1f2937;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.auth-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 
    0 0 0 3px rgba(59, 130, 246, 0.1),
    inset 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.4);
}

.auth-input::placeholder {
  color: #9ca3af;
  opacity: 1;
}

/* --- Submit & Toggle Buttons --- */
.auth-submit-btn {
  width: 100%;
  padding: 0.85rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(10px);
}
.auth-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}
.auth-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.auth-toggle-btn {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
  text-align: center;
  width: 100%;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  transition: color 0.3s ease;
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
}
.auth-toggle-btn:hover:not(:disabled) {
  color: #1e40af;
  background: rgba(59, 130, 246, 0.05);
}
.auth-toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

// SVG Icons for Social Buttons (unchanged)
const GoogleIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 1.27C5.925 1.27 1 6.2 1 12.27C1 17.02 4.14 21.045 8.5 22.385C9.05 22.485 9.25 22.135 9.25 21.835C9.25 21.565 9.24 20.785 9.24 19.985C6.27 20.615 5.52 18.665 5.52 18.665C5.07 17.515 4.37 17.165 4.37 17.165C3.47 16.535 4.44 16.545 4.44 16.545C5.44 16.615 6.02 17.595 6.02 17.595C6.91 19.115 8.4 18.665 9.05 18.385C9.14 17.765 9.4 17.345 9.69 17.095C7.07 16.795 4.34 15.765 4.34 11.235C4.34 9.985 4.79 8.955 5.54 8.135C5.44 7.835 5.14 6.865 5.64 5.335C5.64 5.335 6.54 5.035 8.99 6.635C9.84 6.405 10.74 6.285 11.64 6.285C12.54 6.285 13.44 6.405 14.29 6.635C16.74 5.035 17.64 5.335 17.64 5.335C18.14 6.865 17.84 7.835 17.74 8.135C18.49 8.955 18.94 9.985 18.94 11.235C18.94 15.775 16.2 16.795 13.58 17.095C13.94 17.415 14.29 18.015 14.29 18.905C14.29 20.145 14.28 21.135 14.28 21.485C14.28 21.795 14.48 22.095 15.04 21.985C19.46 20.655 22.5 16.675 22.5 11.885C22.5 6.095 17.7 1.27 12 1.27Z" fill="currentColor"/>
  </svg>
);

const Auth = () => {
  // --- YOUR EXISTING LOGIC (UNCHANGED) ---
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState('student'); // 'student' or 'mentor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      try {
        await apiService.register(email, password, userType);
        setIsSignUp(false); // Switch to signin mode
      } catch (error) {
        setError(error.message);
      }
    } else {
      try {
        const data = await apiService.login(email, password, userType);
        if (data.user.onboarded || data.user.user_type === 'mentor') {
          const dashboardRoute = data.user.user_type === 'mentor' ? '/mentor-dashboard' : '/dashboard';
          setRedirecting(true);
          setTimeout(() => {
            navigate(dashboardRoute);
          }, 2000);
        } else {
          navigate('/onboarding');
        }
      } catch (error) {
        setError(error.message);
      }
    }

    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      await apiService.googleAuth(userType);
      navigate('/onboarding');
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  const handleGithubAuth = async () => {
    setError('');
    setLoading(true);

    try {
      await apiService.githubAuth(userType);
      navigate('/onboarding');
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };
  // --- END OF YOUR LOGIC ---

  return (
    <>
      <style>{authPageStyles}</style>
      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-title">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>

          {error && (
            <div className="auth-message auth-error">
              {error}
            </div>
          )}

          {redirecting && (
            <div className="auth-message auth-redirect">
              Redirecting please wait...
            </div>
          )}

          {/* User Type Selection */}
          <div>
            <label className="input-group-label">I am a:</label>
            <div className="user-type-container">
              <input
                type="radio"
                id="user-student"
                name="userType"
                value="student"
                checked={userType === 'student'}
                onChange={(e) => setUserType(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="user-student">Student</label>
              
              <input
                type="radio"
                id="user-mentor"
                name="userType"
                value="mentor"
                checked={userType === 'mentor'}
                onChange={(e) => setUserType(e.target.value)}
                disabled={loading}
              />
              <label htmlFor="user-mentor">Mentor</label>
            </div>
          </div>

          {/* Social Auth Buttons */}
          <div className="social-icon-container">
            <button
              onClick={handleGoogleAuth}
              className="social-btn google"
              disabled={loading}
              aria-label={isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
            >
              <GoogleIcon />
            </button>
            <button
              onClick={handleGithubAuth}
              className="social-btn github"
              disabled={loading}
              aria-label={isSignUp ? 'Sign up with GitHub' : 'Sign in with GitHub'}
            >
              <GithubIcon />
            </button>
          </div>

          <div className="auth-divider">
            or
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label className="input-group-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="input-group">
              <label className="input-group-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {isSignUp && (
              <div className="input-group">
                <label className="input-group-label" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="auth-toggle-btn"
            disabled={loading}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Auth;