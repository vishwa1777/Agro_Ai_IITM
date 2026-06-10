import React from 'react';
import StatusBadge from './StatusBadge';
import type { ScheduleStatus } from '@/types';

interface TimelineItemProps {
  time: string;
  representative: string;
  location: string;
  status: ScheduleStatus;
  isLast?: boolean;
}

const statusColors: Record<ScheduleStatus, string> = {
  scheduled: '#3B82F6',
  'in-progress': '#7CFF4F',
  upcoming: '#F59E0B',
};

const TimelineItem: React.FC<TimelineItemProps> = ({
  time,
  representative,
  location,
  status,
  isLast = false,
}) => {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className="text-[12px] text-[#AAB8AA] w-14 text-right">{time}</span>
        <div className="flex-1 flex items-start justify-center mt-1">
          <div
            className="w-2 h-2 rounded-full mt-1.5"
            style={{ background: statusColors[status] }}
          />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-[rgba(120,255,120,0.08)] mt-1" />
        )}
      </div>
      <div className="flex-1 pb-4">
        <div className="text-[13px] font-semibold text-white">{representative}</div>
        <div className="text-[12px] text-[#AAB8AA] mt-0.5">{location}</div>
        <div className="mt-1.5">
          <StatusBadge variant={status}>
            {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
          </StatusBadge>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TimelineItem);
