import { create } from 'zustand';
import axios from 'axios';
import { backendApi } from '../Url'; // Replace with your backend API base URL

const usePostStore = create((set, get) => ({
  // Initial State
  posts: [],
  notifications: [],
  loading: false,
  error: null,

  // Fetch all posts
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${backendApi}/api/post/get`);
      set({ posts: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ error: 'Error fetching posts', loading: false });
    }
  },

  // Create a new post
  createPost: async (postData, imageFile) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('content', postData.content);
      formData.append('createdAt', postData.createdAt);
      formData.append('createdBy', postData.createdBy);
      if (imageFile) {
        formData.append('imageUrl', imageFile);
      }

      const response = await axios.post(`${backendApi}/api/post/create`, formData);
      set({ posts: [response.data, ...get().posts], loading: false });
    } catch (error) {
      console.error('Error creating post:', error);
      set({ error: 'Error creating post', loading: false });
    }
  },

  // Edit a post
  editPost: async (postId, updatedData, imageFile) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('content', updatedData.content);
      formData.append('createdAt', updatedData.createdAt);
      formData.append('createdBy', updatedData.createdBy);
      if (imageFile) {
        formData.append('imageUrl', imageFile);
      }

      const response = await axios.put(`${backendApi}/api/post/edit/${postId}`, formData);
      set({
        posts: get().posts.map((post) => (post._id === postId ? response.data : post)),
        loading: false,
      });
    } catch (error) {
      console.error('Error editing post:', error);
      set({ error: 'Error editing post', loading: false });
    }
  },

  // Delete a post
  deletePost: async (postId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${backendApi}/api/post/delete/${postId}`);
      set({ posts: get().posts.filter((post) => post._id !== postId), loading: false });
    } catch (error) {
      console.error('Error deleting post:', error);
      set({ error: 'Error deleting post', loading: false });
    }
  },

  // Like/Unlike a post
  likePost: async (postId, userId, isLike) => {
    try {
      const response = await axios.put(`${backendApi}/api/post/like/${postId}`, {
        userId,
        isLike,
      });

      set({
        posts: get().posts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        ),
      });
    } catch (error) {
      console.error('Error liking post:', error);
      set({ error: 'Error liking post' });
    }
  },

  // Fetch notifications for a user
  fetchNotifications: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${backendApi}/api/post/notifications/${userId}`);
      set({ notifications: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ error: 'Error fetching notifications', loading: false });
    }
  },

  // Clear notifications (optional utility)
  clearNotifications: () => set({ notifications: [] }),
}));

export default usePostStore;
