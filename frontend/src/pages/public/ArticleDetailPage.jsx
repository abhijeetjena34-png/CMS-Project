import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import PublicNavbar from '../../components/public/PublicNavbar';
import PublicFooter from '../../components/public/PublicFooter';
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
          setError('The requested article was not found or is currently in draft status.');
        } else {
          setError('Failed to load article. Please check your connection and try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [idOrSlug]);

  const fallbackImg = article
    ? `https://placehold.co/1200x600/f1f5f9/64748b?text=${encodeURIComponent(article.category || 'Article')}`
    : '';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        {loading ? (
          <Spinner size="lg" className="py-24" />
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 p-12">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Article Unavailable</h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">{error}</p>
            <Link
              to="/articles"
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to All Articles
            </Link>
          </div>
        ) : (
          <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/articles" className="hover:text-blue-600 transition-colors">
                Articles
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-medium truncate max-w-xs">{article.title}</span>
            </nav>

            {/* Category & Date Header */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                {article.category}
              </span>
              <div className="flex items-center text-xs text-slate-500 gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.253 18.75m3-18.75H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3z" />
                </svg>
                <time dateTime={article.createdAt}>
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>

            {/* Article Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-5">
              {article.title}
            </h1>

            {/* Description Lead */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 border-l-4 border-blue-500 pl-4 bg-slate-50/60 py-2 rounded-r">
              {article.description}
            </p>

            {/* Hero Image Container */}
            {article.image && (
              <div className="rounded-xl overflow-hidden mb-8 border border-slate-200 bg-slate-100 aspect-[16/9]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImg;
                  }}
                />
              </div>
            )}

            {/* Article Content Body (Standard Tailwind, no prose plugin dependency) */}
            <div className="border-t border-slate-100 pt-8 mt-4">
              <div className="text-slate-800 leading-relaxed text-base sm:text-lg whitespace-pre-wrap font-sans">
                {article.content}
              </div>
            </div>

            {/* Article Footer & Navigation */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
              <p>
                Last updated on{' '}
                <span className="font-medium text-slate-700">
                  {new Date(article.updatedAt || article.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </p>
              <Link
                to="/articles"
                className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 text-sm"
              >
                ← Back to all articles
              </Link>
            </div>
          </article>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};

export default ArticleDetailPage;
