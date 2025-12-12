import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { VSCodeLayout } from './components/VSCodeLayout';
import { LunchCyclePage } from './pages/LunchCyclePage';
import { LunchHubPage } from './pages/LunchHubPage';

function App() {
  return (
    <BrowserRouter>
      <VSCodeLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/cycle" replace />} />
          <Route path="/cycle" element={<LunchCyclePage />} />
          <Route path="/hub" element={<LunchHubPage />} />
        </Routes>
      </VSCodeLayout>
    </BrowserRouter>
  );
}

export default App;
