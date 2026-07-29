export const FormFieldType = {
  Input: 'input',
  InputNumber: 'inputNumber',
  InputPassword: 'inputPassword',
} as const;

export type FormFieldTypeKey = (typeof FormFieldType)[keyof typeof FormFieldType];
