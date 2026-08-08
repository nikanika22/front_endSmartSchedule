import { Badge, Button, Col, Tabs } from 'antd';
import CardCustom from '@/shared/components/card/CardCustom';
import PageHeader from '@/shared/components/page/PageHeader';
import RowCustom from '@/shared/components/row/RowCustom';
import type { PersonalEvent, ScheduleSolution } from '../types/schedule-types';
import ScheduleCalendar from './ScheduleCalendar';
import ScheduleScoreCard from './ScheduleScoreCard';

interface ScheduleSolutionsViewProps {
  solutions: ScheduleSolution[];
  activeSolution: ScheduleSolution;
  activeTabKey: string;
  isConfirming: boolean;
  personalEvents: PersonalEvent[];
  primaryColor: string;
  onChangeSolution: (key: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const ScheduleSolutionsView = ({
  solutions,
  activeSolution,
  activeTabKey,
  isConfirming,
  personalEvents,
  primaryColor,
  onChangeSolution,
  onCancel,
  onConfirm,
}: ScheduleSolutionsViewProps) => (
  <div className="flex flex-col gap-6">
    <PageHeader
      title="Đề xuất Thời khóa biểu"
      subtitle={`${solutions.length} phương án tối ưu được đề xuất cho bạn`}
      extra={
        <div className="flex gap-3">
          <Button danger onClick={onCancel}>
            Hủy đề xuất
          </Button>
          <Button
            type="primary"
            size="large"
            loading={isConfirming}
            onClick={onConfirm}
          >
            Xác nhận chọn Lịch này
          </Button>
        </div>
      }
    />

    <RowCustom>
      <Col xs={24} lg={6}>
        <ScheduleScoreCard solution={activeSolution} primaryColor={primaryColor} />
      </Col>

      <Col xs={24} lg={18}>
        <CardCustom>
          <Tabs
            activeKey={activeTabKey}
            onChange={onChangeSolution}
            type="card"
            items={solutions.map((solution, index) => ({
              key: index.toString(),
              label: (
                <span className="px-1 font-semibold">
                  Phương án {index + 1}
                  <Badge
                    count={`${Math.round(solution.score_total * 100)}%`}
                    className="ml-2"
                    style={{
                      backgroundColor:
                        index === Number(activeTabKey) ? primaryColor : '#94a3b8',
                      fontSize: '10px',
                    }}
                  />
                </span>
              ),
            }))}
          />

          <div className="mt-3">
            <ScheduleCalendar
              classes={activeSolution.classes}
              personalEvents={personalEvents}
              primaryColor={primaryColor}
            />
          </div>
        </CardCustom>
      </Col>
    </RowCustom>
  </div>
);

export default ScheduleSolutionsView;
