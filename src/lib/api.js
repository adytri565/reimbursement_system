const BASE_URL = 'http://localhost:8000/api';

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}` 
  };
}

export const api = {
  // Method GET generik untuk mendukung api.get('/finance/queue')
  get: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Gagal mengambil data dari server');
    }
    return res.json();
  },

  // Method PUT generik untuk mendukung api.put('/finance/pay/...', payload)
  put: async (endpoint, payload) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Gagal memperbarui data di server');
    }
    return res.json();
  }
};