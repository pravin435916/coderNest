import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { backendApi } from '../Url'

export const ApiContext = createContext();

const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to handle API requests
  const apiRequest = async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        method,
        url: `${backendApi}${url}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        ...(data && { data }),
      };
      const response = await axios(config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err; // Rethrow to allow calling components to handle it
    } finally {
      setLoading(false);
    }
  };

  // API functions
  const fetchAll = async (endpoint) => {
    return await apiRequest('GET', endpoint);
  };

  const fetchOne = async (endpoint, id) => {
    return await apiRequest('GET', `${endpoint}/${id}`);
  };

  const create = async (endpoint, data) => {
    return await apiRequest('POST', endpoint, data);
  };

  const update = async (endpoint, id, data) => {
    return await apiRequest('PUT', `${endpoint}/${id}`, data);
  };

  const remove = async (endpoint, id) => {
    return await apiRequest('DELETE', `${endpoint}/${id}`);
  };

  return (
    <ApiContext.Provider
      value={{
        fetchAll,
        fetchOne,
        create,
        update,
        remove,
        loading,
        error,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
