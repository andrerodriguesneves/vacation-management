import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

export const getVacationPeriods = async () => {
  try {
    const response = await api.get('/vacation-periods');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar períodos de férias:', error);
    throw error;
  }
};

export const createVacationPeriod = async (startDate, endDate) => {
  try {
    const response = await api.post('/vacation-periods', { start_date: startDate, end_date: endDate });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar período de férias:', error);
    throw error;
  }
};

export default api; 