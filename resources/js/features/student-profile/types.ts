import type { User } from '@/features/students/types';

export type StudentProfile = User;

export interface StudentProfileProps {
    student: StudentProfile;
}
