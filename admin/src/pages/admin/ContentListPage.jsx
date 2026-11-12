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
      setError(err.response?.data?.message || 'Failed to fetch content records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/content/${id}`);
      setContent((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete operation failed');
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Create, edit, toggle visibility, and delete articles across all categories
          </p>
        </div>
        <Link
          to="/admin/content/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add New Article</span>
        </Link>
      </div>

      {loading ? (
        <Spinner size="lg" className="mt-20" />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{error}</div>
      ) : content.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">No Articles Created Yet</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            Get started by creating your first article to publish on the public showcase.
          </p>
          <Link
            to="/admin/content/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            + Create Article
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Article Details</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Status (Click to toggle)</th>
                  <th className="px-6 py-3.5">Created Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {content.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0 max-w-xs sm:max-w-md">
                          <p className="font-semibold text-slate-900 truncate">{item.title}</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        disabled={togglingId === item._id}
                        title="Click to toggle status between Published and Draft"
                        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold border transition-all cursor-pointer disabled:opacity-50 ${
                          item.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span>
                          {togglingId === item._id ? 'Updating…' : item.status}
                        </span>
                      </button>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/content/edit/${item._id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          <span>Edit</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          disabled={deletingId === item._id}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          <span>{deletingId === item._id ? 'Deleting…' : 'Delete'}</span>
                        </button>
                      </div>
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
