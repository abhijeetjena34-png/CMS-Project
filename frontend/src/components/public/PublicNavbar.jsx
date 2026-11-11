import { Link } from 'react-router-dom';

const PublicNavbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-700 flex items-center gap-2">
          🗂️ <span>CMS Internship</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Home
          </Link>
          <Link to="/articles" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Articles
          </Link>
          <Link
            to="/admin/login"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;

