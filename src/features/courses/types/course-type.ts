export interface Class {
  class_id: string;
  course_id: string;
  semester_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  instructor: string;
  max_students: number;
}

export interface Course{
       course_id: string;
       course_name:string;
       credits:number;
       department: string;
       classes?: Class[];
}