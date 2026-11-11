import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Spinner from '../../components/shared/Spinner';

const ContentListPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/content');
      setContent(data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/content/${id}`);
      setContent((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 'Published' ? 'Draft' : 'Published';
    setTogglingId(item._id);
    try {
      const { data } = await api.patch(`/admin/content/${item._id}/status`, {
        status: newStatus,
      });
      setContent((prev) =>
        prev.map((c) => (c._id === item._id ? data.data : c))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all your content records</p>
        </div>
        <Link to="/admin/content/new" className="btn-primary">
          + Add Content
        </Link>
      </div>

      {loading ? (
        <Spinner size="lg" className="mt-20" />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      ) : content.length === 0 ? (
        <div className="card p-16 text-center text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg font-medium text-gray-600">No content found</p>
          <p className="text-sm mt-1 mb-4">Get started by creating your first content item.</p>
          <Link to="/admin/content/new" className="btn-primary inline-block">
            + Create Content
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Title</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left px-6 py-3 text-gray-500 font-medium">Created</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {content.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 max-w-xs truncate">{item.title}</div>
                      <div className="text-xs text-gray-400 truncate max-w-xs mt-0.5">{item.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        disabled={togglingId === item._id}
                        className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors disabled:opacity-50 ${
                          item.status === 'Published'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {togglingId === item._id ? '…' : item.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/content/edit/${item._id}`}
                        className="inline-block bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        disabled={deletingId === item._id}
                        className="bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingId === item._id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ContentListPage;

