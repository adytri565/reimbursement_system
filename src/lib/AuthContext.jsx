import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Gunakan maybeSingle agar tidak melempar exception jika baris belum ada

      if (error) throw error;
      
      // Fallback jika profil belum terbuat otomatis di DB
      if (!data) {
        setUserProfile({ id: userId, role: 'employee', full_name: 'User' });
      } else {
        setUserProfile(data);
      }
    } catch (err) {
      console.error('Gagal mengambil profil:', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let currentUserId = null;

    // Ambil sesi awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        currentUserId = session.user.id;
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen perubahan auth status
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      
      // Hanya fetch profile jika ID user benar-benar berubah/baru login
      if (session?.user) {
        if (session.user.id !== currentUserId) {
          currentUserId = session.user.id;
          fetchProfile(session.user.id);
        }
      } else {
        currentUserId = null;
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setLoading(false);
    return { data, error };
  };

  const register = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserProfile(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, userProfile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam <AuthProvider>');
  }
  return context;
};