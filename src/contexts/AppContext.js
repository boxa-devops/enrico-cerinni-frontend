'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';

const AppContext = createContext();

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
  SET_GLOBAL_STATE: 'SET_GLOBAL_STATE',
};

// Initial state
const initialState = {
  loading: false,
  error: null,
  notification: null,
  globalState: {},
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case ACTIONS.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };
    case ACTIONS.CLEAR_NOTIFICATION:
      return {
        ...state,
        notification: null,
      };
    case ACTIONS.SET_GLOBAL_STATE:
      return {
        ...state,
        globalState: {
          ...state.globalState,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = useCallback((loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  const setNotification = useCallback((notification) => {
    dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: notification });
  }, []);

  const clearNotification = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_NOTIFICATION });
  }, []);

  const setGlobalState = useCallback((newState) => {
    dispatch({ type: ACTIONS.SET_GLOBAL_STATE, payload: newState });
  }, []);

  const showError = useCallback((message, title = 'Xatolik') => {
    setError({ message, title });
  }, [setError]);

  const showSuccess = useCallback((message, title = 'Muvaffaqiyatli') => {
    setNotification({ message, title, type: 'success' });
  }, [setNotification]);

  const showWarning = useCallback((message, title = 'Ogohlantirish') => {
    setNotification({ message, title, type: 'warning' });
  }, [setNotification]);

  const showInfo = useCallback((message, title = 'Ma\'lumot') => {
    setNotification({ message, title, type: 'info' });
  }, [setNotification]);

  const value = {
    // State
    loading: state.loading,
    error: state.error,
    notification: state.notification,
    globalState: state.globalState,
    
    // Actions
    setLoading,
    setError,
    clearError,
    setNotification,
    clearNotification,
    setGlobalState,
    
    // Convenience methods
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 