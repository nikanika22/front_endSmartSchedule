import type { RuleObject } from 'antd/es/form';
import dayjs from 'dayjs';

//  Rule: Mã học kỳ  (semester_id)
//  Định dạng hợp lệ: HK1-2025 | HK2-2025 | HK3-2025

export const semesterIdRules: RuleObject[] = [
  {
    required: true,
    message: 'Vui lòng nhập mã học kỳ',
  },
  {
    validator(_, value) {
      if (!value) return Promise.resolve();

      // Bắt buộc đúng format: HK[1/2/3]-YYYY
      const regex = /^HK[1-3]-\d{4}$/;
      if (!regex.test(value)) {
        return Promise.reject(
          new Error('Mã học kỳ phải có định dạng HK1-2025, HK2-2025 hoặc HK3-2025'),
        );
      }

      // Năm phải nằm trong khoảng ±5 năm so với hiện tại
      const year = parseInt(value.split('-')[1], 10);
      const currentYear = new Date().getFullYear();
      if (year < currentYear - 5 || year > currentYear + 5) {
        return Promise.reject(
          new Error(
            `Năm trong mã học kỳ phải từ ${currentYear - 5} đến ${currentYear + 5}`,
          ),
        );
      }

      return Promise.resolve();
    },
  },
];


//  Rule: Tên học kỳ  (name)
//  Định dạng hợp lệ: Học kỳ 1 (2024-2025)

export const semesterNameRules: RuleObject[] = [
  {
    required: true,
    message: 'Vui lòng nhập tên học kỳ',
  },
  {
    validator(_, value) {
      if (!value) return Promise.resolve();

      // Kiểm tra format: Học kỳ [1/2/3] (YYYY-YYYY)
      const regex = /^Học kỳ [1-3] \(\d{4}-\d{4}\)$/i;
      if (!regex.test(value)) {
        return Promise.reject(
          new Error('Tên học kỳ phải có định dạng "Học kỳ 1 (2024-2025)"'),
        );
      }

      // Kiểm tra năm kết thúc phải bằng năm bắt đầu + 1
      const match = value.match(/\((\d{4})-(\d{4})\)/);
      if (match) {
        const startYear = parseInt(match[1], 10);
        const endYear = parseInt(match[2], 10);
        if (endYear !== startYear + 1) {
          return Promise.reject(
            new Error(`Năm học phải liên tiếp nhau (VD: ${startYear}-${startYear + 1})`),
          );
        }
      }

      return Promise.resolve();
    },
  },
];
//  Rule: Thời gian học kỳ  (dateRange)
//  - Ngày bắt đầu: không quá 2 năm trong quá khứ / tương lai
//  - Độ dài học kỳ: 30 – 270 ngày (1 tháng đến ~9 tháng)
export const semesterDateRangeRules: RuleObject[] = [
  {
    required: true,
    message: 'Vui lòng chọn thời gian học kỳ',
  },
  {
    validator(_, value) {
      if (!value || !value[0] || !value[1]) return Promise.resolve();

      const [startDate, endDate] = value as [dayjs.Dayjs, dayjs.Dayjs];
      const today = dayjs().startOf('day');

      // Ngày bắt đầu không được sớm hơn 2 năm so với hiện tại
      if (startDate.isBefore(today.subtract(2, 'year'))) {
        return Promise.reject(
          new Error('Ngày bắt đầu không được sớm hơn 2 năm so với hiện tại'),
        );
      }

      // Ngày bắt đầu không được quá 2 năm trong tương lai
      if (startDate.isAfter(today.add(2, 'year'))) {
        return Promise.reject(
          new Error('Ngày bắt đầu không được quá 2 năm trong tương lai'),
        );
      }

      // Độ dài tối thiểu 30 ngày
      const diffDays = endDate.diff(startDate, 'day');
      if (diffDays < 30) {
        return Promise.reject(
          new Error('Học kỳ phải kéo dài ít nhất 30 ngày'),
        );
      }

      // Độ dài tối đa 270 ngày (~9 tháng)
      if (diffDays > 270) {
        return Promise.reject(
          new Error('Học kỳ không được kéo dài quá 9 tháng (270 ngày)'),
        );
      }

      return Promise.resolve();
    },
  },
];
