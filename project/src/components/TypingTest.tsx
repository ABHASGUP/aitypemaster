import React, { useState, useEffect, useCallback } from 'react';
import Timer from './Timer';
import { RotateCcw, Trophy, Brain } from 'lucide-react';
import { useStats } from '../context/StatsContext';
import { useUser } from '../context/UserContext';
import UserForm from './UserForm';
import { DifficultySelector, difficulties, type Difficulty } from './DifficultySelector';
import { saveScore } from '../services/scores';
import { useNavigate } from 'react-router-dom';

// Sample texts for different difficulties
const texts = {
  beginner: [
    "The cat sat on the mat.",
    "I like to play in the park.",
    "She reads books every day."
  ],
  intermediate: [
    "The quick brown fox jumps over the lazy dog.",
    "Pack my box with five dozen liquor jugs.",
    "How vexingly quick daft zebras jump!"
  ],
  expert: [
    "The complexity of algorithms often depends on the size of the input dataset.",
    "In quantum mechanics, particles can exist in multiple states simultaneously.",
    "The synthesis of artificial intelligence and human cognition presents unique challenges."
  ]
};

const durationOptions = [30, 60, 90, 120, 150, 180];

function TypingTest() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const { updateStats } = useStats();
  const [showUserForm, setShowUserForm] = useState(!userData);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(difficulties[0]);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({ wpm: 0, accuracy: 0 });

  // Generate text based on difficulty
  const generateText = useCallback(() => {
    const difficultyTexts = texts[selectedDifficulty.id as keyof typeof texts];
    const randomIndex = Math.floor(Math.random() * difficultyTexts.length);
    setCurrentText(difficultyTexts[randomIndex]);
  }, [selectedDifficulty]);

  // Calculate real-time statistics
  const calculateStats = useCallback(() => {
    if (!isActive || !userInput) return;

    const words = userInput.trim().split(/\s+/).length;
    const timeSpent = selectedDuration - timeLeft;
    const wpm = Math.round((words / timeSpent) * 60);

    const accuracy = Math.round(
      (userInput.split('').reduce((acc, char, i) => {
        return acc + (char === currentText[i] ? 1 : 0);
      }, 0) / userInput.length) * 100
    );

    setRealTimeStats({ wpm, accuracy });
  }, [userInput, currentText, timeLeft, selectedDuration, isActive]);

  const handleTestComplete = useCallback(async () => {
    if (!userData || !isActive) return;
    
    updateStats(realTimeStats.wpm, realTimeStats.accuracy);
    
    const score = {
      name: userData.name,
      email: userData.email,
      wpm: realTimeStats.wpm,
      accuracy: realTimeStats.accuracy,
      difficulty: selectedDifficulty.name,
      duration: selectedDuration,
      timestamp: Date.now(),
    };

    try {
      await saveScore(score);
      navigate('/scores');
    } catch (error) {
      console.error('Error saving score:', error);
    }
  }, [userData, isActive, realTimeStats, selectedDifficulty, selectedDuration, navigate, updateStats]);

  // Start test
  const startTest = () => {
    generateText();
    setUserInput('');
    setTimeLeft(selectedDuration);
    setIsActive(true);
    setRealTimeStats({ wpm: 0, accuracy: 0 });
  };

  // Reset test
  const resetTest = () => {
    setIsActive(false);
    setUserInput('');
    setTimeLeft(selectedDuration);
    generateText();
  };

  useEffect(() => {
    generateText();
  }, [generateText]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            handleTestComplete();
            return 0;
          }
          return time - 1;
        });
        calculateStats();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, calculateStats, handleTestComplete]);

  if (showUserForm) {
    return <UserForm onComplete={() => setShowUserForm(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Timer timeLeft={timeLeft} isActive={isActive} />
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-700">{realTimeStats.wpm} WPM</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-green-500" />
            <span className="text-gray-700">{realTimeStats.accuracy}% Accuracy</span>
          </div>
        </div>
        <button
          onClick={resetTest}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {!isActive && (
        <>
          <DifficultySelector
            selectedDifficulty={selectedDifficulty.id}
            onSelect={setSelectedDifficulty}
          />
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Duration</h3>
            <div className="flex gap-4">
              {durationOptions.map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedDuration === duration
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-indigo-50'
                  }`}
                >
                  {duration}s
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="mb-4 font-mono text-lg leading-relaxed">
          {currentText.split('').map((char, index) => {
            let color = 'text-gray-400';
            if (index < userInput.length) {
              color = userInput[index] === char ? 'text-green-600' : 'text-red-500';
            }
            return (
              <span key={index} className={color}>
                {char}
              </span>
            );
          })}
        </div>

        <textarea
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
            if (!isActive && e.target.value.length === 1) {
              startTest();
            }
          }}
          placeholder={isActive ? "Start typing..." : "Click here and start typing when ready..."}
          disabled={timeLeft === 0}
        />
      </div>
    </div>
  );
}

export default TypingTest;