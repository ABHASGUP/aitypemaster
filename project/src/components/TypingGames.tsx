import React, { useState, useEffect } from 'react';
import { Trophy, Target, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

interface Game {
  id: string;
  name: string;
  description: string;
  text: string;
  timeLimit: number;
}

const games: Game[] = [
  {
    id: 'wordRace',
    name: 'Word Race',
    description: 'Type as many words as you can before time runs out!',
    text: 'The quick brown fox jumps over the lazy dog',
    timeLimit: 30
  },
  {
    id: 'sentenceChallenge',
    name: 'Sentence Challenge',
    description: 'Master complete sentences with proper punctuation',
    text: 'Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!',
    timeLimit: 45
  },
  {
    id: 'codingPractice',
    name: 'Coding Practice',
    description: 'Practice typing common programming syntax',
    text: 'function calculateSum(a, b) { return a + b; }',
    timeLimit: 60
  }
];

function TypingGames() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameActive]);

  const startGame = (game: Game) => {
    setSelectedGame(game);
    setUserInput('');
    setScore(0);
    setTimeLeft(game.timeLimit);
    setGameActive(true);
  };

  const calculateScore = (input: string, target: string) => {
    const words = input.trim().split(/\s+/).length;
    const accuracy = [...input].reduce((acc, char, i) => {
      return acc + (char === target[i] ? 1 : 0);
    }, 0) / input.length;
    return Math.round(words * accuracy * 10);
  };

  const endGame = async () => {
    setGameActive(false);
    if (!selectedGame) return;
    
    const finalScore = calculateScore(userInput, selectedGame.text);
    setScore(finalScore);

    if (user && profile && finalScore > profile.highScore) {
      await updateDoc(doc(db, 'users', user.uid), {
        highScore: finalScore
      });
    }
  };

  return (
    <div className="space-y-6">
      {!selectedGame ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => startGame(game)}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">{game.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{game.description}</p>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{game.timeLimit}s</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{selectedGame.name}</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>{score} pts</span>
              </div>
            </div>
          </div>

          <div className="relative mb-4">
            <div className="font-mono text-lg leading-relaxed p-4 bg-gray-50 rounded-lg text-gray-400 whitespace-pre-wrap">
              {selectedGame.text.split('').map((char, index) => {
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
              className="absolute inset-0 w-full h-full opacity-0 cursor-default resize-none"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={!gameActive}
              autoFocus
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setSelectedGame(null)}
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              ← Back to Games
            </button>
            <button
              onClick={() => startGame(selectedGame)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {gameActive ? 'Restart' : 'Start Game'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TypingGames;