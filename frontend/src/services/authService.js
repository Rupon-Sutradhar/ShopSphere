import api from './api';
import { demoAuthService, isDemoMode } from './demoStore';

export const authService = {
  async register(userData) {
    if (isDemoMode) return demoAuthService.register(userData);
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  async login(credentials) {
    if (isDemoMode) return demoAuthService.login(credentials);
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  async logout() {
    if (isDemoMode) return demoAuthService.logout();
    const res = await api.post('/auth/logout');
    return res.data;
  },

  async getMe() {
    if (isDemoMode) return demoAuthService.getMe();
    const res = await api.get('/auth/me');
    return res.data;
  },
};
