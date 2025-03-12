import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const loginUser = async (email: any, password: any) => {
  const response = await api.post('/token', new URLSearchParams({ username: email, password }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const registerUser = async (username: any, email: any, password: any) => {
  await api.post('/register', { username, email, password });
  return loginUser(email, password);
};

export const fetchUserData = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const fetchHaikuById = async (haikuId: number) => {
    const response = await api.get(`/haikus/${haikuId}`);
    return response.data;
};

export const createHaiku = async (haikuData: { text: string; color: string; tags: string[]; is_draft: boolean; }) => {
  const response = await api.post('/haikus/', haikuData);
  return response.data;
};

export const fetchAllHaikus = async (skip = 0, limit = 10) => {
    const response = await api.get('/haikus/', { params: { skip, limit } });
    return response.data;
  };

export const fetchMyHaikus = async () => {
  const response = await api.get('/haikus/mine/');
  return response.data;
};

export const fetchDraftHaikus = async () => {
  const response = await api.get('/haikus/drafts/');
  return response.data;
};

export const fetchLikedHaikus = async () => {
  const response = await api.get('/haikus/liked/');
  return response.data;
};

export const toggleLikeHaiku = async (haikuId: number) => {
  const response = await api.post(`/haikus/${haikuId}/like/`);
  return response.data;
};

export const isHaikuLiked = async (haikuId: number) => {
  const response = await api.get(`/haikus/${haikuId}/is-liked`);
  return response.data.is_liked;
};

export const fetchUserProfile = async (userId: any) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const fetchUserHaikus = async (userId: any) => {
  const response = await api.get(`/users/${userId}/haikus/`);
  return response.data;
};

export default api;