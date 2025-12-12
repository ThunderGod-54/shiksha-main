const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(email, password, userType = 'student') {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, user_type: userType }),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async login(email, password, userType = 'student') {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, user_type: userType }),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async googleAuth(userType = 'student') {
    const data = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ user_type: userType }),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async githubAuth(userType = 'student') {
    const data = await this.request('/auth/github', {
      method: 'POST',
      body: JSON.stringify({ user_type: userType }),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async verifyToken() {
    return await this.request('/auth/verify');
  }

  // Logout
  logout() {
    this.removeToken();
  }

  // Onboarding
  async onboardUser(onboardData) {
    return await this.request('/auth/onboard', {
      method: 'POST',
      body: JSON.stringify(onboardData),
    });
  }
  // Generate Certificate
async generateCertificate(courseName) {
  return await this.request('/certificate/generate', {
    method: 'POST',
    body: JSON.stringify({ course_name: courseName }),
  });
}

}

export default new ApiService();