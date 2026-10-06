import React from 'react';

export default function StatCard({ number, label, icon }) {
  return (
    <div className="bg-brand-card rounded-2xl p-6 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
      <div className="z-10">
        <h3 className="text-5xl font-bold mb-1">{number}</h3>
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
      <div className="z-10 text-4xl opacity-50">
        {icon}
      </div>
      {/* Efek gradasi/bulatan transparan di kanan seperti pada gambar */}
      <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white opacity-5 rounded-full blur-xl"></div>
    </div>
  );
}