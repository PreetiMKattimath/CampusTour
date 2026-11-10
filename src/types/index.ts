export type UserRole = 'student' | 'faculty' | 'parent' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  department: string;
  badge: string;
  identifier: string; // Roll number, Employee ID, or Ward Roll
  phone: string;
  avatarUrl?: string;
  wardId?: string; // If parent
  wardName?: string;
}

export interface StudentAcademicHistory {
  rollNo: string;
  admissionNo: string;
  admissionDate: string;
  degree: string;
  branch: string;
  currentSemester: number;
  totalSemesters: number;
  cgpa: number;
  totalCreditsEarned: number;
  requiredCredits: number;
  mentor: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  bloodGroup: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

export type CourseType = 'core' | 'professional_elective' | 'interdisciplinary_open';

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  credits: number;
  semester: number;
  type: CourseType;
  facultyName: string;
  schedule: string;
  room: string;
  maxSeats: number;
  enrolledSeats: number;
  prerequisites: string[];
  description: string;
  isRegistered?: boolean;
}

export interface SubjectAttendance {
  subjectId: string;
  courseCode: string;
  courseTitle: string;
  facultyName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  departmentThreshold: number;
  lastBiometricPunch: string;
  recentPunches: {
    date: string;
    status: 'Present' | 'Absent' | 'On Duty';
    time: string;
    mode: 'Biometric RFID' | 'Faculty Log';
  }[];
}

export interface BiometricLog {
  id: string;
  timestamp: string;
  deviceLocation: string;
  deviceId: string;
  verificationMode: 'Biometric' | 'SmartCard';
  status: 'Verified' | 'Flagged';
}

export interface CondonationRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  subjectCode: string;
  subjectTitle: string;
  currentAttendance: number;
  requiredThreshold: number;
  shortage: number;
  reasonCategory: 'Medical Emergency' | 'University Sports' | 'Academic Hackathon' | 'Family Bereavement';
  justification: string;
  documentName: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewNotes?: string;
  decisionDate?: string;
}

export interface ExamScheduleItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  examDate: string;
  timeSlot: string;
  hallNumber: string;
  seatNumber: string;
  invigilator: string;
  maxMarks: number;
  instructions: string;
}

export interface SemesterResult {
  semesterNumber: number;
  academicYear: string;
  sgpa: number;
  creditsRegistered: number;
  creditsEarned: number;
  status: 'PASSED' | 'PROMOTED';
  gradeCardUrl?: string;
  subjects: {
    code: string;
    title: string;
    credits: number;
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
    grade: string;
    gradePoint: number;
  }[];
}

export interface GrievanceTicket {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  category: 'Academic' | 'Hostel & Mess' | 'Examination & Evaluation' | 'Infrastructure' | 'Attendance & Biometrics';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  subject: string;
  description: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Assigned to Dean' | 'Resolved';
  isAnonymous: boolean;
  timeline: {
    step: string;
    timestamp: string;
    officer: string;
    notes: string;
  }[];
}

export interface UniversityNotification {
  id: string;
  title: string;
  message: string;
  category: 'attendance' | 'examination' | 'fee' | 'elective' | 'academic';
  timestamp: string;
  read: boolean;
  severity: 'info' | 'warning' | 'danger' | 'success';
}

export interface ExternalIntegrationStatus {
  id: string;
  name: string;
  category: 'Biometric System' | 'Payment Gateway' | 'LMS (Moodle)' | 'Govt Scholarship' | 'Placement Portal';
  provider: string;
  status: 'Operational' | 'Synced' | 'Warning';
  lastPing: string;
  syncedRecords: number;
  details: string;
}

export interface DepartmentPolicy {
  code: string;
  name: string;
  attendanceThreshold: number; // e.g. 85 for CSE, 75 for MECH
  internalMarksWeight: number; // e.g. 40%
  semesterEndWeight: number; // e.g. 60%
  condonationGraceLimit: number; // e.g. 10%
}
