import React from 'react';

type BadgeVariant =
  | 'scheduled'
  | 'in-progress'
  | 'upcoming'
  | 'completed'
  | 'critical'
  | 'high'
  | 'medium'
  | 'good'
  | 'low'
  | 'on-visit'
  | 'travelling'
  | 'idle'
  | 'offline';

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string }> = {
  scheduled: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
  'in-progress': { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
  upcoming: { bg: 'rgba(139,92,246,0.15)', color: '#8B5CF6' },
  completed: { bg: 'rgba(124,255,79,0.15)', color: '#7CFF4F' },
  critical: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
  high: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
  medium: { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
  good: { bg: 'rgba(124,255,79,0.15)', color: '#7CFF4F' },
  low: { bg: 'rgba(124,255,79,0.15)', color: '#7CFF4F' },
  'on-visit': { bg: 'rgba(124,255,79,0.15)', color: '#7CFF4F' },
  travelling: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
  idle: { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
  offline: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, children, className = '' }) => {
  const style = variantStyles[variant];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide ${className}`}
      style={{ background: style.bg, color: style.color }}
    >
      {children}
    </span>
  );
};

export default React.memo(StatusBadge);
