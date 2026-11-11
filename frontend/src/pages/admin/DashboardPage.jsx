import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Spinner from '../../components/shared/Spinner';

const StatCard = ({ label, value, iconBg, iconColor, icon }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
      {icon}
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time content inventory and status breakdown
          </p>
        </div>
        <Link
          to="/admin/content/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>New Content</span>
        </Link>
      </div>

      {loading ? (
        <Spinner size="lg" className="mt-20" />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{error}</div>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <StatCard
              label="Total Records"
              value={stats.total}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              }
            />

            <StatCard
              label="Published Articles"
              value={stats.published}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <StatCard
              label="Draft Articles"
              value={stats.draft}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              }
            />
          </div>

          {/* Recent Content Table Card */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Recently Added Content</h2>
                <p className="text-xs text-slate-500 mt-0.5">Latest records stored in MongoDB</p>
              </div>
              <Link
                to="/admin/content"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View all records</span>
                <span>→</span>
              </Link>
            </div>

            {recentContent.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-600">No content records found in database.</p>
                <Link to="/admin/content/new" className="text-xs text-blue-600 hover:underline mt-2 inline-block font-semibold">
                  + Create your first article
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3.5">Title</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Created Date</th>
                      <th className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentContent.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900 max-w-sm truncate">
                          {item.title}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-100">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                              item.status === 'Published'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                item.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            />
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/admin/content/edit/${item._id}`}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default DashboardPage;
