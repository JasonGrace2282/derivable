
import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

interface StopwatchProps {
  isRunning: boolean;
  className?: string;
}

export const Stopwatch = ({ isRunning, className = "" }: StopwatchProps) => {
  const [time, setTime] = useState(0);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className={`flex items-center gap-1 text-sm font-mono ${className}`}>
      <Timer className="h-4 w-4" />
      <span>{formattedTime}</span>
    </div>
  );
};
