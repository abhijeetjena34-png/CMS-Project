import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Spinner from '../../components/shared/Spinner';

const CATEGORIES = [
  'Technology',
  'Business',
  'Education',
  'Health',
  'Science',
  'Arts & Culture',
  'Travel',
  'Food',
  'Sports',
  'Other',
];

const defaultForm = {
  title: '',
  description: '',
  category: '',
  image: '',
  content: '',
  status: 'Draft',
};

const ContentFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // Load existing content when editing
  useEffect(() => {
    if (!isEditing) return;
    const fetchContent = async () => {
      try {
        const { data } = await api.get(`/admin/content/${id}`);
        const { title, description, category, image, content, status } = data.data;
        setForm({ title, description, category, image: image || '', content, status });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load content for editing');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchContent();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'image') setImagePreviewError(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, category, image, content } = form;
    if (!title.trim() || !description.trim() || !category || !image.trim() || !content.trim()) {
      setError('Title, description, category, image URL, and content body are required.');
      return;
    }

    if (!/^https?:\/\/.+/.test(image.trim())) {
      setError('Image must be a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        await api.put(`/admin/content/${id}`, form);
        setSuccess('Article updated successfully!');
      } else {
        await api.post('/admin/content', form);
        setSuccess('Article created successfully!');
        setForm(defaultForm);
      }
      setTimeout(() => navigate('/admin/content'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Save operation failed. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout>
        <Spinner size="lg" className="mt-20" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/admin/content" className="hover:text-blue-600 transition-colors">
              Content Management
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">
              {isEditing ? 'Edit Article' : 'New Article'}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {isEditing
              ? 'Update the article fields and save to persist changes to MongoDB.'
              : 'Complete the form below to create a draft or publish immediately to the live site.'}
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm flex items-start gap-2.5">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 mb-6 text-sm flex items-center gap-2.5">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400">{form.title.length}/200</span>
            </div>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Modern Web Architecture with MERN Stack"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              maxLength={200}
              required
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Description / Excerpt <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-400">{form.description.length}/500</span>
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide a concise summary that will appear on public article cards…"
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-none"
              maxLength={500}
              required
            />
          </div>

          {/* Category & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                required
              >
                <option value="">— Select Category —</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Publication Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              >
                <option value="Draft">Draft (Internal only)</option>
                <option value="Published">Published (Publicly visible)</option>
              </select>
            </div>
          </div>

          {/* Image URL + Live Preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              required
            />

            {/* Live Image Preview Container */}
            {form.image && !imagePreviewError && (
              <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 max-w-sm aspect-[16/9] relative">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImagePreviewError(true)}
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/70 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-sm">
                  Live Preview
                </span>
              </div>
            )}

            {form.image && imagePreviewError && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <span>⚠️ Note: Could not load image preview from this URL. Please verify the link.</span>
              </p>
            )}
          </div>

          {/* Content Body */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Content Body <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write the full body of the article here…"
              rows={12}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors font-sans leading-relaxed"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span>Saving Article…</span>
                </>
              ) : (
                <span>{isEditing ? 'Update Article' : 'Create Article'}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/content')}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ContentFormPage;
