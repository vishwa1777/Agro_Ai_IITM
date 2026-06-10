import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  label: string;
  value: string;
  subtext?: string;
  subtextColor?: string;
  progress?: number;
  showProgress?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  icon: Icon,
  iconColor = '#55D840',
  iconBgColor = 'rgba(85,216,64,0.1)',
  label,
  value,
  subtext,
  subtextColor = '#7CFF4F',
  progress,
  showProgress = false,
}) => {
  return (
    <div
      className="bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-2xl p-5 flex-1 min-w-[160px] card-glow hover:card-glow-hover transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: iconBgColor }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <span className="text-[13px] font-medium text-[#AAB8AA]">{label}</span>
      </div>
      <div className="text-[28px] font-bold text-white leading-tight tracking-tight">
        {value}
      </div>
      {subtext && (
        <div className="text-[12px] mt-1" style={{ color: subtextColor }}>
          {subtext}
        </div>
      )}
      {showProgress && progress !== undefined && (
        <div className="mt-3">
          <div className="h-[6px] bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background:
                  progress >= 70
                    ? 'linear-gradient(90deg, #55D840, #7CFF4F)'
                    : progress >= 40
                    ? 'linear-gradient(90deg, #F59E0B, #FFD700)'
                    : 'linear-gradient(90deg, #EF4444, #FF6B6B)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(KPICard);
