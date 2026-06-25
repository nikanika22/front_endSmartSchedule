import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface Props {
  avoidDays: number[];
  onChange: (days: number[]) => void;
}

const DAYS_OF_WEEK = [
  { value: 2, label: 'T2' },
  { value: 3, label: 'T3' },
  { value: 4, label: 'T4' },
  { value: 5, label: 'T5' },
  { value: 6, label: 'T6' },
  { value: 7, label: 'T7' },
  { value: 8, label: 'CN' },
];

export const AvoidDaysSection: React.FC<Props> = ({ avoidDays, onChange }) => {
  
  const toggleDay = (dayValue: number) => {
    if (avoidDays.includes(dayValue)) {
      onChange(avoidDays.filter(d => d !== dayValue));
    } else {
      onChange([...avoidDays, dayValue]);
    }
  };

  return (
    <div className="mb-8 pt-7 border-t border-slate-100 dark:border-slate-800">
      {/* Section Header */}
      <div className="mb-3">
        <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] uppercase block mb-1">
          02 / NGÀY NGHỈ CỐ ĐỊNH
        </span>
        <h3 className="text-lg font-bold text-slate-850 dark:text-slate-100">Ngày nghỉ cố định</h3>
      </div>
      <Text className="text-slate-400 dark:text-slate-500 mb-6 block text-xs leading-relaxed">
        Chọn những ngày trong tuần bạn muốn hệ thống <span className="font-semibold text-rose-500 dark:text-rose-400">tuyệt đối không xếp lịch</span>.
      </Text>

      <div className="flex justify-between items-center max-w-sm mt-4">
        {DAYS_OF_WEEK.map(day => {
          const isSelected = avoidDays.includes(day.value);
          return (
            <button
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className={`
                w-10 h-10 rounded-full font-semibold text-xs transition-all duration-200 select-none active:scale-90 cursor-pointer flex items-center justify-center
                ${isSelected
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'}
              `}
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

