import { X, MapPin, Calendar, Tag, User, Mail, Sparkles, ShieldCheck } from 'lucide-react';

export default function ItemDetailsModal({ isOpen, onClose, item, onCheckMatches }) {
  if (!isOpen || !item) return null;

  const isLost = item.type === 'LOST';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              isLost
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {item.type} ITEM
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {item.category || 'General'}
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl font-black text-white mb-2">{item.title}</h2>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          {item.description}
        </p>

        {/* Metadata Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-xs text-slate-400">
          <div className="flex items-center gap-2 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-500">Location</span>
              <span className="text-slate-200 font-medium">{item.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <Calendar className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-500">Date Posted</span>
              <span className="text-slate-200 font-medium">
                {new Date(item.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Reporter Info */}
        <div className="mb-6 bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-semibold text-slate-500">Reported By</span>
              <span className="text-sm font-semibold text-white">
                {item.user?.name || item.user?.email || 'Campus User'}
              </span>
            </div>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-400" title="Verified Campus Reporter" />
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* AI Match Button */}
          <button
            onClick={() => {
              onClose();
              onCheckMatches(item);
            }}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Run AI Match Analysis
          </button>

          {/* Contact Reporter / Claim Button */}
          <a
            href={`mailto:${item.user?.email || ''}?subject=Findr.AI Inquiry: ${item.title}`}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <Mail className="w-4 h-4" /> Contact Reporter / Claim Item
          </a>
        </div>
      </div>
    </div>
  );
}