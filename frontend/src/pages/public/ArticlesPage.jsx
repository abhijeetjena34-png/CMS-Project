import { useEffect, useState } from 'react';
import api from '../../api/axios';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';
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
    const fetchArticles = async () => {
      try {
        const { data } = await api.get('/content');
        setArticles(data.data);
        setFiltered(data.data);
      } catch {
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
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

  const categories = ['All', ...new Set(articles.map((a) => a.category).filter(Boolean))];

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      {/* Header & Filter Bar */}
      <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Published Articles
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
              Explore dynamic articles across technology, business, design, and more. Filter by
              topic or search keywords.
            </p>
          </div>

          {/* Search + Category Filters */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles by title or keyword…"
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 flex-wrap items-center">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {loading ? (
          <Spinner size="lg" className="py-24" />
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-xl border border-red-200 p-8">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 p-12">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Matching Articles Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              We couldn't find any articles matching your search query or selected category.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Reset all filters →
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
              <p className="text-sm font-medium text-slate-500">
                Showing <span className="font-semibold text-slate-900">{filtered.length}</span> published article{filtered.length === 1 ? '' : 's'}
              </p>
              {(search || selectedCategory !== 'All') && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear active filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <ContentCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

export default ArticlesPage;
