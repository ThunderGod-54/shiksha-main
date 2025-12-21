import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";

// LOGIC: Ensure the URL never ends with a trailing slash to avoid double slashes like //auth/login
const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = RAW_URL.endsWith('/') ? RAW_URL.slice(0, -1) : RAW_URL;

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    // LOGIC: Ensure endpoint always starts with a slash for consistent URL building
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${formattedEndpoint}`;

    const headers = { ...this.getAuthHeaders() };
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    const config = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body !== 'string') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async login(email, password, userType) {
    const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
    const idToken = await userCredential.user.getIdToken();
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { id_token: idToken, user_type: userType },
    });
    this.setToken(idToken);
    return data;
  }

  async googleAuth(userType) {
    const result = await signInWithPopup(getAuth(), new GoogleAuthProvider());
    const idToken = await result.user.getIdToken();
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { id_token: idToken, user_type: userType },
    });
    this.setToken(idToken);
    return data;
  }

  async getUserProfile() {
    return await this.request('/auth/profile');
  }

  async updateUserProfile(profileData) {
    return await this.request('/auth/profile/update', {
      method: 'POST',
      body: profileData,
    });
  }

  logout() {
    localStorage.removeItem('token');
    const auth = getAuth();
    auth.signOut();
  }

  async generateCertificate(courseName) {
    return await this.request('/certificate/generate', {
      method: 'POST',
      body: { course_name: courseName },
    });
  }

  // === AI ENDPOINTS (Note: Ensure these routes exist in your backend if used) ===

  async aiChat(message, sessionId = null, context = null) {
    return await this.request('/ai/chat', {
      method: 'POST',
      body: {
        message,
        session_id: sessionId,
        context: context
      },
    });
  }

  async generateNotes(topic) {
    return await this.request('/ai/generate-notes', {
      method: 'POST',
      body: { topic },
    });
  }

  async generateRoadmap(goal) {
    return await this.request('/ai/generate-roadmap', {
      method: 'POST',
      body: { goal },
    });
  }
}

export default new ApiService();