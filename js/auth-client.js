// auth-client.js – Centralized authentication helper
// Uses admin_token and admin_user keys

const AUTH = {
  TOKEN_KEY: 'admin_token',
  USER_KEY: 'admin_user',

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Failed to parse user data', e);
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  setSession(token, userData) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('force-navbar-update'));
  },

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('force-navbar-update'));
  },

  async authFetch(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`https://nicyfoods.srujaninfotech.com${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });
    if (response.status === 401) {
      this.logout();
      if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
      }
    }
    return response;
  },
};

window.AUTH = AUTH;