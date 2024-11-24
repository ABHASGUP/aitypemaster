import React from 'react';
import { Settings } from 'lucide-react';

export interface Difficulty {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  timeLimit: number;
  complexity: number; // 1-5 scale for word complexity
}

const difficulties: Difficulty[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Simple words, plenty of time',
    wordCount: 20,
    timeLimit: 60,
    complexity: 1
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'Mixed vocabulary, moderate pace',
    wordCount: 30,
    timeLimit: 60,
    complexity: 3
  },
  {
    id: 'expert',
    name: 'Expert',
    description: 'Complex words, challenging pace',
    wordCount: 40,
    timeLimit: 60,
    complexity: 5
  }
];

interface DifficultySelectorProps {
  selectedDifficulty: string;
  onSelect: (difficulty: Difficulty) => void;
}

function DifficultySelector({ selectedDifficulty, onSelect }: DifficultySelectorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Select Difficulty</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.id}
            onClick={() => onSelect(difficulty)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedDifficulty === difficulty.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <h4 className="font-semibold text-gray-900">{difficulty.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{difficulty.description}</p>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-4 rounded-full ${
                    i < difficulty.complexity ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export { difficulties, DifficultySelector };