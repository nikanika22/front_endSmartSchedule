import CardCustom from '../card/CardCustom';
import TableCustom from './TableCustom';

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

interface TablePaginationCustomProps<T> {
  columns: any[];
  data: T[];
  loading: boolean;
  pagination: Pagination;
  onChangePage: (page: number, pageSize: number) => void;
  className?: string;
  rowSelection?: any;
  rowKey?: string | ((record: T) => string);
  rowClassName?: (record: T) => string;
}

const TablePaginationCustom = <T extends object>({
  columns,
  data,
  loading,
  pagination,
  onChangePage,
  className = '',
  rowSelection,
  rowKey,
  rowClassName,
}: TablePaginationCustomProps<T>) => {
  return (
    <CardCustom className="flex-1">
      <TableCustom<T>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowSelection={rowSelection}
        rowKey={rowKey}
        rowClassName={rowClassName}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            onChangePage(page, pageSize);
          },
        }}
        className={`py-2 ${className}`}
      />
    </CardCustom>
  );
};

export default TablePaginationCustom;
