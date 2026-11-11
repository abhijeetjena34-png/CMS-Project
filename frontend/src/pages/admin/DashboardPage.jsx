import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Spinner from '../../components/shared/Spinner';

const StatCard = ({ label, value, color, icon }) => (
  <div className="card p-6 flex items-center gap-4">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [recentContent, setRecentContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/admin/content');
        const all = data.data;
        const published = all.filter((c) => c.status === 'Published').length;
        const draft = all.filter((c) => c.status === 'Draft').length;
        setStats({ total: all.length, published, draft });
        setRecentContent(all.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your content overview.</p>
      </div>

      {loading ? (
        <Spinner size="lg" className="mt-20" />
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <StatCard label="Total Content" value={stats.total} color="bg-blue-100" icon="📄" />
            <StatCard label="Published" value={stats.published} color="bg-green-100" icon="✅" />
            <StatCard label="Drafts" value={stats.draft} color="bg-yellow-100" icon="✏️" />
          </div>

          {/* Recent content */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Recent Content</h3>
              <Link
                to="/admin/content"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all →
              </Link>
            </div>

            {recentContent.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-4xl mb-2">📭</p>
                <p>No content yet. <Link to="/admin/content/new" className="text-blue-600 hover:underline">Create your first post →</Link></p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Title</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Category</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left px-6 py-3 text-gray-500 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentContent.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-medium text-gray-900 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="px-6 py-3">
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            item.status === 'Published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;

