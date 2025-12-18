import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth"; // Access Firebase for real-time data
import apiService from "../services/api";

const profileStyles = `
.profile-page {
  min-height: 100vh;
  padding: 7rem 1.25rem 2rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%);
  font-family: "Inter", sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.profile-card {
  width: 100%;
  max-width: 650px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  padding: 2.25rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
}

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
  border: 3px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  font-size: 0.95rem;
}

.profile-input,
.profile-select,
.profile-file-input {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1f2937;
  outline: none;
  transition: border 0.2s;
}

.profile-input:focus,
.profile-select:focus {
  border-color: #3b82f6;
}

.alert-box {
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 0.92rem;
  margin-bottom: 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
}

.alert-error {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.alert-success {
  background: rgba(5, 150, 105, 0.1);
  color: #059669;
  border: 1px solid rgba(5, 150, 105, 0.2);
}

.submit-btn {
  width: 100%;
  padding: 13px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  color: white;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  cursor: pointer;
  transition: 0.2s;
  border: none;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.profile-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.profile-chip-label {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
}
`;

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    institution_name: "",
    institution_type: "college",
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
        // 1. Get profile data from backend
        const data = await apiService.getUserProfile();

        // 2. Access the real-time Firebase user object
        const auth = getAuth();
        const firebaseUser = auth.currentUser;

        if (firebaseUser) {
          setUserData({
            // Show backend name if saved, otherwise show Google Name
            name: data.name || firebaseUser.displayName || "",
            phone: data.phone || "",
            institution_name: data.institution_name || "",
            institution_type: data.institution_type || "college",
            branch: data.branch || "",
            interests: data.interests || [],
          });

          // Show backend photo if saved, otherwise show Google Photo
          if (data.profile_photo_url) {
            setPhotoPreview(data.profile_photo_url);
          } else if (firebaseUser.photoURL) {
            setPhotoPreview(firebaseUser.photoURL);
          }
        }
      } catch (err) {
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
      // NOTE: Using standard JSON for hackathon speed (not FormData unless uploading raw files)
      await apiService.onboardUser(userData);
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
          <div className="profile-header">
            <h2>Edit Profile</h2>
          </div>

          {error && <div className="alert-box alert-error">{error}</div>}
          {success && <div className="alert-box alert-success">{success}</div>}

          <form onSubmit={submitProfile}>
            <div className="profile-photo-wrap">
              {photoPreview && (
                <img src={photoPreview} alt="Profile" className="profile-photo-img" />
              )}
            </div>

            <label className="profile-form-label">Update Profile Photo</label>
            <input type="file" accept="image/*" className="profile-file-input" onChange={handlePhoto} />

            <div style={{ marginTop: "1rem" }}>
              <label className="profile-form-label">Full Name</label>
              <input type="text" name="name" className="profile-input" placeholder="Google Name will appear here" value={userData.name} onChange={handleInput} />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label className="profile-form-label">Phone Number</label>
              <input type="tel" name="phone" className="profile-input" value={userData.phone} onChange={handleInput} />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label className="profile-form-label">Institution Name</label>
              <input type="text" name="institution_name" className="profile-input" value={userData.institution_name} onChange={handleInput} />
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label className="profile-form-label">Institution Type</label>
              <select name="institution_type" className="profile-select" value={userData.institution_type} onChange={handleInput}>
                <option value="college">College</option>
                <option value="school">School</option>
              </select>
            </div>

            <button className="submit-btn" type="submit" disabled={loading} style={{ marginTop: "1.6rem" }}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;