export default function SummaryCard({ label, value, icon: Icon, accent = "text-slate-800" }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-2xl font-semibold mt-1 ${accent}`}>{value}</p>
      </div>
      {Icon && (
        <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
          <Icon className="text-orange-500" size={20} />
        </div>
      )}
    </div>
  );
}
