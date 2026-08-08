import { Button, Spin } from 'antd';
import EmptyCustom from '@/shared/components/empty/EmptyCustom';

interface ScheduleLoadingStateProps {
  isGenerating: boolean;
}

interface ScheduleErrorStateProps {
  error: string;
  onBackToCourses: () => void;
}

interface ScheduleEmptyStateProps {
  generationSucceeded: boolean;
  onBackToCourses: () => void;
  onOpenScheduleConfig: () => void;
}

export const ScheduleLoadingState = ({ isGenerating }: ScheduleLoadingStateProps) => (
  <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
    <Spin size="large" />
    <p className="text-gray-500 font-medium animate-pulse">
      {isGenerating
        ? 'Hệ thống đang chạy thuật toán tối ưu xếp lịch...'
        : 'Đang tải thông tin lịch học...'}
    </p>
  </div>
);

export const ScheduleErrorState = ({ error, onBackToCourses }: ScheduleErrorStateProps) => (
  <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
    <EmptyCustom title={error} />
    <Button onClick={onBackToCourses}>Quay lại Đăng ký môn</Button>
  </div>
);

export const ScheduleEmptyState = ({
  generationSucceeded,
  onBackToCourses,
  onOpenScheduleConfig,
}: ScheduleEmptyStateProps) => {
  if (!generationSucceeded) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
        <EmptyCustom title="Bạn chưa có thời khóa biểu. Hãy đăng ký môn học trước!" />
        <Button type="primary" onClick={onBackToCourses}>
          Đăng ký môn học
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-4 text-center px-4">
      <EmptyCustom title="Không tìm thấy phương án xếp lịch học nào phù hợp!" />
      <p className="text-gray-500 max-w-md text-sm -mt-2">
        Hệ thống không tìm thấy lịch học nào không bị trùng giờ. Hãy thử giảm bớt ngày bận,
        lịch cá nhân trong mục <strong>Cấu hình lịch học</strong> hoặc điều chỉnh môn đăng ký.
      </p>
      <div className="flex gap-3 mt-2">
        <Button onClick={onBackToCourses}>Đăng ký môn học</Button>
        <Button type="primary" onClick={onOpenScheduleConfig}>
          Cấu hình lịch học
        </Button>
      </div>
    </div>
  );
};
