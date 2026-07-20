import React from 'react';
import { Typography, theme } from 'antd';

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
  const { token } = theme.useToken();
  
  const toggleDay = (dayValue: number) => {
    if (avoidDays.includes(dayValue)) {
      onChange(avoidDays.filter(d => d !== dayValue));
    } else {
      onChange([...avoidDays, dayValue]);
    }
  };

  return (
    <div className="mb-8 pt-7 border-t border-slate-100">
      {/* Section Header */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-slate-850">Ngày nghỉ cố định</h3>
      </div>
      <Text className="text-slate-400 mb-6 block text-xs leading-relaxed">
        Chọn những ngày trong tuần bạn muốn hệ thống <span className="font-semibold text-rose-500">tuyệt đối không xếp lịch học</span>.
      </Text>

      <div className="grid grid-cols-7 gap-2 max-w-xl mt-4">
        {DAYS_OF_WEEK.map(day => {
          const isSelected = avoidDays.includes(day.value);
          const isWeekend = day.value === 7 || day.value === 8;
          return (
            <div
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className="relative cursor-pointer h-14 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 select-none active:scale-95 shadow-sm"
              style={
                isSelected
                  ? {
                      borderColor: token.colorPrimary,
                      backgroundColor: token.colorPrimaryBg,
                      color: token.colorPrimary,
                      fontWeight: 'bold',
                      borderWidth: '2px',
                    }
                  : {
                      borderColor: token.colorBorderSecondary,
                      backgroundColor: token.colorBgContainer,
                      color: token.colorText,
                    }
              }
            >
              <span className="text-[10px] font-medium opacity-60 mb-0.5">
                {day.value === 8 ? 'Chủ nhật' : `Thứ ${day.value}`}
              </span>
              <span className="text-sm font-bold">{day.label}</span>
              {isWeekend && !isSelected && (
                <div className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-slate-450" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
