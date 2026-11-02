import { useState } from 'react';
import { X, PlusCircle, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { createItem } from '../services/api';

export default function PostModal({ isOpen, onClose, onItemAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Others',
    location: '',
    type: 'LOST',
    image: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createItem(formData);
      onItemAdded();
      onClose();
      setFormData({
        title: '',
        description: '',
        category: 'Others',
        location: '',
        type: 'LOST',
        image: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit post. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Report an Item</h2>
        <p className="text-xs text-slate-400 mb-6">Log details to inform the campus community.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Report Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['LOST', 'FOUND'].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFormData({ ...formData, type })}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    formData.type === type
                      ? type === 'LOST'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {type} ITEM
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Black Dell Laptop Bag"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Local File Browse Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Item Image (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-slate-300 flex items-center justify-center gap-2 transition-all">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>{formData.image ? 'Change Selected Image' : 'Browse Local Storage'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {formData.image && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Electronics">Electronics</option>
                <option value="ID & Cards">ID & Cards</option>
                <option value="Keys">Keys</option>
                <option value="Clothing">Clothing</option>
                <option value="Books & Stationery">Books & Stationery</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Science Block C"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows="3"
              required
              placeholder="Provide identifiable details or specific location notes..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Post Report'}
          </button>
        </form>
      </div>
    </div>
  );
}