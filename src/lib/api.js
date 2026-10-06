import { supabase } from '../lib/supabaseClient';

export const api = {
  async get(endpoint) {
    try {
      // 1. Endpoint Manager Dashboard & Pending
      if (endpoint === '/manager/reimbursements' || endpoint === '/manager/reimbursements/pending') {
        const statusFilter = endpoint.includes('pending') ? 'pending' : null;
        
        let query = supabase.from('reimbursements').select('*, profiles(full_name)');
        if (statusFilter) {
          query = query.eq('status', statusFilter);
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return { data };
      }

      // 2. Endpoint Finance
      if (endpoint.startsWith('/finance')) {
        const { data, error } = await supabase.from('reimbursements').select('*, profiles(full_name)');
        if (error) throw error;
        return { data };
      }

      // 3. Endpoint Admin Users / Access
      if (endpoint.startsWith('/admin')) {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) throw error;
        return { data };
      }

      // Default throw jika endpoint belum terdaftar di switch ini
      throw new Error(`Endpoint GET '${endpoint}' belum terdaftar.`);
    } catch (err) {
      console.error(`API GET Error [${endpoint}]:`, err.message);
      throw err;
    }
  },

  async post(endpoint, body) {
    try {
      if (endpoint.startsWith('/reimbursements') || endpoint.startsWith('/manager/add')) {
        const { data, error } = await supabase.from('reimbursements').insert([body]).select();
        if (error) throw error;
        return { data };
      }
      throw new Error(`Endpoint POST '${endpoint}' belum terdaftar.`);
    } catch (err) {
      console.error(`API POST Error [${endpoint}]:`, err.message);
      throw err;
    }
  },

  async put(endpoint, body) {
    // Tambahkan logika update/patch jika diperlukan
    const { data, error } = await supabase.from('reimbursements').update(body).match({ id: body.id }).select();
    if (error) throw error;
    return { data };
  }
};