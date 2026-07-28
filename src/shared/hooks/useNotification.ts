import { App } from 'antd';

export const useNotification = () => {
  const { notification } = App.useApp();

  const showNotification = (
    type: 'success' | 'error' | 'warning',
    title: string,
    description?: string,
  ) => {
    notification[type]({
      title,
      description,
    });
  };

  return {
    showNotification,
  };
};
