const LS_TOKEN_KEY = 'LS_TOKEN';
const LS_API_BASE_KEY = 'LS_API_BASE';

export const getSettings = () => {
  return {
    bearerToken: localStorage.getItem(LS_TOKEN_KEY) || '',
    apiBase: localStorage.getItem(LS_API_BASE_KEY) || 'http://localhost:5000',
  };
};

export const saveSettings = (settings) => {
  if (settings.bearerToken !== undefined) {
    localStorage.setItem(LS_TOKEN_KEY, settings.bearerToken);
  }
  
  if (settings.apiBase !== undefined) {
    localStorage.setItem(LS_API_BASE_KEY, settings.apiBase);
  }
};

export const clearSettings = () => {
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_API_BASE_KEY);
};
