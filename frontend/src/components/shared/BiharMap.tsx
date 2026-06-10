import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { MapPin, RepStatus } from '@/types';

interface BiharMapProps {
  pins: MapPin[];
  height?: number;
  showControls?: boolean;
}

const statusColors: Record<RepStatus, string> = {
  'on-visit': '#7CFF4F',
  travelling: '#3B82F6',
  idle: '#F59E0B',
  offline: '#EF4444',
};

const statusGlow: Record<RepStatus, string> = {
  'on-visit': '0 0 8px rgba(124,255,79,0.4)',
  travelling: '0 0 8px rgba(59,130,246,0.4)',
  idle: '0 0 8px rgba(245,158,11,0.4)',
  offline: '0 0 8px rgba(239,68,68,0.4)',
};

const BiharMap: React.FC<BiharMapProps> = ({ pins, height = 280, showControls = true }) => {
  const [zoom, setZoom] = useState(1);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  // Simplified Bihar SVG outline path
  const biharPath =
    'M50,20 L55,18 L60,15 L65,16 L70,14 L75,15 L80,13 L85,15 L90,14 L95,16 L100,15 L105,17 L110,16 L115,18 L120,20 L125,22 L130,25 L135,28 L140,30 L138,35 L140,40 L138,45 L140,50 L138,55 L135,60 L130,65 L125,68 L120,70 L115,72 L110,75 L105,78 L100,80 L95,82 L90,85 L85,88 L80,90 L75,88 L70,90 L65,88 L60,85 L55,82 L50,80 L45,78 L40,75 L35,72 L30,70 L28,65 L25,60 L22,55 L20,50 L22,45 L20,40 L22,35 L25,30 L28,25 L30,20 L35,18 L40,16 L45,18 Z';

  // Territory positions (approximate within the Bihar outline)
  const territoryPaths = [
    { name: 'Patna', x: 52, y: 55 },
    { name: 'Gaya', x: 45, y: 65 },
    { name: 'Muzaffarpur', x: 60, y: 40 },
    { name: 'Darbhanga', x: 70, y: 35 },
    { name: 'Bhagalpur', x: 80, y: 50 },
    { name: 'Purnea', x: 85, y: 30 },
  ];

  return (
    <div
      className="relative w-full bg-[#0B1710] rounded-2xl overflow-hidden border border-[rgba(120,255,120,0.08)]"
      style={{ height }}
    >
      <svg
        viewBox="0 0 160 100"
        className="w-full h-full"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}
      >
        {/* Grid lines */}
        {[20, 40, 60, 80, 100, 120, 140].map((x) => (
          <line key={`gx${x}`} x1={x} y1="10" x2={x} y2="95" stroke="rgba(120,255,120,0.03)" strokeWidth="0.3" />
        ))}
        {[20, 30, 40, 50, 60, 70, 80, 90].map((y) => (
          <line key={`gy${y}`} x1="20" y1={y} x2="145" y2={y} stroke="rgba(120,255,120,0.03)" strokeWidth="0.3" />
        ))}

        {/* Bihar outline */}
        <path
          d={biharPath}
          fill="rgba(85,216,64,0.05)"
          stroke="rgba(85,216,64,0.2)"
          strokeWidth="0.5"
          transform="scale(0.85) translate(15, 8)"
        />

        {/* Territory labels */}
        {territoryPaths.map((t) => (
          <text
            key={t.name}
            x={t.x}
            y={t.y}
            fill="rgba(170,184,170,0.3)"
            fontSize="3"
            textAnchor="middle"
          >
            {t.name}
          </text>
        ))}

        {/* Map pins */}
        {pins.map((pin) => (
          <g
            key={pin.id}
            transform={`translate(${pin.x - 3}, ${pin.y - 3})`}
            onMouseEnter={() => setHoveredPin(pin.id)}
            onMouseLeave={() => setHoveredPin(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Pulse animation for online */}
            {pin.status === 'on-visit' && (
              <circle
                cx="3"
                cy="3"
                r="5"
                fill="none"
                stroke={statusColors[pin.status]}
                strokeWidth="0.5"
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="4"
                  to="8"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            {/* Pin circle */}
            <circle
              cx="3"
              cy="3"
              r="4"
              fill={pin.avatarColor}
              stroke={statusColors[pin.status]}
              strokeWidth="1"
              style={{
                filter: `drop-shadow(${statusGlow[pin.status]})`,
                transform: hoveredPin === pin.id ? 'scale(1.3)' : 'scale(1)',
                transformOrigin: 'center',
                transition: 'transform 0.2s ease',
              }}
            />
            {/* Initials */}
            <text
              x="3"
              y="4"
              fill="white"
              fontSize="2.5"
              fontWeight="bold"
              textAnchor="middle"
            >
              {pin.initials}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredPin && (
        <div className="absolute bg-[#0F1D14] border border-[rgba(120,255,120,0.12)] rounded-lg px-3 py-2 pointer-events-none z-10"
          style={{
            left: `${(pins.find(p => p.id === hoveredPin)?.x ?? 0)}%`,
            top: `${(pins.find(p => p.id === hoveredPin)?.y ?? 0) - 15}%`,
            transform: 'translate(-50%, -100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div className="text-[12px] font-semibold text-white">
            {pins.find(p => p.id === hoveredPin)?.name}
          </div>
          <div className="text-[10px] text-[#AAB8AA] capitalize">
            {pins.find(p => p.id === hoveredPin)?.status?.replace('-', ' ')}
          </div>
        </div>
      )}

      {/* Zoom controls */}
      {showControls && (
        <div className="absolute bottom-3 right-3 flex flex-col gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
            className="w-8 h-8 bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-lg flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors"
          >
            <Plus size={14} className="text-[#AAB8AA]" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
            className="w-8 h-8 bg-[#0F1D14] border border-[rgba(120,255,120,0.08)] rounded-lg flex items-center justify-center hover:bg-[rgba(85,216,64,0.08)] transition-colors"
          >
            <Minus size={14} className="text-[#AAB8AA]" />
          </button>
        </div>
      )}

      {/* Center label */}
      <div className="absolute top-3 left-3 text-[10px] font-medium text-[#AAB8AA] uppercase tracking-wider">
        Bihar
      </div>
    </div>
  );
};

export default React.memo(BiharMap);
