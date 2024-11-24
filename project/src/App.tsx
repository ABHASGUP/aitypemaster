import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Keyboard, Trophy } from 'lucide-react';
import TypingTest from './components/TypingTest';
import Scores from './components/Scores';
import { StatsProvider } from './context/StatsContext';
import { UserProvider } from './context/UserContext';

function Navigation() {
  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Keyboard className="w-6 h-6 text-indigo-600" />
          <Link to="/" className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            AI TypeMaster
          </Link>
        </div>
        <Link
          to="/scores"
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <Trophy className="w-5 h-5" />
          <span>Scores</span>
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <StatsProvider>
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <Navigation />
            <main className="max-w-4xl mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<TypingTest />} />
                <Route path="/scores" element={<Scores />} />
              </Routes>
            </main>
          </div>
        </StatsProvider>
      </UserProvider>
    </Router>
  );
}

export default App;