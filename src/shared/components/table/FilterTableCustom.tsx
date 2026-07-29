import { Button, Col } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import RowCustom from '../row/RowCustom';
import InputCustom from '../input/InputCustom';
import CardCustom from '../card/CardCustom';

export interface DataFilter {
  name: string;
  placeholder?: string;
}

interface FilterTableCustomProps {
  dataFilters: DataFilter[];

  values: Record<string, any>;

  onChange: (values: Record<string, any>) => void;

  onReset?: () => void;

  onSubmit?: () => void;
}

const FilterTableCustom = ({
  dataFilters,
  values,
  onChange,
  onReset,
  onSubmit,
}: FilterTableCustomProps) => {
  const handleChange = (name: string, value: any) => {
    onChange({
      ...values,
      [name]: value,
    });
  };

  return (
    <CardCustom>
      <RowCustom>
        <div className="flex flex-col w-full gap-4">
          <div className="flex items-end justify-end">
            <Button onClick={onReset} className="h-10!">
              <ReloadOutlined />
            </Button>
          </div>

          <div className="flex w-full flex-wrap">
            {dataFilters.map((filter) => (
              <Col span={8} key={filter.name} className="mb-4">
                <InputCustom
                  placeholder={filter.placeholder}
                  value={values[filter.name]}
                  onChange={(e) => handleChange(filter.name, e.target.value)}
                />
              </Col>
            ))}
          </div>

          <div className="flex justify-center">
            <Button type="primary" size="large" onClick={onSubmit}>
              Tìm kiếm
            </Button>
          </div>
        </div>
      </RowCustom>
    </CardCustom>
  );
};

export default FilterTableCustom;
