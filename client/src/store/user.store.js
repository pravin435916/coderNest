import { create } from 'zustand';
import axios from 'axios';
import { backendApi } from '../Url';

const useUserStore = create((set, get) => ({
  // Initial State
  user: null,
  posts: [],
  loading: false,
  error: null,
  token: localStorage.getItem('token') || null,

  // Helper to set auth header
  setAuthHeader: () => {
    const token = get().token;
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  // Signup
  signup: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${backendApi}/api/users/signup`, userData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      set({ token, user: response.data.user, loading: false });
    } catch (error) {
      set({ error: error.response?.data.message || error.message, loading: false });
    }
  },

  // Login: Request OTP
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${backendApi}/api/users/login`, credentials);
      set({ loading: false });
      return { message: response.data.message }; // OTP sent
    } catch (error) {
      set({ error: error.response?.data.message || error.message, loading: false });
    }
  },

  // Verify OTP and Login
  verifyOtp: async (email, otp) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${backendApi}/api/users/verify-otp`, { email, otp });
      const { token } = response.data;
      localStorage.setItem('token', token);
      set({ token, loading: false });
      get().fetchUserInfo(); // Fetch user info after successful login
    } catch (error) {
      set({ error: error.response?.data.message || error.message, loading: false });
    }
  },

  // Fetch Logged-in User Info
  fetchUserInfo: async () => {
    set({ loading: true, error: null });
    try {
      get().setAuthHeader();
      const response = await axios.get(`${backendApi}/api/users/user-info`);
      set({ user: response.data.user, loading: false });
    } catch (error) {
      set({ error: error.response?.data.message || error.message, loading: false });
    }
  },
  
  //fetch all users
  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      get().setAuthHeader();
      const response = await axios.get(`${backendApi}/api/users/all-users`);
      set({ users: response.data.users, loading: false });
      console.log('users: ', users);

    } catch (error) {
      set({ error: error.response?.data.message || error.message, loading: false });
    }
  },
  // Fetch User Posts
  fetchUserPosts: async () => {
    set({ loading: true, error: null });
    try {
      get().setAuthHeader();
      const response = await axios.get(`${backendApi}/api/users/user-posts`);
      set({ posts: response.data.posts, loading: false });
    } catch (error) {
      set({ error: error.response?.data.message || error.message, loading: false });
    }
  },

  // Update Profile
  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      get().setAuthHeader();
      const response = await axios.put(`${backendApi}/api/users/update-profile`, profileData);
      set({ user: response.data.user, loading: false });
    } catch (error) {
      set({ error: error.response?.data.message || error.message, loading: false });
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, posts: [], error: null });
    delete axios.defaults.headers.common['Authorization'];
  },
}));

export default useUserStore;
