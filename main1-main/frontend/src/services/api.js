import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
      ...options,
    };
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  async login(email, password, userType) {
    const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
    const idToken = await userCredential.user.getIdToken();
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken, user_type: userType }),
    });
    this.setToken(idToken);
    return data;
  }

  async googleAuth(userType) {
    const result = await signInWithPopup(getAuth(), new GoogleAuthProvider());
    const idToken = await result.user.getIdToken();
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken, user_type: userType }),
    });
    this.setToken(idToken);
    return data;
  }

  async getUserProfile() {
    return await this.request('/auth/profile');
  }
  // Add this method inside your ApiService class in api.js
  async updateUserProfile(profileData) {
    return await this.request('/auth/profile/update', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }
  logout() {
    localStorage.removeItem('token'); // Clears local state
    const auth = getAuth();
    auth.signOut(); // Tells Firebase the session is over
  }
  async generateCertificate(courseName) {
    return await this.request('/certificate/generate', {
      method: 'POST',
      body: JSON.stringify({ course_name: courseName }),
    });
  }
}

export default new ApiService();