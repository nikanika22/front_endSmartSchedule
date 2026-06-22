import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;

  subtitle?: string;

  extra?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, extra }) => {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{title}</h1>

        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>

      {extra && <div>{extra}</div>}
    </div>
  );
};

export default PageHeader;
