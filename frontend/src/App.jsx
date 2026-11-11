import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Admin pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ContentListPage from './pages/admin/ContentListPage';
import ContentFormPage from './pages/admin/ContentFormPage';

// Public pages
import HomePage from './pages/public/HomePage';
import ArticlesPage from './pages/public/ArticlesPage';
import ArticleDetailPage from './pages/public/ArticleDetailPage';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public Routes ───────────────────────────────────── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:idOrSlug" element={<ArticleDetailPage />} />

          {/* ── Admin Auth ─────────────────────────────────────── */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* ── Admin Protected Routes ─────────────────────────── */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <ProtectedRoute>
                <ContentListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content/new"
            element={
              <ProtectedRoute>
                <ContentFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/content/edit/:id"
            element={
              <ProtectedRoute>
                <ContentFormPage />
              </ProtectedRoute>
            }
          />

          {/* ── Fallback ───────────────────────────────────────── */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
