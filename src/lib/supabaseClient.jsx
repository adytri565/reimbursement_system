import { createClient } from '@supabase/supabase-js';

// Masukkan link dan Publishable Key Anda secara langsung
const supabaseUrl = "https://dhcborfqjsqluynedjmw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoY2JvcmZxanNxbHV5bmVkam13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDg5NjgsImV4cCI6MjEwMzcyNDk2OH0.WSKwQdCjvcSCU-MV-mlsypmMyvPNmKyWtkmsURtnc9c"; // Pastikan Anda menyalin seluruh sisa teks kuncinya jika ada

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadReceipt(file) {
  if (!file) return null;
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `reimbursements/${fileName}`;

  const { data, error } = await supabase.storage
    .from('receipts')
    .upload(filePath, file);

  if (error) throw error;
  
  const { data: publicUrlData } = supabase.storage
    .from('receipts')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}