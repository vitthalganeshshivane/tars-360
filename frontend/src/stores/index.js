import { create } from 'zustand';
import API from '../api/axios';

const clearStoredTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return !payload.exp || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken || isTokenExpired(refreshToken)) {
    clearStoredTokens();
    return null;
  }

  try {
    const { data: res } = await API.post('/auth/refresh', { refreshToken });
    const newAccessToken = res.data?.accessToken;
    const newRefreshToken = res.data?.refreshToken;
    if (!newAccessToken) return null;
    localStorage.setItem('accessToken', newAccessToken);
    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
    return newAccessToken;
  } catch (err) {
    console.warn('Token refresh failed', err);
    clearStoredTokens();
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  login: async (email, password) => {
    const { data: res } = await API.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, isAuthenticated: true, loading: false });
    return res.data;
  },

  register: async (name, email, password) => {
    const { data: res } = await API.post('/auth/register', { name, email, password });
    const { user, accessToken, refreshToken } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, isAuthenticated: true, loading: false });
    return res.data;
  },

  loadUser: async () => {
    // If already authenticated (e.g. just logged in), skip
    if (get().isAuthenticated) { set({ loading: false }); return; }
    let token = localStorage.getItem('accessToken');
    if (!token) { set({ loading: false }); return; }
    if (isTokenExpired(token)) {
      token = await refreshAccessToken();
      if (!token) {
        set({ user: null, isAuthenticated: false, loading: false });
        return;
      }
    }
    try {
      const { data: res } = await API.get('/auth/me');
      set({ user: res.data, isAuthenticated: true, loading: false });
    } catch {
      clearStoredTokens();
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  logout: async () => {
    try { await API.post('/auth/logout'); } catch (err) { console.warn('Logout request failed', err); }
    clearStoredTokens();
    set({ user: null, isAuthenticated: false, loading: false });
  },

  updateProfile: async (userData) => {
    const { data: res } = await API.put('/auth/profile', userData);
    set({ user: res.data });
    return res.data;
  }
}));

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  searchOpen: false,
  theme: localStorage.getItem('theme') || 'light',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  }
}));
