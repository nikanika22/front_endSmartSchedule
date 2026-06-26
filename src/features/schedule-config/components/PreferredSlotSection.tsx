import React from 'react';
import { Typography, theme } from 'antd';
import { SunOutlined, CoffeeOutlined, MoonOutlined } from '@ant-design/icons';
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
    time: '07:00 - 12:05',
    description: 'Học buổi sáng (Ca 1 & Ca 2), phù hợp để tập trung.',
    icon: <SunOutlined className="text-2xl text-amber-500" />,
  },
  { 
    id: 'AFTERNOON' as PreferredSlot, 
    label: 'Ca Chiều', 
    time: '12:35 - 17:40',
    description: 'Học buổi chiều (Ca 3 & Ca 4), thoải mái thời gian.',
    icon: <CoffeeOutlined className="text-2xl text-orange-500" />,
  },
  { 
    id: 'EVENING' as PreferredSlot, 
    label: 'Ca Tối', 
    time: '18:00 - 22:00',
    description: 'Học buổi tối, phù hợp với người đi làm thêm.',
    icon: <MoonOutlined className="text-2xl text-indigo-500" />,
  },
];

export const PreferredSlotSection: React.FC<Props> = ({ selectedSlot, onSelect }) => {
  const { token } = theme.useToken();

  return (
    <div className="mb-10">
      {/* Section Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-850 dark:text-slate-100">Buổi học mong muốn</h3>
      </div>
      <Text className="text-slate-400 dark:text-slate-555 mb-6 block text-xs leading-relaxed">
        Chọn 1 buổi học trong ngày mà bạn mong muốn hệ thống ưu tiên xếp lịch biểu lên hàng đầu.
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {SESSIONS.map((session) => {
          const isActive = selectedSlot === session.id;
          return (
            <div
              key={session.id}
              onClick={() => onSelect(session.id)}
              className="relative overflow-hidden cursor-pointer rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all duration-300 select-none active:scale-[0.98] shadow-sm"
              style={
                isActive 
                  ? {
                      borderColor: token.colorPrimary,
                      backgroundColor: token.colorPrimaryBg,
                      color: token.colorPrimary,
                      borderWidth: '2px'
                    } 
                  : {
                      borderColor: token.colorBorderSecondary,
                      backgroundColor: token.colorBgContainer,
                      color: token.colorText
                    }
              }
            >
              <div className="flex justify-between items-start">
                <div 
                  className="p-2.5 rounded-xl transition-colors"
                  style={{
                    backgroundColor: isActive ? token.colorBgContainer : token.colorBgLayout,
                    boxShadow: isActive ? token.boxShadowSecondary : 'none'
                  }}
                >
                  {session.icon}
                </div>
                <div 
                  className="w-5 h-5 rounded-full border flex items-center justify-center transition-all"
                  style={{
                    borderColor: isActive ? token.colorPrimary : token.colorBorderSecondary,
                    backgroundColor: isActive ? token.colorPrimary : 'transparent'
                  }}
                >
                  {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{session.label}</h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-555 leading-normal">{session.description}</p>
              </div>

              <div 
                className="pt-3 border-t flex items-center justify-between"
                style={{ borderColor: token.colorBorderSecondary }}
              >
                <span className="text-[10px] text-slate-400 dark:text-slate-555 font-medium">Khung giờ</span>
                <span 
                  className="text-xs font-mono font-semibold"
                  style={{ color: isActive ? token.colorPrimary : token.colorTextSecondary }}
                >
                  {session.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
