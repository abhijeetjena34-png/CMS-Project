import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ContentListPage from './pages/admin/ContentListPage';
import ContentFormPage from './pages/admin/ContentFormPage';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<LoginPage />} />
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
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
