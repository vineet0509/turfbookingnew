import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import api from './api';

const getBasename = () => {
  if (window.APP_URL) {
    try {
      const url = new URL(window.APP_URL);
      const pathname = url.pathname.replace(/\/$/, '');
      return pathname;
    } catch (e) {
      return '';
    }
  }
  return '';
};

const prefixBasename = (url) => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || !url.startsWith('/')) {
    return url;
  }
  const basename = getBasename();
  if (basename && url.startsWith(basename)) {
    return url;
  }
  return `${basename}${url}`;
};

// Context for global state (shared Inertia props)
const PageContext = createContext(null);

export function PageProvider({ children, value }) {
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export function usePage() {
  const context = useContext(PageContext);
  if (!context) {
    // Fallback if not inside provider yet
    return {
      props: {
        auth: { user: JSON.parse(localStorage.getItem('user')) || null },
        errors: {},
        flash: {},
      }
    };
  }
  return context;
}

// Compatibility Link Component
export function Link({ href, children, method = 'get', as = 'a', data = {}, ...props }) {
  const navigate = useNavigate();

  if (method !== 'get' || as === 'button') {
    const handleClick = async (e) => {
      e.preventDefault();
      try {
        const res = await api[method.toLowerCase()](href, data);
        if (href.includes('logout')) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = prefixBasename('/');
          return;
        }
        if (res.data.access_token) {
          localStorage.setItem('auth_token', res.data.access_token);
        }
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        if (res.data.redirect) {
          window.location.href = prefixBasename(res.data.redirect);
        }
      } catch (err) {
        console.error(err);
        if (href.includes('logout')) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = prefixBasename('/');
        }
      }
    };
    return (
      <button onClick={handleClick} {...props}>
        {children}
      </button>
    );
  }

  // Handle standard internal link
  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  );
}

// Compatibility Head Component
export function Head({ title, children }) {
  useEffect(() => {
    if (title) {
      document.title = `${title} - TurfBook`;
    }
  }, [title]);
  return null;
}

// Compatibility useForm Hook
export function useForm(initialValues = {}) {
  const [data, setDataState] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const setData = (key, value) => {
    if (typeof key === 'object') {
      setDataState(prev => ({ ...prev, ...key }));
    } else {
      setDataState(prev => ({ ...prev, [key]: value }));
    }
  };

  const submit = async (method, url, options = {}) => {
    setProcessing(true);
    setErrors({});
    if (options.onBefore) options.onBefore();
    
    try {
      const res = await api[method](url, data);
      setProcessing(false);
      
      if (options.onSuccess) {
        // Mock Inertia page response structure if needed
        options.onSuccess({ props: res.data });
      }
      
      if (url.includes('logout')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = prefixBasename('/');
        return;
      }
      if (res.data.access_token) {
        localStorage.setItem('auth_token', res.data.access_token);
      }
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      if (res.data.redirect) {
        // Force a hard reload if this is a login/register success to sync SPA global state
        if (res.data.access_token || url.includes('login') || url.includes('register')) {
          window.location.href = prefixBasename(res.data.redirect);
        } else {
          navigate(res.data.redirect);
        }
      }
    } catch (err) {
      setProcessing(false);
      if (err.response && err.response.status === 422) {
        const serverErrors = err.response.data.errors || {};
        setErrors(serverErrors);
        if (options.onError) options.onError(serverErrors);
      } else {
        if (options.onError) options.onError(err);
      }
    } finally {
      if (options.onFinish) options.onFinish();
    }
  };

  return {
    data,
    setData,
    post: (url, options) => submit('post', url, options),
    put: (url, options) => submit('put', url, options),
    patch: (url, options) => submit('patch', url, options),
    delete: (url, options) => submit('delete', url, options),
    processing,
    errors,
    reset: () => setDataState(initialValues),
  };
}

// Compatibility router object
export const router = {
  visit: (url, options = {}) => {
    window.location.href = prefixBasename(url);
  },
  get: async (url, options = {}) => {
    try {
      const res = await api.get(url);
      if (options.onSuccess) options.onSuccess(res);
    } catch (err) {
      if (options.onError) options.onError(err);
    }
  },
  post: async (url, data, options = {}) => {
    try {
      const res = await api.post(url, data);
      if (url.includes('logout')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = prefixBasename('/');
        return;
      }
      if (res.data.access_token) {
        localStorage.setItem('auth_token', res.data.access_token);
      }
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      if (options.onSuccess) options.onSuccess(res);
      if (res.data.redirect) {
        window.location.href = prefixBasename(res.data.redirect);
      }
    } catch (err) {
      if (url.includes('logout')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = prefixBasename('/');
        return;
      }
      if (options.onError) options.onError(err);
    }
  },
  put: async (url, data, options = {}) => {
    try {
      const res = await api.put(url, data);
      if (res.data.access_token) {
        localStorage.setItem('auth_token', res.data.access_token);
      }
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      if (options.onSuccess) options.onSuccess(res);
      if (res.data.redirect) {
        window.location.href = prefixBasename(res.data.redirect);
      }
    } catch (err) {
      if (options.onError) options.onError(err);
    }
  },
  delete: async (url, options = {}) => {
    try {
      const res = await api.delete(url);
      if (options.onSuccess) options.onSuccess(res);
      
      // If logging out or deleting, remove local storage auth keys and redirect to home
      if (url.includes('logout')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = prefixBasename('/');
        return;
      }
      
      if (res.data.redirect) {
        window.location.href = prefixBasename(res.data.redirect);
      }
    } catch (err) {
      if (options.onError) options.onError(err);
    }
  }
};
