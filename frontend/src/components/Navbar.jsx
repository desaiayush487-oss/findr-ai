import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, LogOut, User, FolderOpen } from 'lucide-react'; // <--- Changed FolderList to FolderOpen

export default function Navbar({ onOpenPostModal }) {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-600/30">
          F
        </div>
        <div>
          <span className="text-xl font-black text-white tracking-tight">
            Findr<span className="text-blue-500">.AI</span>
          </span>
          <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Campus Intelligence
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {/* My Reports Link */}
        <Link
          to="/my-reports"
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-sm flex items-center gap-2 border border-slate-700/60 transition-all"
        >
          <FolderOpen className="w-4 h-4 text-blue-400" />
          My Reports
        </Link>

        {/* Report Item Button */}
        <button
          onClick={onOpenPostModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Report Item
        </button>

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-xl">
          <User className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-300">
            {user?.name || user?.email}
          </span>
        </div>

        <button
          onClick={logoutUser}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}