import axios from 'axios';
import { API_URL } from '../utils/constants';
const api = axios.create({
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalReq = error.config;
    if (error.response.status === 401 && originalReq && !originalReq.isRetry) {
      originalReq.isRetry = true;
      try {
        const response = await axios.get(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem('token', response.data.accessToken);
        return api.request(originalReq);
      } catch (err) {
        console.log(err);
      }
    }
    throw error;
  }
);

export default api;
