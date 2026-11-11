import { useEffect, useState } from 'react';
import api from '../../api/axios';
import PublicNavbar from '../../components/public/PublicNavbar';
import ContentCard from '../../components/public/ContentCard';
import Spinner from '../../components/shared/Spinner';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/content');
        setArticles(data.data);
        setFiltered(data.data);
      } catch {
        setError('Failed to load articles. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Filter whenever search or category changes
  useEffect(() => {
    let result = articles;
    if (selectedCategory !== 'All') {
      result = result.filter((a) => a.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, selectedCategory, articles]);

  const categories = ['All', ...new Set(articles.map((a) => a.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900">All Articles</h1>
          <p className="text-gray-500 mt-2">Browse all published content below.</p>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="input-field max-w-xs"
            />
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-500">No articles found matching your search.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">{filtered.length} article{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm mt-8">
        <p>© 2024 CMS Project · Built with MERN Stack</p>
      </footer>
    </div>
  );
};

export default ArticlesPage;

