import { MapPin, Calendar } from 'lucide-react';

export default function ItemCard({ item, onClick }) {
  const isLost = item.type === 'LOST';

  return (
    <div
      onClick={onClick}
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-blue-500/5 flex flex-col cursor-pointer group"
    >
      <div className="relative h-48 bg-slate-800 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm font-medium">
            No Image Provided
          </div>
        )}
        <span
          className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full border ${
            isLost
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
          }`}
        >
          {item.type}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">{item.description}</p>
        </div>

        <div className="space-y-2 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}