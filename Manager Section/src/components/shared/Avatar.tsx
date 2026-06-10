import React from 'react';

interface AvatarProps {
  initials: string;
  color?: string;
  size?: number;
  border?: boolean;
  borderColor?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  initials,
  color = '#55D840',
  size = 32,
  border = false,
  borderColor = '#0F1D14',
  className = '',
}) => {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.4,
        border: border ? `2px solid ${borderColor}` : 'none',
      }}
    >
      {initials}
    </div>
  );
};

export default React.memo(Avatar);
