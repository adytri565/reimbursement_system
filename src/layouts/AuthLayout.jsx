import React from 'react';
// 1. Import gambar Anda dari folder tempat Anda menyimpannya
import logoImg from '../public/logo.png'; 

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full font-sans bg-white">
      
      <div className="hidden md:flex md:w-1/2 bg-[#232B3E] items-center justify-center">
        {/* 2. Gunakan variabel logoImg di dalam src */}
        <img 
          src={logoImg} 
          alt="Logo Perusahaan" 
          className="w-64 md:w-80 h-auto object-contain" 
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 overflow-y-auto">
        {children}
      </div>

    </div>
  );
}