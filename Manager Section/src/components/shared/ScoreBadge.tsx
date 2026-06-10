import React from 'react';

interface ScoreBadgeProps {
  score: number;
  maxScore?: number;
  size?: number;
  showMax?: boolean;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, maxScore = 100, size = 28, showMax = false }) => {
  const getColor = () => {
    if (score >= 90) return '#7CFF4F';
    if (score >= 80) return '#55D840';
    if (score >= 70) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white"
      style={{
        width: size,
        height: size,
        background: getColor(),
        fontSize: size < 32 ? 11 : 13,
      }}
    >
      {showMax ? `${score}/${maxScore}` : score}
    </div>
  );
};

export default React.memo(ScoreBadge);
