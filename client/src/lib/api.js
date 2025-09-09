import { getSettings } from "./storage";

const getApiUrl = (endpoint) => {
  const settings = getSettings();
  const baseUrl = settings.apiBase || 'http://localhost:5000';
  return `${baseUrl}/api/v1${endpoint}`;
};

const getHeaders = () => {
  const settings = getSettings();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (settings.bearerToken) {
    headers['Authorization'] = `Bearer ${settings.bearerToken}`;
  }
  
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    
    if (response.status === 401 || response.status === 403) {
      throw new Error('Invalid token. Configure it in Settings.');
    } else if (response.status === 404) {
      throw new Error('Endpoint not found. Check backend routes or update API prefix.');
    } else if (response.status >= 500) {
      throw new Error(`Server error: ${errorText || response.statusText}`);
    } else {
      throw new Error(errorText || `Request failed: ${response.statusText}`);
    }
  }
  
  return response.json();
};

export const ingestDocuments = async (path) => {
  const body = path ? { path } : {};
  
  const response = await fetch(getApiUrl('/ingest'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  
  return handleResponse(response);
};

export const askQuestion = async (query, topK = 5) => {
  const response = await fetch(getApiUrl('/chat/ask'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      query,
      top_k: topK,
    }),
  });
  
  return handleResponse(response);
};

export const calculateEligibility = async (data) => {
  const response = await fetch(getApiUrl('/eligibility/calculate'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  return handleResponse(response);
};

export const checkHealth = async () => {
  const response = await fetch(getApiUrl('/health'), {
    method: 'GET',
    headers: getHeaders(),
  });
  
  return handleResponse(response);
};
