import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CardHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
  rightElement?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ title, actionText, onAction, rightElement }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[16px] font-semibold text-white">{title}</h3>
      {rightElement}
      {actionText && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-[13px] font-medium text-[#55D840] hover:text-[#7CFF4F] transition-colors"
        >
          {actionText}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

export default React.memo(CardHeader);
