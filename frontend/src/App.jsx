import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MyReports from './pages/MyReports';
import Navbar from './components/Navbar';
import ItemCard from './components/ItemCard';
import PostModal from './components/PostModal';
import MatchModal from './components/MatchModal';
import ItemDetailsModal from './components/ItemDetailsModal';
import { useAuth } from './context/AuthContext';
import { getItems } from './services/api';
import { Search, Sparkles, Loader2 } from 'lucide-react';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState(null);
  const [selectedItemForMatch, setSelectedItemForMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await getItems(searchTerm, filterType);
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchTerm, filterType]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onOpenPostModal={() => setIsPostModalOpen(true)} />

      <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1">
        {/* Hero & Search Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Item Matching Active
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Find What You've Lost on Campus</h1>
          <p className="text-slate-400 text-sm md:text-base">
            Search through reported items or log a missing/found item to notify campus students instantly.
          </p>

          {/* Search Bar */}
          <div className="mt-6 flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-xl">
            <Search className="w-5 h-5 text-slate-500 ml-3" />
            <input
              type="text"
              placeholder="Search by title, description, or location..."
              className="bg-transparent text-sm text-white placeholder-slate-500 w-full focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Recent Reports <span className="text-xs bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-400 font-normal">{items.length} items</span>
          </h2>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            {['ALL', 'LOST', 'FOUND'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterType === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Empty / Grid Views */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
            <p className="text-sm">Fetching reports...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm mb-3">No items reported yet.</p>
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="text-xs text-blue-400 hover:underline font-semibold"
            >
              Be the first to report an item!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onClick={() => setSelectedItemForDetails(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onItemAdded={fetchItems}
      />

      <ItemDetailsModal
        isOpen={!!selectedItemForDetails}
        onClose={() => setSelectedItemForDetails(null)}
        item={selectedItemForDetails}
        onCheckMatches={(item) => setSelectedItemForMatch(item)}
      />

      <MatchModal
        isOpen={!!selectedItemForMatch}
        onClose={() => setSelectedItemForMatch(null)}
        item={selectedItemForMatch}
      />
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/my-reports"
          element={
            <PrivateRoute>
              <MyReports />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}  