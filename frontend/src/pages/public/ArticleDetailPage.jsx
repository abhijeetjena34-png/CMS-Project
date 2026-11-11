import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import PublicNavbar from '../../components/public/PublicNavbar';
import Spinner from '../../components/shared/Spinner';

const ArticleDetailPage = () => {
  const { idOrSlug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await api.get(`/content/${idOrSlug}`);
        setArticle(data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Article not found or not published.');
        } else {
          setError('Failed to load article.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [idOrSlug]);

  const fallbackImg = article
    ? `https://placehold.co/1200x400/e2e8f0/64748b?text=${encodeURIComponent(article.category)}`
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-600 text-lg">{error}</p>
            <Link to="/articles" className="text-blue-600 hover:underline mt-4 inline-block">
              ← Back to Articles
            </Link>
          </div>
        ) : (
          <article>
            {/* Back link */}
            <Link
              to="/articles"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6 font-medium"
            >
              ← Back to Articles
            </Link>

            {/* Category + Date */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {article.category}
              </span>
              <span className="text-gray-400 text-sm">
                {new Date(article.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-500 leading-relaxed mb-8 border-l-4 border-blue-400 pl-4">
              {article.description}
            </p>

            {/* Hero Image */}
            {article.image && (
              <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-72 sm:h-96 object-cover"
                  onError={(e) => { e.target.src = fallbackImg; }}
                />
              </div>
            )}

            {/* Content body */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                {article.content}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
              <span className="text-sm text-gray-400">
                Last updated: {new Date(article.updatedAt).toLocaleDateString()}
              </span>
              <Link to="/articles" className="text-sm text-blue-600 hover:underline font-medium">
                ← Browse more articles
              </Link>
            </div>
          </article>
        )}
      </div>

      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm mt-8">
        <p>© 2024 CMS Internship Project · Built with MERN Stack</p>
      </footer>
    </div>
  );
};

export default ArticleDetailPage;

