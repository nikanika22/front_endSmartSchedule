import { theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import ConfirmedScheduleView from '../components/ConfirmedScheduleView';
import {
  ScheduleEmptyState,
  ScheduleErrorState,
  ScheduleLoadingState,
} from '../components/SchedulePageFeedback';
import ScheduleSolutionsView from '../components/ScheduleSolutionsView';
import { useSchedulePage } from '../hooks/useSchedulePage';

const SchedulePage = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const page = useSchedulePage();

  if (page.isLoading) {
    return <ScheduleLoadingState isGenerating={page.generateStatus === 'loading'} />;
  }

  if (page.error && !page.confirmedSchedule && page.solutions.length === 0) {
    return (
      <ScheduleErrorState error={page.error} onBackToCourses={() => navigate('/courses')} />
    );
  }

  if (page.confirmedSchedule && page.solutions.length === 0) {
    return (
      <ConfirmedScheduleView
        classes={page.confirmedClasses}
        personalEvents={page.personalEvents}
        primaryColor={token.colorPrimary}
        calendarModal={page.calendarModal}
        setCalendarModal={page.setCalendarModal}
        onSelectSlot={page.handleSelectSlot}
        onEventClick={page.handleEventClick}
        onSavePersonalEvent={page.handleSavePersonalEvent}
        onDeletePersonalEvent={page.handleDeletePersonalEvent}
        onCloseModal={page.closeCalendarModal}
      />
    );
  }

  if (!page.activeSolution) {
    return (
      <ScheduleEmptyState
        generationSucceeded={page.generateStatus === 'succeeded'}
        onBackToCourses={() => navigate('/courses')}
        onOpenScheduleConfig={() => navigate('/schedule-config')}
      />
    );
  }

  return (
    <ScheduleSolutionsView
      solutions={page.solutions}
      activeSolution={page.activeSolution}
      activeTabKey={page.activeTabKey}
      isConfirming={page.isConfirming}
      personalEvents={page.personalEvents}
      primaryColor={token.colorPrimary}
      onChangeSolution={page.handleChangeSolution}
      onCancel={page.handleCancelSolutions}
      onConfirm={page.handleConfirm}
    />
  );
};

export default SchedulePage;
