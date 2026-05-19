import type { AttendanceMeta, AttendanceRecord } from '@/features/attendance/types';

export type StudentAttendanceRecord = AttendanceRecord;

export interface StudentAttendanceRecordsProps {
    attendanceRecords: {
        data: StudentAttendanceRecord[];
        meta: AttendanceMeta;
    };
}
