import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Spinner from '../../components/shared/Spinner';

const CATEGORIES = [
  'Technology', 'Business', 'Education', 'Health', 'Science',
  'Arts & Culture', 'Travel', 'Food', 'Sports', 'Other',
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
        setError(err.response?.data?.message || 'Failed to load content');
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
      setError('Title, description, category, image URL, and content are required.');
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
        setSuccess('Content updated successfully!');
      } else {
        await api.post('/admin/content', form);
        setSuccess('Content created successfully!');
        setForm(defaultForm);
      }
      setTimeout(() => navigate('/admin/content'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <AdminLayout><Spinner size="lg" className="mt-20" /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? '✏️ Edit Content' : '➕ Add New Content'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isEditing ? 'Update the content details below.' : 'Fill in the details to create new content.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 mb-5 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter content title"
              className="input-field"
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="A short summary of this content..."
              rows={3}
              className="input-field resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/500</p>
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                <option value="">— Select category —</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          {/* Image URL + Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="input-field"
              required
            />
            {form.image && !imagePreviewError && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-40 bg-gray-50">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImagePreviewError(true)}
                />
              </div>
            )}
            {form.image && imagePreviewError && (
              <p className="text-xs text-red-500 mt-1">⚠️ Could not load image from this URL.</p>
            )}
          </div>

          {/* Content body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write the full content here..."
              rows={10}
              className="input-field resize-y font-mono text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary px-6">
              {loading ? 'Saving…' : isEditing ? 'Update Content' : 'Create Content'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/content')}
              className="btn-secondary px-6"
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

