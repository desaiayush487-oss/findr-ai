import { useState, useEffect } from 'react';
import { X, Sparkles, MapPin, Mail, Loader2, CheckCircle } from 'lucide-react';
import { getSmartMatches } from '../services/api';

export default function MatchModal({ isOpen, onClose, item }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && item) {
      fetchMatches();
    }
  }, [isOpen, item]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const { data } = await getSmartMatches(item._id);
      setMatches(data);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" /> AI Match Analysis
        </div>
        <h2 className="text-xl font-black text-white mb-1">
          Smart Matches for "{item.title}"
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Findr.AI scanned campus reports to find potential database matches based on category, keywords, and location.
        </p>

        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
              <p className="text-xs">Analyzing potential matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12 bg-slate-950 border border-slate-800/80 rounded-xl">
              <p className="text-slate-400 text-sm font-medium">No matching items found yet.</p>
              <p className="text-slate-500 text-xs mt-1">
                We'll automatically alert you when a matching report is posted!
              </p>
            </div>
          ) : (
            matches.map(({ item: matchItem, matchScore }) => (
              <div
                key={matchItem._id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {matchScore}% Confidence Match
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {matchItem.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{matchItem.title}</h3>
                  <p className="text-xs text-slate-400">{matchItem.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> {matchItem.location}
                  </div>
                </div>

                <a
                  href={`mailto:${matchItem.user?.email}?subject=Findr.AI Match Inquiry: ${matchItem.title}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                >
                  <Mail className="w-3.5 h-3.5" /> Contact Finder
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}