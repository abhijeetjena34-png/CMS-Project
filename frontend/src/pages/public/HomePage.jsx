import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import PublicNavbar from '../../components/public/PublicNavbar';
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
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/10 backdrop-blur text-blue-200 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
            CMS Internship Project
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
            Discover Quality <br />
            <span className="text-blue-300">Content &amp; Articles</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
            A dynamic content management system built with the MERN stack.
            All content is managed through the admin panel.
          </p>
          <Link
            to="/articles"
            className="inline-block bg-white text-blue-800 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Browse All Articles →
          </Link>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <p className="text-gray-500 text-sm mt-1">Fresh published content from our admin panel</p>
          </div>
          <Link to="/articles" className="text-sm text-blue-600 font-medium hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 text-lg">No published content yet.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon or add content in the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item) => (
              <ContentCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm mt-8">
        <p>© 2024 CMS Internship Project · Built with MERN Stack</p>
      </footer>
    </div>
  );
};

export default HomePage;

