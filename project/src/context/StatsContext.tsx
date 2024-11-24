import React, { createContext, useContext, useState, useEffect } from 'react';

interface Stats {
  averageWpm: number;
  averageAccuracy: number;
  testsCompleted: number;
  totalTests: number;
}

interface StatsContextType {
  stats: Stats;
  updateStats: (wpm: number, accuracy: number) => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem('typingStats');
    return saved ? JSON.parse(saved) : {
      averageWpm: 0,
      averageAccuracy: 0,
      testsCompleted: 0,
      totalTests: 10
    };
  });

  useEffect(() => {
    localStorage.setItem('typingStats', JSON.stringify(stats));
  }, [stats]);

  const updateStats = (wpm: number, accuracy: number) => {
    setStats(prev => {
      const newTestsCompleted = prev.testsCompleted + 1;
      return {
        averageWpm: Math.round(((prev.averageWpm * prev.testsCompleted) + wpm) / newTestsCompleted),
        averageAccuracy: Math.round(((prev.averageAccuracy * prev.testsCompleted) + accuracy) / newTestsCompleted),
        testsCompleted: newTestsCompleted,
        totalTests: prev.totalTests
      };
    });
  };

  return (
    <StatsContext.Provider value={{ stats, updateStats }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}