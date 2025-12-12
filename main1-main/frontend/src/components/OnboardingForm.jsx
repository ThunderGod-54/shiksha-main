import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "./onboarding.css";

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    institution_type: "college",
    institution_name: "",
    branch: "",
    interests: []
  });

  useEffect(() => {
    const timer = setTimeout(() => setStep(2), 1500);
    return () => clearTimeout(timer);
  }, []);

  const changeField = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const toggleInterest = (interest) => {
    setFormData((p) => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter((i) => i !== interest)
        : [...p.interests, interest]
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiService.onboardUser(formData);
      navigate(
        data.user.user_type === "mentor" ? "/mentor-dashboard" : "/dashboard"
      );
    } catch (err) {
      setError(err?.message || "Something went wrong");
    }
    setLoading(false);
  };

  /* =============================
     REDIRECT LOADING SCREEN
     ============================= */
  if (step === 1)
    return (
      <div className="loader-screen">
        <div className="loader-box">
          <h3 style={{ marginBottom: "14px", color: "var(--text-primary)" }}>
            Redirecting please wait...
          </h3>
          <div className="spinner"></div>
        </div>
      </div>
    );

  /* =============================
     MAIN FORM
     ============================= */
  return (
    <div className="onboard-screen">
      <div className="onboard-card">
        <h2>Before continuing let’s know you better</h2>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submitForm}>
          {/* Name */}
          <div className="input-box">
            <input
              name="name"
              required
              value={formData.name}
              onChange={changeField}
              placeholder=" "
            />
            <label>Name</label>
          </div>

          {/* Phone */}
          <div className="input-box">
            <input
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={changeField}
              placeholder=" "
            />
            <label>Phone Number</label>
          </div>

          {/* Institution Type */}
          <div className="segment-row">
            {["college", "school"].map((t) => (
              <div
                key={t}
                className={`segment-btn ${
                  formData.institution_type === t ? "active" : ""
                }`}
                onClick={() =>
                  setFormData((p) => ({ ...p, institution_type: t }))
                }
              >
                {t.toUpperCase()}
              </div>
            ))}
          </div>

          {/* School/College Name */}
          <div className="input-box">
            <input
              name="institution_name"
              required
              value={formData.institution_name}
              onChange={changeField}
              placeholder=" "
            />
            <label>
              {formData.institution_type === "college"
                ? "College Name"
                : "School Name"}
            </label>
          </div>

          {/* Branch */}
          {formData.institution_type === "college" && (
            <div className="input-box">
              <select
                name="branch"
                required
                value={formData.branch}
                onChange={changeField}
              >
                <option value="">Select Branch</option>
                <option value="cse">CSE</option>
                <option value="ece">ECE</option>
                <option value="mech">MECH</option>
                <option value="civil">CIVIL</option>
                <option value="aiml">AIML</option>
              </select>
              <label>Branch</label>
            </div>
          )}

          {/* Interests */}
          {formData.institution_type === "school" && (
            <>
              <p style={{ marginBottom: "8px", color: "var(--text-primary)" }}>
                Interests
              </p>
              <div className="chip-list">
                {[
                  "Science",
                  "Math",
                  "English",
                  "History",
                  "Art",
                  "Sports",
                  "Music",
                  "Technology"
                ].map((int) => (
                  <div
                    key={int}
                    className={`chip ${
                      formData.interests.includes(int) ? "selected" : ""
                    }`}
                    onClick={() => toggleInterest(int)}
                  >
                    {int}
                  </div>
                ))}
              </div>
              <br />
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            className={`submit-btn ${loading ? "disabled" : ""}`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
