import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';
import ContentCard from '../../components/public/ContentCard';
import Spinner from '../../components/shared/Spinner';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/content');
        setFeatured(data.data.slice(0, 6));
      } catch {
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>CMS Project · Dynamic Content Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
            Modern Content Publishing <br className="hidden sm:inline" />
            <span className="text-blue-600">Powered by the MERN Stack</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            A dynamic content management platform backed by MongoDB. All articles, categories,
            and media updates reflect instantly on this public showcase upon publication.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/articles"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>Explore All Articles</span>
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            <Link
              to="/admin/login"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-slate-700 font-semibold px-6 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span>Admin Management</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Content Grid Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Latest Publications</h2>
            <p className="text-slate-500 text-sm mt-1">
              Curated articles managed dynamically through the administration panel
            </p>
          </div>
          <Link
            to="/articles"
            className="text-sm text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center gap-1 group"
          >
            <span>View all articles</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {loading ? (
          <Spinner size="lg" className="py-24" />
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-xl border border-red-200 p-8">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 p-12">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Published Content Yet</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Content created and published in the Admin Panel will automatically appear here.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Go to Admin Panel →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item) => (
              <ContentCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

export default HomePage;
