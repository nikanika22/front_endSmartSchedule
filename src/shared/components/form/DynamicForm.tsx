import { Col, Form,DatePicker } from 'antd';
import { type FormModalModeType } from '@/shared/types/form-modal-mode-type';
import RowCustom from '../row/RowCustom';
import InputCustom from '../input/InputCustom';
import InputNumberCustom from '../input/InputNumberCustom';
import InputPasswordCustom from '../input/InputPasswordCustom';
import { FormFieldType } from '@/shared/types/form-field-type';
import type { FormField } from '../modal/ModalFormCustom';


interface DynamicFormProps<T> {
  fields: FormField<T>[];
  disabled?: boolean;
  mode?: FormModalModeType;
}

const DynamicForm = <T,>({ fields, disabled, mode }: DynamicFormProps<T>) => {
  return (
    <RowCustom>
      {fields.map((field) => (
          <Col key={field.name as string} span={field.col || 12}>
            <Form.Item name={field.name as string} label={field.label} rules={field.rules}>
              {(() => {
                const isDisabled =
                  typeof field.disabled === 'function'
                    ? field.disabled({ mode })
                    : field.disabled;

                switch (field.type) {
                  case FormFieldType.Input:
                    return (
                      <InputCustom
                        placeholder={field.placeholder}
                        disabled={isDisabled || disabled}
                        prefix={field.icon ? <field.icon /> : null}
                      />
                    );
                  case FormFieldType.InputPassword:
                    return (
                      <InputPasswordCustom
                        placeholder={field.placeholder}
                        disabled={isDisabled || disabled}
                        prefix={field.icon ? <field.icon /> : null}
                      />
                    );
                  case FormFieldType.InputNumber:
                    return (
                      <InputNumberCustom
                        placeholder={field.placeholder}
                        disabled={isDisabled || disabled}
                      />
                    );
                  case FormFieldType.DatePicker:
                    return (
                      <DatePicker
                        className="w-full"
                        placeholder={field.placeholder || "Chọn ngày..."}
                        disabled={isDisabled || disabled}
                        format="YYYY-MM-DD"
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </Form.Item>
          </Col>
        ))}
    </RowCustom>
  );
};

export default DynamicForm;
