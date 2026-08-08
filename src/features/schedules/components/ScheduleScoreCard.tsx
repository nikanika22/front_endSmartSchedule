import { Progress } from 'antd';
import CardCustom from '@/shared/components/card/CardCustom';
import type { ScheduleSolution } from '../types/schedule-types';

interface ScoreBarProps {
  label: string;
  value: number | string;
  color: string;
}

interface ScheduleScoreCardProps {
  solution: ScheduleSolution;
  primaryColor: string;
}

const ScoreBar = ({ label, value, color }: ScoreBarProps) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="font-bold" style={{ color }}>
        {typeof value === 'number' ? `${Math.round(value * 100)}%` : value}
      </span>
    </div>
    {typeof value === 'number' ? (
      <Progress
        percent={Math.round(value * 100)}
        strokeColor={color}
        showInfo={false}
        strokeWidth={7}
      />
    ) : null}
  </div>
);

const ScheduleScoreCard = ({ solution, primaryColor }: ScheduleScoreCardProps) => (
  <CardCustom title="Điểm tối ưu phương án">
    <ScoreBar label="Tổng hợp" value={solution.score_total} color={primaryColor} />
    <ScoreBar label="Sở thích buổi học" value={solution.score_pref} color="#0d9488" />
    <ScoreBar label="Giờ nghỉ giải lao" value={solution.score_break} color="#d97706" />
    <ScoreBar label="Cân bằng lịch học" value={solution.score_balance} color="#e11d48" />
    <ScoreBar label="Thuật toán" value={solution.algorithm_tag ?? 'N/A'} color="#3b82f6" />
    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100">
      <p className="font-semibold text-gray-700 mb-1">💡 Mẹo nhỏ:</p>
      Hệ thống đã so sánh với lịch cá nhân và sở thích của bạn để tìm lịch học phù hợp nhất.
    </div>
  </CardCustom>
);

export default ScheduleScoreCard;
