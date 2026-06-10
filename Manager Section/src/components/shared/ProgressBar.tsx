import React from 'react';

interface ProgressBarProps {
  value: number;
  height?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, height = 6, className = '' }) => {
  const getGradient = () => {
    if (value >= 70) return 'linear-gradient(90deg, #55D840, #7CFF4F)';
    if (value >= 40) return 'linear-gradient(90deg, #F59E0B, #FFD700)';
    return 'linear-gradient(90deg, #EF4444, #FF6B6B)';
  };

  return (
    <div
      className={`w-full bg-white/5 rounded-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${value}%`, background: getGradient() }}
      />
    </div>
  );
};

export default React.memo(ProgressBar);
