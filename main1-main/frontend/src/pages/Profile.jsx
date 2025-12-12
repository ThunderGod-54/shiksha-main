import { useState, useEffect } from "react";
import apiService from "../services/api";

const profileStyles = `
.profile-page {
  min-height: 100vh;
  padding: 7rem 1.25rem 2rem;
  background: var(--dash-bg);
  font-family: var(--font-primary);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.profile-card {
  width: 100%;
  max-width: 650px;
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 2.25rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  backdrop-filter: blur(14px);
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* Photo wrapper */
.profile-photo-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.profile-photo-img {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--blue-primary);
  box-shadow: var(--shadow-md);
}

.profile-form-label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-size: 0.95rem;
}

.profile-input,
.profile-select,
.profile-file-input {
  width: 100%;
  padding: 12px;
  background: var(--input-bg);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--text-primary);
  outline: none;
  transition: border 0.2s;
}

.profile-input:focus,
.profile-select:focus,
.profile-file-input:focus {
  border-color: var(--blue-primary);
}

/* Interest chips */
.profile-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.profile-chip-label {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--sidebar-bg-end);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.85rem;
}

.alert-box {
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 0.92rem;
  margin-bottom: 1rem;
  text-align: center;
}

.alert-error {
  background: rgba(255, 76, 76, 0.18);
  color: #ff4c4c;
  border: 1px solid rgba(255,76,76,0.35);
}

.alert-success {
  background: rgba(60, 190, 120, 0.18);
  color: #31b97c;
  border: 1px solid rgba(60,190,120,0.35);
}

/* Submit button */
.submit-btn {
  width: 100%;
  padding: 13px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  color: var(--btn-text);
  background: var(--blue-primary);
  cursor: pointer;
  transition: 0.2s;
}

.submit-btn:hover {
  opacity: 0.85;
}

.submit-btn:disabled {
  background: var(--border-light);
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 600px) {
  .profile-card {
    padding: 1.6rem;
  }
}
`;

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    institution_name: "",
    institution_type: "",
    branch: "",
    interests: [],
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await apiService.getUserProfile();
        setUserData(data);
        if (data.profile_photo_url) setPhotoPreview(data.profile_photo_url);
      } catch {
        setError("Failed to load profile data");
      }
    };
    loadUser();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData((p) => ({ ...p, [name]: value }));
  };

  const handleInterest = (i) => {
    setUserData((p) => ({
      ...p,
      interests: p.interests.includes(i)
        ? p.interests.filter((x) => x !== i)
        : [...p.interests, i],
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePhoto(file);

    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(userData).forEach(([k, v]) => {
        fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v);
      });
      if (profilePhoto) fd.append("profile_photo", profilePhoto);

      await apiService.updateUserProfile(fd);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{profileStyles}</style>

      <div className="profile-page">
        <div className="profile-card">
          
          {/* Header */}
          <div className="profile-header">
            <h2>Edit Profile</h2>
          </div>

          {/* Alerts */}
          {error && <div className="alert-box alert-error">{error}</div>}
          {success && <div className="alert-box alert-success">{success}</div>}

          <form onSubmit={submitProfile}>
            {/* Profile Photo */}
            <div className="profile-photo-wrap">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="profile-photo-img"
                />
              )}
            </div>

            <label className="profile-form-label">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              className="profile-file-input"
              onChange={handlePhoto}
            />

            {/* Name */}
            <div style={{ marginTop: "1rem" }}>
              <label className="profile-form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="profile-input"
                value={userData.name}
                onChange={handleInput}
              />
            </div>

            {/* Phone */}
            <div style={{ marginTop: "1rem" }}>
              <label className="profile-form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="profile-input"
                value={userData.phone}
                onChange={handleInput}
              />
            </div>

            {/* Institution Name */}
            <div style={{ marginTop: "1rem" }}>
              <label className="profile-form-label">
                {userData.institution_type === "college"
                  ? "College Name"
                  : "School Name"}
              </label>
              <input
                type="text"
                name="institution_name"
                className="profile-input"
                value={userData.institution_name}
                onChange={handleInput}
              />
            </div>

            {/* Branch */}
            {userData.institution_type === "college" && (
              <div style={{ marginTop: "1rem" }}>
                <label className="profile-form-label">Branch</label>
                <select
                  name="branch"
                  className="profile-select"
                  value={userData.branch}
                  onChange={handleInput}
                >
                  <option value="">Select Branch</option>
                  <option value="cse">CSE</option>
                  <option value="ece">ECE</option>
                  <option value="mech">MECH</option>
                  <option value="civil">CIVIL</option>
                  <option value="aiml">AIML</option>
                </select>
              </div>
            )}

            {/* Interests */}
            {userData.institution_type === "school" && (
              <div style={{ marginTop: "1rem" }}>
                <label className="profile-form-label">Interests</label>
                <div className="profile-checkbox-group">
                  {[
                    "Science",
                    "Math",
                    "English",
                    "History",
                    "Art",
                    "Sports",
                    "Music",
                    "Technology",
                  ].map((i) => (
                    <label key={i} className="profile-chip-label">
                      <input
                        type="checkbox"
                        checked={userData.interests.includes(i)}
                        onChange={() => handleInterest(i)}
                      />
                      {i}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              className="submit-btn"
              type="submit"
              disabled={loading}
              style={{ marginTop: "1.6rem" }}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
