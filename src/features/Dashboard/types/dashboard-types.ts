import type { ReactNode } from 'react';

export interface ActiveSemester {
  semester_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  subtitle?: string;
}
export interface algorithmCount{
  algorithm: string;
  count: number;
}
export interface algorithmCountResponse{
  data: algorithmCount[];
  total: number;
}
