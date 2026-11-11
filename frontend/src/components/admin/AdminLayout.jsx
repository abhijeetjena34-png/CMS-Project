import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { admin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ─── Mobile Slide-over Drawer (Backdrop & Sidebar) ─── */}
      {mobileMenuOpen && (
        <div className="relative z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 flex w-64 shadow-2xl">
            <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* ─── Desktop Fixed Sidebar ─── */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20 shadow-sm">
        <AdminSidebar />
      </div>

      {/* ─── Main Content Shell ─── */}
      <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
        {/* Mobile Top Header */}
        <header className="md:hidden sticky top-0 z-30 bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Open navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                CP
              </span>
              <span className="font-bold text-base tracking-tight text-white">CMS Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 transition-colors"
            >
              Live Site ↗
            </Link>
            <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center text-xs font-bold">
              {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
