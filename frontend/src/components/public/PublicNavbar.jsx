import { Link, useLocation } from 'react-router-dom';
import adminUrl from '../../config/urls';

const PublicNavbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-blue-700 transition-colors">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <div>
            <span className="text-slate-900 font-bold text-lg tracking-tight block leading-tight">
              CMS Project
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
              isActive('/')
                ? 'text-blue-700 bg-blue-50 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/articles"
            className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
              isActive('/articles')
                ? 'text-blue-700 bg-blue-50 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Articles
          </Link>
          <div className="h-4 w-[1px] bg-slate-200 mx-1 sm:mx-2 hidden sm:block" />
          <a
            href={adminUrl}
            className="text-sm bg-slate-900 text-white px-3.5 py-1.5 rounded-lg hover:bg-slate-800 font-medium transition-colors shadow-sm ml-1"
          >
            Admin Portal
          </a>
        </nav>
      </div>
    </header>
  );
};

export default PublicNavbar;
