export const getApiBaseUrl = () => {
  const storedUrl = localStorage.getItem('backendUrl');
  if (storedUrl) return storedUrl;
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

export const setApiBaseUrl = (url) => {
  localStorage.setItem('backendUrl', url);
};
