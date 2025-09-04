import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../api/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.validateToken();
      
      if (response && response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
        if (response && response.message) {
          setError(response.message);
        }
      }
    } catch (error) {
      console.error('Auth validation error:', error);
      setUser(null);
      // Don't set error for validation failures as they're expected when not logged in
      if (error.message && !error.message.includes('401')) {
        setError(error.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(email, password);
      
      if (response && response.success) {
        // After successful login, validate the token to get user data
        const validateResponse = await authAPI.validateToken();
        
        if (validateResponse && validateResponse.success && validateResponse.data) {
          setUser(validateResponse.data);
          return { success: true };
        } else {
          setUser(null);
          return { success: false, error: 'Login successful but user validation failed' };
        }
      } else {
        setUser(null);
        const errorMessage = response?.message || 'Login failed';
        setError(errorMessage);
        return { 
          success: false, 
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      const errorMessage = error.response?.data?.message || error.message || 'Network error occurred';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
      router.push('/login');
    }
  };

  const isAuthenticated = () => {
    // Don't consider user authenticated while loading
    if (loading) {
      return false;
    }
    
    // User is authenticated if we have user data and no errors
    return !!user && !error;
  };

  const refreshAuth = async () => {
    await checkAuthStatus();
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    refreshAuth,
  };
}; 