import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/public/HomePage';
import ArticlesPage from './pages/public/ArticlesPage';
import ArticleDetailPage from './pages/public/ArticleDetailPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:idOrSlug" element={<ArticleDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
