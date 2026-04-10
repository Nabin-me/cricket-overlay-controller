import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CricketController from '@/features/cricket-controller/CricketController';
import CricketScoreboard from '@/features/cricket-scoreboard/CricketScoreboard';
import { AnimationOverlay } from '@/features/cricket-controller/components/AnimationOverlay';
import ResultsPage from '@/features/results/ResultsPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CricketController />} />
        <Route path="/controller" element={<CricketController />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route
          path="/overlay"
          element={
            <>
              <CricketScoreboard />
              <AnimationOverlay />
            </>
          }
        />
      </Routes>
    </Router>
  );
}
