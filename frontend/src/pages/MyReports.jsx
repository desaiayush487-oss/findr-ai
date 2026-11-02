import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyItems, updateItemStatus } from '../services/api';
import { ArrowLeft, CheckCircle2, Clock, MapPin, Loader2 } from 'lucide-react';

export default function MyReports() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const { data } = await getMyItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch user items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await updateItemStatus(id);
      fetchMyItems(); // Refresh list
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl font-black text-white">My Reported Items</h1>
            <p className="text-xs text-slate-400">Manage items you have posted as lost or found.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
            <p className="text-sm">Loading your reports...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm mb-3">You haven't posted any items yet.</p>
            <Link to="/" className="text-xs text-blue-400 font-semibold hover:underline">
              Go back and report an item
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      item.type === 'LOST' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {item.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      item.status === 'OPEN' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 max-w-xl">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-400" /> {item.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-400" /> {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleStatus(item._id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    item.status === 'OPEN'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {item.status === 'OPEN' ? 'Mark as Resolved' : 'Reopen Report'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}