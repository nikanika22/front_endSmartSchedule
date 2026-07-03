import type { ReactNode } from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
  breadcrumbs?: { title: ReactNode }[];
  icon?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, extra, breadcrumbs, icon }) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 dark:border-gray-800">
      <div>
        {breadcrumbs && (
          <Breadcrumb
            className="mb-2 text-xs text-gray-400"
            items={[{ title: <HomeOutlined /> }, ...breadcrumbs]}
          />
        )}
        
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {icon || <AppstoreOutlined className="text-xl" />}
          </div>
          
          <div className="flex flex-col justify-center">
            <h5 className="!m-0 text-[22px] font-semibold tracking-tight text-gray-800 dark:text-gray-100 leading-tight">
              {title}
            </h5>
            {subtitle && <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
        </div>
      </div>

      {extra && <div className="flex flex-shrink-0 items-center gap-3">{extra}</div>}
    </div>
  );
};

export default PageHeader;
