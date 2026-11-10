import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  CheckCircle2,
  FileText,
  CreditCard,
  MessageSquare,
  ArrowRight,
  Plus,
  Trash2,
  Download,
  Printer,
  ChevronRight,
  Shield,
  Layers,
  MapPin,
  Fingerprint,
  Sparkles,
} from 'lucide-react';
import {
  StudentAcademicHistory,
  Course,
  SubjectAttendance,
  BiometricLog,
  CondonationRequest,
  ExamScheduleItem,
  SemesterResult,
  GrievanceTicket,
} from '../types';
import {
  calculateAttendancePercentage,
  getAttendanceStatus,
  calculateFeeBalances,
  validateCreditLimits,
  FeeItem,
} from '../utils/academicCalculations';
import { HallTicketModal } from './Modals/HallTicketModal';
import { FeePaymentModal } from './Modals/FeePaymentModal';
import { CondonationModal } from './Modals/CondonationModal';
import { NewGrievanceModal } from './Modals/NewGrievanceModal';

interface StudentDashboardProps {
  student: StudentAcademicHistory;
  studentName: string;
  courses: Course[];
  onToggleCourseRegistration: (courseId: string) => void;
  attendanceList: SubjectAttendance[];
  biometricLogs: BiometricLog[];
  condonationRequests: CondonationRequest[];
  onAddCondonationRequest: (request: Omit<CondonationRequest, 'id' | 'submissionDate' | 'status'>) => void;
  examSchedule: ExamScheduleItem[];
  semesterResults: SemesterResult[];
  feeLedger: {
    academicYear: string;
    dueDate: string;
    items: FeeItem[];
    scholarshipName: string;
    scholarshipAmount: number;
    paidAmount: number;
    paymentHistory: {
      id: string;
      date: string;
      amount: number;
      method: string;
      transactionRef: string;
      receiptNumber: string;
    }[];
  };
  onFeePaymentSuccess: (payment: {
    amount: number;
    method: string;
    transactionRef: string;
    receiptNumber: string;
  }) => void;
  grievances: GrievanceTicket[];
  onAddGrievance: (ticket: Omit<GrievanceTicket, 'id' | 'submittedAt' | 'status' | 'timeline'>) => void;
  activeSubTab: string;
  onSubTabChange: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  studentName,
  courses,
  onToggleCourseRegistration,
  attendanceList,
  biometricLogs,
  condonationRequests,
  onAddCondonationRequest,
  examSchedule,
  semesterResults,
  feeLedger,
  onFeePaymentSuccess,
  grievances,
  onAddGrievance,
  activeSubTab,
  onSubTabChange,
}) => {
  // Modal states
  const [showHallTicketModal, setShowHallTicketModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCondonationModal, setShowCondonationModal] = useState(false);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);

  // Elective filter
  const [courseFilter, setCourseFilter] = useState<'all' | 'core' | 'professional_elective' | 'interdisciplinary_open'>('all');

  // Calculations
  const registeredCourses = courses.filter((c) => c.isRegistered);
  const currentRegisteredCredits = registeredCourses.reduce((sum, c) => sum + c.credits, 0);
  const creditValidation = validateCreditLimits(currentRegisteredCredits, 20, 28);

  const feeBalances = calculateFeeBalances(
    feeLedger.items,
    feeLedger.scholarshipAmount,
    feeLedger.paidAmount
  );

  const totalAttended = attendanceList.reduce((acc, s) => acc + s.attendedClasses, 0);
  const totalClasses = attendanceList.reduce((acc, s) => acc + s.totalClasses, 0);
  const overallAttendance = calculateAttendancePercentage(totalAttended, totalClasses);

  // Check low attendance alert
  const lowAttendanceSubjects = attendanceList.filter((s) => s.percentage < s.departmentThreshold);

  return (
    <div className="space-y-6">
      {/* Student Overview Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-900 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              {studentName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>{student.degree}</span>
                <span aria-hidden="true">·</span>
                <span>{student.branch}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-indigo-700">Semester {student.currentSemester}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {studentName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="font-mono font-semibold text-slate-700">Roll: {student.rollNo}</span>
                <span aria-hidden="true">·</span>
                <span>Mentor: {student.mentor.name}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-medium">Academic Status: Good Standing</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6 text-center">
            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Current CGPA
              </span>
              <span className="text-xl font-black text-slate-900 font-mono tabular-nums">
                {student.cgpa.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-500 block">Out of 10.00</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Earned Credits
              </span>
              <span className="text-xl font-black text-slate-900 font-mono tabular-nums">
                {student.totalCreditsEarned}
                <span className="text-xs font-normal text-slate-400">/{student.requiredCredits}</span>
              </span>
              <span className="text-[10px] text-slate-500 block">Degree Progress</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Overall Attendance
              </span>
              <span
                className={`text-xl font-black font-mono tabular-nums ${
                  overallAttendance >= 85 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {overallAttendance}%
              </span>
              <span className="text-[10px] text-slate-500 block">Req: 85% (CSE)</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Pending Fees
              </span>
              <span
                className={`text-xl font-black font-mono tabular-nums ${
                  feeBalances.pendingBalance > 0 ? 'text-amber-700' : 'text-emerald-600'
                }`}
              >
                ₹{feeBalances.pendingBalance.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {feeBalances.pendingBalance > 0 ? 'Due Nov 30' : 'All Paid'}
              </span>
            </div>
          </div>
        </div>

        {/* Low Attendance Warning Alert (From Case Study Change 3 & 4) */}
        {lowAttendanceSubjects.length > 0 && (
          <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950 text-sm">
                  Attendance Warning: Shortage in {lowAttendanceSubjects.length} Subject(s)
                </span>
                <p className="text-amber-800 mt-0.5 leading-relaxed">
                  Your attendance in{' '}
                  <strong>
                    {lowAttendanceSubjects.map((s) => `${s.courseCode} (${s.percentage}%)`).join(', ')}
                  </strong>{' '}
                  is below the CSE departmental threshold (85%). Under University Regulation 4.2, condonation or makeup classes must be logged before semester exams.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSubTabChange('attendance')}
                className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100/60 font-semibold text-amber-900 rounded-lg transition-colors"
              >
                View Attendance
              </button>
              <button
                onClick={() => setShowCondonationModal(true)}
                className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg shadow-xs transition-colors"
              >
                Apply Condonation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main SubTab Content View */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Today's Timetable & Course Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Today's Academic Schedule
                  </h3>
                  <span className="text-xs text-slate-400">Tuesday, Odd Semester 2026</span>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Campus Biometric Check-in: 09:02 AM
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex flex-col items-center justify-center text-[10px] font-bold">
                      <span>09:00</span>
                      <span>10:30</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        CS401 · Design & Analysis of Algorithms
                      </div>
                      <div className="text-xs text-slate-500">
                        Department Faculty · Hall C-201 · <span className="text-emerald-600 font-medium">Biometric Punch Verified</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    Completed
                  </span>
                </div>

                <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex flex-col items-center justify-center text-[10px] font-bold">
                      <span>10:45</span>
                      <span>12:15</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        CS402 · Database Management Systems & NoSQL
                      </div>
                      <div className="text-xs text-slate-600">
                        Dr. Arvind Swaminathan · Lab B-104 · Hands-on Query Optimization
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-md animate-pulse">
                    In Progress
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-700 flex flex-col items-center justify-center text-[10px] font-bold">
                      <span>02:00</span>
                      <span>03:30</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        CS-PE41 · Cloud Native Computing & Kubernetes
                      </div>
                      <div className="text-xs text-slate-500">
                        Prof. Anand Vardhan · Cloud Center 402 · Pod Ingress Setup
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">Upcoming</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setShowHallTicketModal(true)}
                className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-colors shadow-xs group"
              >
                <Printer className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900 text-xs block">Hall Ticket</span>
                <span className="text-[11px] text-slate-500 block">Download Dec 2026 Admit Card</span>
              </button>

              <button
                onClick={() => setShowPaymentModal(true)}
                className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-colors shadow-xs group"
              >
                <CreditCard className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900 text-xs block">Pay Tuition Fee</span>
                <span className="text-[11px] text-slate-500 block">Balance: ₹{feeBalances.pendingBalance.toLocaleString('en-IN')}</span>
              </button>

              <button
                onClick={() => setShowCondonationModal(true)}
                className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-colors shadow-xs group"
              >
                <FileText className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900 text-xs block">Condonation</span>
                <span className="text-[11px] text-slate-500 block">Submit Medical/Duty Proof</span>
              </button>

              <button
                onClick={() => setShowGrievanceModal(true)}
                className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-left transition-colors shadow-xs group"
              >
                <MessageSquare className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900 text-xs block">File Grievance</span>
                <span className="text-[11px] text-slate-500 block">Lodge Complaint / Issue</span>
              </button>
            </div>
          </div>

          {/* Right Column: Profile Summary & Academic Guidance */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                Academic Profile & Mentorship
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Degree & Specialization</span>
                  <span className="font-semibold text-slate-800 text-right">B.Tech CSE (Honors)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Admission Number</span>
                  <span className="font-mono text-slate-800 font-medium">{student.admissionNo}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Faculty Mentor</span>
                  <span className="font-semibold text-slate-800">{student.mentor.name}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Mentor Contact</span>
                  <span className="text-indigo-600 font-mono">{student.mentor.email}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Parent / Guardian Contact</span>
                  <span className="font-mono text-slate-800">{student.emergencyContact.phone}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500">Blood Group</span>
                  <span className="font-bold text-red-600">{student.bloodGroup}</span>
                </div>
              </div>
            </div>

            {/* Flexible Credit System Card */}
            <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Flexible Academic Credit System</span>
                </div>
                <h4 className="text-lg font-bold">21 Credits Enrolled this Semester</h4>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  You are enrolled in 4 Core subjects, 1 Professional Elective (Cloud Native), and 1 Interdisciplinary Open Elective (AI in Healthcare).
                </p>
                <button
                  onClick={() => onSubTabChange('registration')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-indigo-950 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <span>Manage Electives</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance & Biometrics Tab */}
      {activeSubTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Attendance Management & Biometric Punch Records
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time synchronization with campus RFID biometric terminals. CSE Department minimum requirement: <strong>85%</strong>.
              </p>
            </div>
            <button
              onClick={() => setShowCondonationModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shrink-0 shadow-sm"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Apply for Attendance Condonation</span>
            </button>
          </div>

          {/* Subject Attendance Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendanceList.map((subject) => {
              const status = getAttendanceStatus(subject.percentage, subject.departmentThreshold);
              const isBelow = subject.percentage < subject.departmentThreshold;

              return (
                <div
                  key={subject.subjectId}
                  className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-sm space-y-3 ${
                    isBelow ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-700">
                        {subject.courseCode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug mt-0.5">
                        {subject.courseTitle}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{subject.facultyName}</p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xl font-black font-mono tabular-nums ${
                          isBelow ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {subject.percentage}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">Req: {subject.departmentThreshold}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isBelow ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, subject.percentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>Attended: {subject.attendedClasses} classes</span>
                      <span>Total: {subject.totalClasses} classes</span>
                    </div>
                  </div>

                  {/* Biometric Last Punch Info */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Fingerprint className="w-3.5 h-3.5 text-slate-400" />
                      {subject.lastBiometricPunch}
                    </span>
                    {isBelow && (
                      <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                        Deficit: {status.deficit}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Condonation Requests Status Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Submitted Attendance Condonation Applications
                </h3>
                <p className="text-xs text-slate-400">
                  Official applications reviewed by Academic Council and Dean
                </p>
              </div>
              <button
                onClick={() => setShowCondonationModal(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                + Submit New Request
              </button>
            </div>

            {condonationRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active condonation requests submitted.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {condonationRequests.map((req) => (
                  <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{req.id}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-indigo-700">
                          {req.subjectCode} - {req.subjectTitle}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-500">{req.reasonCategory}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed max-w-2xl">{req.justification}</p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>Submitted on {req.submissionDate}</span>
                        <span>Document: {req.documentName}</span>
                        {req.reviewNotes && (
                          <span className="text-emerald-700 font-medium">Remarks: {req.reviewNotes}</span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {req.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved by Dean
                        </span>
                      )}
                      {req.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" /> Under Academic Review
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Biometric Hardware Logs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Recent Biometric RFID Terminal Synced Punches
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Log ID</th>
                    <th className="py-2.5 px-3">Date & Timestamp</th>
                    <th className="py-2.5 px-3">Terminal Reader Location</th>
                    <th className="py-2.5 px-3">Verification Mode</th>
                    <th className="py-2.5 px-3 text-right">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {biometricLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-mono text-slate-500">{log.id}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{log.timestamp}</td>
                      <td className="py-2.5 px-3 text-slate-700">{log.deviceLocation}</td>
                      <td className="py-2.5 px-3 text-slate-600">{log.verificationMode}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Flexible Credit Course & Elective Registration Tab */}
      {activeSubTab === 'registration' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block">
                  Flexible Credit-Based Academic System (CBCS)
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Course & Elective Registration Portal
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Per Nagarjuna College Of Engineering and Technology autonomous regulations, students can choose Professional Electives and Interdisciplinary Open Electives across departments. Add/Drop period is active.
                </p>
              </div>

              {/* Credit Tracker Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-6 shrink-0">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Selected Credits</span>
                  <span className="text-2xl font-black font-mono text-slate-900">
                    {currentRegisteredCredits}
                    <span className="text-xs font-normal text-slate-400"> / 28 max</span>
                  </span>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  <span
                    className={`text-xs font-bold block ${
                      creditValidation.valid ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {creditValidation.valid ? 'Valid Allocation' : 'Adjustment Needed'}
                  </span>
                  <span className="text-[11px] text-slate-500">Min 20 · Max 28 credits</span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mt-6 flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit overflow-x-auto">
              <button
                onClick={() => setCourseFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  courseFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Courses ({courses.length})
              </button>
              <button
                onClick={() => setCourseFilter('core')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  courseFilter === 'core'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Core Subjects (4)
              </button>
              <button
                onClick={() => setCourseFilter('professional_elective')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  courseFilter === 'professional_elective'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Professional Electives (3)
              </button>
              <button
                onClick={() => setCourseFilter('interdisciplinary_open')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  courseFilter === 'interdisciplinary_open'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Interdisciplinary Open Electives (3)
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses
              .filter((c) => (courseFilter === 'all' ? true : c.type === courseFilter))
              .map((course) => {
                const isReg = course.isRegistered;
                return (
                  <div
                    key={course.id}
                    className={`bg-white rounded-2xl border p-5 transition-all space-y-4 ${
                      isReg ? 'border-indigo-300 ring-2 ring-indigo-50 shadow-xs' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                          <span className="font-mono font-bold text-indigo-700">{course.code}</span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize text-slate-600 font-semibold">
                            {course.type.replace('_', ' ')}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500">{course.department}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {course.title}
                        </h4>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-lg font-black font-mono text-slate-900">
                          {course.credits} Credits
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Instructor</span>
                        <span className="font-medium text-slate-800">{course.facultyName}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Schedule & Room</span>
                        <span className="font-medium text-slate-800">{course.schedule}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Capacity</span>
                        <span className="font-mono text-slate-700">
                          {course.enrolledSeats} / {course.maxSeats} Enrolled
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Prerequisites</span>
                        <span className="text-slate-700">{course.prerequisites.join(', ')}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      {course.type === 'core' ? (
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                          Mandatory Core Course
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onToggleCourseRegistration(course.id)}
                          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                            isReg
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                          }`}
                        >
                          {isReg ? (
                            <>
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Drop Course</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Register / Add Course</span>
                            </>
                          )}
                        </button>
                      )}

                      {isReg && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" /> Enrolled
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Examination & Results Tab */}
      {activeSubTab === 'examinations' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Examination Schedules & Academic Results
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Nagarjuna College Of Engineering and Technology End-Semester Examination timetable, hall ticket issuance, and consolidated grade transcripts.
              </p>
            </div>
            <button
              onClick={() => setShowHallTicketModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm shrink-0"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Download Official Hall Ticket</span>
            </button>
          </div>

          {/* Upcoming Exam Timetable */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              December 2026 Regular Theory & Practical Examination Schedule
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Time Slot</th>
                    <th className="py-2.5 px-3">Course</th>
                    <th className="py-2.5 px-3">Examination Venue</th>
                    <th className="py-2.5 px-3 text-right">Desk / Seat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examSchedule.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        {exam.examDate}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono">{exam.timeSlot}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-indigo-700 block">{exam.courseCode}</span>
                        <span className="text-slate-800 font-medium">{exam.courseTitle}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{exam.hallNumber}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {exam.seatNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Published Results Archive */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Published Semester Grade Cards & SGPA Archive
            </h3>

            {semesterResults.map((sem) => (
              <div key={sem.semesterNumber} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Semester {sem.semesterNumber} Grade Sheet
                    </h4>
                    <span className="text-xs text-slate-500">{sem.academicYear}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">SGPA</span>
                      <span className="text-lg font-black text-indigo-700">{sem.sgpa.toFixed(2)}</span>
                    </div>
                    <div className="text-right border-l border-slate-200 pl-4">
                      <span className="text-slate-400 text-[10px] uppercase font-semibold block">Credits</span>
                      <span className="text-lg font-black text-slate-800">{sem.creditsEarned}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
                      {sem.status}
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <th className="py-2 px-3">Subject Code</th>
                        <th className="py-2 px-3">Title</th>
                        <th className="py-2 px-3 text-center">Credits</th>
                        <th className="py-2 px-3 text-center">Internal (40)</th>
                        <th className="py-2 px-3 text-center">External (60)</th>
                        <th className="py-2 px-3 text-center">Total (100)</th>
                        <th className="py-2 px-3 text-right">Letter Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sem.subjects.map((subj) => (
                        <tr key={subj.code} className="hover:bg-slate-50/70">
                          <td className="py-2 px-3 font-mono font-bold text-slate-700">{subj.code}</td>
                          <td className="py-2 px-3 text-slate-800 font-medium">{subj.title}</td>
                          <td className="py-2 px-3 text-center font-mono">{subj.credits}</td>
                          <td className="py-2 px-3 text-center font-mono text-slate-600">{subj.internalMarks}</td>
                          <td className="py-2 px-3 text-center font-mono text-slate-600">{subj.externalMarks}</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">{subj.totalMarks}</td>
                          <td className="py-2 px-3 text-right">
                            <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              {subj.grade} ({subj.gradePoint})
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fee Management & Online Payment Tab */}
      {activeSubTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Fee Management & Scholarship Accounting
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Itemized university tuition schedule, government scholarship credits, and digital payment receipts.
              </p>
            </div>
            {feeBalances.pendingBalance > 0 && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm shrink-0"
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Pay Outstanding Balance (₹{feeBalances.pendingBalance.toLocaleString('en-IN')})</span>
              </button>
            )}
          </div>

          {/* Fee Accounting Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Gross Semester Fees
              </span>
              <p className="text-2xl font-black font-mono text-slate-900">
                ₹{feeBalances.grossTotal.toLocaleString('en-IN')}
              </p>
              <span className="text-xs text-slate-500">5 Ledger Line Items</span>
            </div>

            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                Govt. Scholarship Offset
              </span>
              <p className="text-2xl font-black font-mono text-emerald-700">
                -₹{feeLedger.scholarshipAmount.toLocaleString('en-IN')}
              </p>
              <span className="text-xs text-emerald-800 font-medium">NSP DBT Verified</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Already Paid
              </span>
              <p className="text-2xl font-black font-mono text-slate-800">
                ₹{feeLedger.paidAmount.toLocaleString('en-IN')}
              </p>
              <span className="text-xs text-slate-500">Receipts generated</span>
            </div>

            <div
              className={`p-5 rounded-2xl border space-y-1 ${
                feeBalances.pendingBalance > 0
                  ? 'bg-amber-50/80 border-amber-200'
                  : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                Remaining Balance
              </span>
              <p
                className={`text-2xl font-black font-mono ${
                  feeBalances.pendingBalance > 0 ? 'text-amber-800' : 'text-emerald-700'
                }`}
              >
                ₹{feeBalances.pendingBalance.toLocaleString('en-IN')}
              </p>
              <span className="text-xs text-slate-600">
                {feeBalances.pendingBalance > 0 ? 'Due: ' + feeLedger.dueDate : 'Zero balance'}
              </span>
            </div>
          </div>

          {/* Itemized Fee Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Semester IV Fee Assessment Structure
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-right">Assessed Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feeLedger.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 text-slate-800 font-medium">{item.label}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-50/60 font-semibold text-emerald-900 border-t border-slate-200">
                    <td className="py-2.5 px-3">
                      Less: {feeLedger.scholarshipName} (Govt. of India / DBT)
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                      -₹{feeLedger.scholarshipAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                    <td className="py-2.5 px-3">Net Payable Amount</td>
                    <td className="py-2.5 px-3 text-right font-mono text-sm">
                      ₹{feeBalances.netPayable.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Past Payment Transactions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Payment History & Receipts
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {feeLedger.paymentHistory.map((tx) => (
                <div key={tx.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Receipt #{tx.receiptNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-500">{tx.transactionRef}</span>
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      Date: {tx.date} · Mode: {tx.method}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black font-mono text-emerald-700">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-3 py-1.5 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                    >
                      View Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Student Grievance Redressal Tab */}
      {activeSubTab === 'grievance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Student Grievance Redressal & Support Portal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit academic, hostel, examination, or biometric complaints with transparent timeline tracking.
              </p>
            </div>
            <button
              onClick={() => setShowGrievanceModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm shrink-0"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Lodge New Grievance Ticket</span>
            </button>
          </div>

          <div className="space-y-4">
            {grievances.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">{ticket.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-xs font-semibold text-indigo-700">{ticket.category}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ticket.priority === 'High' || ticket.priority === 'Urgent'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ticket.priority} Priority
                    </span>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                      ticket.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    Status: {ticket.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{ticket.subject}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ticket.description}</p>
                  <span className="text-[11px] text-slate-400 block mt-2">
                    Lodged: {ticket.submittedAt} · {ticket.isAnonymous ? 'Confidential' : 'By Student (Roll: NU-2024-CS104)'}
                  </span>
                </div>

                {/* Audit Timeline */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Redressal Activity Timeline
                  </span>
                  <div className="space-y-2.5 text-xs">
                    {ticket.timeline.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-slate-800">{step.step}</strong>
                            <span className="text-slate-400 text-[11px]">({step.timestamp})</span>
                            <span className="text-slate-500 text-[11px]">· {step.officer}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{step.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Modals */}
      <HallTicketModal
        isOpen={showHallTicketModal}
        onClose={() => setShowHallTicketModal(false)}
        student={student}
        studentName={studentName}
        exams={examSchedule}
      />

      <FeePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        studentName={studentName}
        rollNo={student.rollNo}
        department={student.branch}
        pendingAmount={feeBalances.pendingBalance}
        items={feeLedger.items}
        scholarshipName={feeLedger.scholarshipName}
        scholarshipAmount={feeLedger.scholarshipAmount}
        onPaymentSuccess={onFeePaymentSuccess}
      />

      <CondonationModal
        isOpen={showCondonationModal}
        onClose={() => setShowCondonationModal(false)}
        attendanceList={attendanceList}
        studentName={studentName}
        rollNo={student.rollNo}
        onSubmit={onAddCondonationRequest}
      />

      <NewGrievanceModal
        isOpen={showGrievanceModal}
        onClose={() => setShowGrievanceModal(false)}
        studentName={studentName}
        rollNo={student.rollNo}
        onSubmit={onAddGrievance}
      />
    </div>
  );
};
