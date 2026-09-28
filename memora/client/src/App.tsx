import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage.js';
import { CreateWizardPage } from './pages/CreateWizardPage.js';
import { PreviewPage } from './pages/PreviewPage.js';
import { RecipientPage } from './pages/RecipientPage.js';
import { AdminPage } from './pages/AdminPage.js';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create/birthday" element={<CreateWizardPage />} />
        <Route path="/create" element={<Navigate to="/create/birthday" replace />} />
        <Route path="/preview/:draftId" element={<PreviewPage />} />
        <Route path="/b/:slug" element={<RecipientPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* Catch all fallback to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
