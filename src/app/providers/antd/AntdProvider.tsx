import React from 'react';
import { App, ConfigProvider } from 'antd';

import viVN from 'antd/locale/vi_VN';
import EmptyCustom from '@/shared/components/empty/EmptyCustom';
import { AppColors } from '@/shared/theme/colors';
import { AppFontFamily } from '@/shared/theme/fonts';

type AntdProviderProps = {
  children: React.ReactNode;
};

/* https://ant.design/components/config-provider */
const AntdProvider: React.FC<AntdProviderProps> = ({ children }) => {
  return (
    <ConfigProvider
      // Cấu hình ngôn ngữ toàn bộ Ant Design (DatePicker, Pagination,...)
      locale={viVN}
      // Custom component hiển thị khi không có dữ liệu (Table, Select,...)
      renderEmpty={() => <EmptyCustom />}
      // Cấu hình theme toàn cục
      theme={{
        token: {
          // Màu chủ đạo của hệ thống (button, link, active,...)
          colorPrimary: AppColors.Primary,

          // Nền chung của Layout (trắng xám)
          colorBgLayout: AppColors.Background,

          // Font chữ dùng toàn bộ app
          fontFamily: AppFontFamily.Primary,
        },

        // Customize riêng từng component
        components: {
          Layout: {
            headerBg: AppColors.Secondary,
            siderBg: AppColors.Secondary,
          },

          Menu: {
            itemSelectedBg: AppColors.Primary,
            itemSelectedColor: '#fff',

            itemHoverBg: 'rgba(0,0,0,0.04)',

          },

          Button: {
            borderRadius: 8,
            controlHeight: 44,

            fontWeight: 500,
          },

          Input: {
            controlHeight: 40,

            borderRadius: 8,
          },
        },
      }}
    >
      <App
        // Config notification global
        // tránh spam quá nhiều thông báo cùng lúc
        notification={{ maxCount: 2 }}
      >
        {children}
      </App>
    </ConfigProvider>
  );
};

export default AntdProvider;
