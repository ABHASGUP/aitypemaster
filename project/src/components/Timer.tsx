import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  isActive: boolean;
}

function Timer({ timeLeft, isActive }: TimerProps) {
  return (
    <div className="flex items-center gap-2">
      <TimerIcon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-indigo-600'}`} />
      <span className="text-gray-700">{timeLeft}s</span>
    </div>
  );
}

export default Timer;