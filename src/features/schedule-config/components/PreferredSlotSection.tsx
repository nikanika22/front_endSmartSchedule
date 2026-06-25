import React from 'react';
import { Typography } from 'antd';
import type { PreferredSlot } from '../types';

const { Text } = Typography;

interface Props {
  selectedSlot: PreferredSlot | null;
  onSelect: (slot: PreferredSlot) => void;
}

const SESSIONS = [
  { 
    id: 'MORNING' as PreferredSlot, 
    label: 'Ca Sáng', 
    time: '07:00 - 12:00',
    description: 'Ưu tiên sắp xếp lịch biểu vào các khung giờ học buổi sáng.',
  },
  { 
    id: 'AFTERNOON' as PreferredSlot, 
    label: 'Ca Chiều', 
    time: '12:30 - 17:30',
    description: 'Ưu tiên sắp xếp lịch biểu vào các khung giờ học buổi chiều.',
  },
  { 
    id: 'EVENING' as PreferredSlot, 
    label: 'Ca Tối', 
    time: '18:00 - 22:00',
    description: 'Ưu tiên sắp xếp lịch biểu vào các khung giờ học buổi tối.',
  },
];

export const PreferredSlotSection: React.FC<Props> = ({ selectedSlot, onSelect }) => {
  return (
    <div className="mb-10">
      {/* Section Header */}
      <div className="mb-4">
        <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase block mb-1">
          01 / BUỔI HỌC ƯU TIÊN
        </span>
        <h3 className="text-xl font-bold text-slate-850 dark:text-slate-100">Buổi học mong muốn</h3>
      </div>
      <Text className="text-slate-400 dark:text-slate-500 mb-6 block text-xs leading-relaxed">
        Chọn 1 buổi học trong ngày mà bạn mong muốn hệ thống ưu tiên sắp xếp lịch biểu trước.
      </Text>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 border-t border-b border-slate-100 dark:border-slate-800/60">
        {SESSIONS.map((session) => {
          const isActive = selectedSlot === session.id;
          return (
            <div
              key={session.id}
              onClick={() => onSelect(session.id)}
              className="group cursor-pointer py-4.5 flex items-center justify-between transition-all select-none active:opacity-75"
            >
              <div className="flex flex-col gap-0.5">
                <span className={`text-sm font-semibold transition-colors duration-200 ${isActive ? 'text-[var(--accent)]' : 'text-slate-800 dark:text-slate-200 group-hover:text-[var(--accent)]'}`}>
                  {session.label}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {session.description}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className={`text-[11px] font-mono transition-colors ${isActive ? 'text-[var(--accent)] font-semibold' : 'text-slate-400 dark:text-slate-550'}`}>
                  {session.time}
                </span>
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isActive ? 'bg-[var(--accent)] scale-110' : 'bg-transparent border border-slate-300 dark:border-slate-700'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

