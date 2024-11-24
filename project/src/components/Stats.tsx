import React from 'react';
import { TrendingUp, Target, Clock } from 'lucide-react';
import { useStats } from '../context/StatsContext';

function Stats() {
  const { stats } = useStats();
  const { averageWpm, averageAccuracy, testsCompleted, totalTests } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Average Speed</span>
            <span className="font-semibold">{averageWpm} WPM</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((averageWpm / 100) * 100, 100)}%` }} 
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Accuracy</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Average Accuracy</span>
            <span className="font-semibold">{averageAccuracy}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full transition-all duration-500" 
              style={{ width: `${averageAccuracy}%` }} 
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Time</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tests Completed</span>
            <span className="font-semibold">{testsCompleted} / {totalTests}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-600 rounded-full transition-all duration-500" 
              style={{ width: `${(testsCompleted / totalTests) * 100}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;