import { Link } from 'react-router-dom';
import adminUrl from '../../config/urls';

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              CP
            </span>
            <span className="text-white font-semibold text-lg tracking-tight">CMS Project</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/articles" className="hover:text-white transition-colors">
              Articles
            </Link>
            <a href={adminUrl} className="hover:text-white transition-colors">
              Admin Portal
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {currentYear} CMS Project. All rights reserved.</p>
          <p>Built with MongoDB, Express.js, React.js, and Node.js.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
