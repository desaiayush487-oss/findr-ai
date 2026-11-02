import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach JWT Token to requests if logged in
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const register = (formData) => API.post('/auth/register', formData);
export const login = (formData) => API.post('/auth/login', formData);
export const getMyItems = () => API.get('/items/my-items');
export const updateItemStatus = (id) => API.patch(`/items/${id}/status`);
export const getSmartMatches = (itemId) => API.get(`/matches/${itemId}`);

// Item Endpoints
export const getItems = (search = '', type = 'ALL') =>
  API.get(`/items?search=${search}&type=${type}`);
export const createItem = (itemData) => API.post('/items', itemData);

export default API;