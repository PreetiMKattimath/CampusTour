import React, { useState } from 'react';
import {
  USER_PROFILES,
  STUDENT_ACADEMIC_HISTORY,
  INITIAL_COURSES,
  INITIAL_ATTENDANCE,
  INITIAL_BIOMETRIC_LOGS,
  INITIAL_CONDONATION_REQUESTS,
  EXAM_SCHEDULE,
  SEMESTER_RESULTS_HISTORY,
  INITIAL_GRIEVANCES,
  INITIAL_NOTIFICATIONS,
  EXTERNAL_INTEGRATIONS,
  DEPARTMENT_POLICIES,
  INITIAL_FEE_LEDGER,
} from './data/seedData';
import {
  UserRole,
  Course,
  SubjectAttendance,
  BiometricLog,
  CondonationRequest,
  GrievanceTicket,
  UniversityNotification,
  DepartmentPolicy,
} from './types';
import { Navbar } from './components/Navbar';
import { Homepage } from './components/Homepage';
import { LoginPage } from './components/LoginPage';
import { StudentDashboard } from './components/StudentDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import {
  GraduationCap,
  UserCheck,
  Users,
  ShieldCheck,
  Info,
  Home,
  LogIn,
  LogOut,
} from 'lucide-react';

export default function App() {
  const [isHome, setIsHome] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [loginRole, setLoginRole] = useState<UserRole>('student');
  const [studentTab, setStudentTab] = useState<string>('overview');

  // Application Data States
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [attendanceList, setAttendanceList] = useState<SubjectAttendance[]>(INITIAL_ATTENDANCE);
  const [biometricLogs, setBiometricLogs] = useState<BiometricLog[]>(INITIAL_BIOMETRIC_LOGS);
  const [condonationRequests, setCondonationRequests] = useState<CondonationRequest[]>(
    INITIAL_CONDONATION_REQUESTS
  );
  const [feeLedger, setFeeLedger] = useState(INITIAL_FEE_LEDGER);
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(INITIAL_GRIEVANCES);
  const [notifications, setNotifications] = useState<UniversityNotification[]>(INITIAL_NOTIFICATIONS);
  const [departmentPolicies, setDepartmentPolicies] = useState<DepartmentPolicy[]>(DEPARTMENT_POLICIES);

  // Navigation Handlers
  const handleGoHome = () => {
    setIsHome(true);
    setIsLogin(false);
  };

  const handleOpenLogin = (role: UserRole) => {
    setLoginRole(role);
    setCurrentRole(role);
    setIsLogin(true);
    setIsHome(false);
  };

  const handleLoginSuccess = (role: UserRole, _userName: string) => {
    setCurrentRole(role);
    setIsLogin(false);
    setIsHome(false);
    if (role === 'student') {
      setStudentTab('overview');
    }
  };

  const handleSignOut = () => {
    setIsHome(true);
    setIsLogin(false);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setIsHome(false);
    setIsLogin(false);
    if (role === 'student') setStudentTab('overview');
  };

  // Course Registration Handler
  const handleToggleCourseRegistration = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextState = !c.isRegistered;
          return {
            ...c,
            isRegistered: nextState,
            enrolledSeats: nextState ? c.enrolledSeats + 1 : Math.max(0, c.enrolledSeats - 1),
          };
        }
        return c;
      })
    );
  };

  // Condonation Handlers
  const handleAddCondonationRequest = (
    newReq: Omit<CondonationRequest, 'id' | 'submissionDate' | 'status'>
  ) => {
    const item: CondonationRequest = {
      ...newReq,
      id: `COND-2026-${Math.floor(100 + Math.random() * 900)}`,
      submissionDate: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: 'pending',
    };
    setCondonationRequests((prev) => [item, ...prev]);

    // Push notification
    const notif: UniversityNotification = {
      id: `notif-${Date.now()}`,
      title: `Condonation Submitted: ${newReq.subjectCode}`,
      message: `Your attendance condonation application for ${newReq.subjectCode} (${newReq.reasonCategory}) has been routed to Dean Academics.`,
      category: 'attendance',
      timestamp: 'Just now',
      read: false,
      severity: 'info',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleApproveCondonation = (id: string, notes: string) => {
    setCondonationRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'approved',
              reviewedBy: 'Dean of Academic Affairs',
              reviewNotes: notes,
              decisionDate: new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            }
          : r
      )
    );

    // Update student's subject attendance status to safe if condonation covers deficit
    setAttendanceList((prev) =>
      prev.map((s) => {
        const matching = condonationRequests.find((r) => r.id === id);
        if (matching && s.courseCode === matching.subjectCode) {
          return {
            ...s,
            percentage: s.departmentThreshold, // restored to threshold
          };
        }
        return s;
      })
    );
  };

  const handleRejectCondonation = (id: string, notes: string) => {
    setCondonationRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'rejected',
              reviewedBy: 'Dean of Academic Affairs',
              reviewNotes: notes,
              decisionDate: new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            }
          : r
      )
    );
  };

  // Fee Payment Handler
  const handleFeePaymentSuccess = (payment: {
    amount: number;
    method: string;
    transactionRef: string;
    receiptNumber: string;
  }) => {
    const today = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    setFeeLedger((prev) => ({
      ...prev,
      paidAmount: prev.paidAmount + payment.amount,
      paymentHistory: [
        {
          id: `tx-${Date.now()}`,
          date: today,
          amount: payment.amount,
          method: payment.method,
          transactionRef: payment.transactionRef,
          receiptNumber: payment.receiptNumber,
        },
        ...prev.paymentHistory,
      ],
    }));

    // Add receipt notification
    const notif: UniversityNotification = {
      id: `notif-${Date.now()}`,
      title: `Fee Payment Received: ₹${payment.amount.toLocaleString('en-IN')}`,
      message: `Official receipt ${payment.receiptNumber} generated. Academic dues cleared.`,
      category: 'fee',
      timestamp: 'Just now',
      read: false,
      severity: 'success',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Grievance Handlers
  const handleAddGrievance = (
    newTicket: Omit<GrievanceTicket, 'id' | 'submittedAt' | 'status' | 'timeline'>
  ) => {
    const ticket: GrievanceTicket = {
      ...newTicket,
      id: `GRV-2026-0${Math.floor(300 + Math.random() * 700)}`,
      submittedAt: 'Just now',
      status: 'Submitted',
      timeline: [
        {
          step: 'Ticket Submitted',
          timestamp: 'Just now',
          officer: 'Automated Grievance Dispatcher',
          notes: 'Ticket routed to Academic Directorate and relevant Department Head.',
        },
      ],
    };

    setGrievances((prev) => [ticket, ...prev]);
  };

  const handleResolveGrievance = (id: string, notes: string) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return {
            ...g,
            status: 'Resolved',
            timeline: [
              ...g.timeline,
              {
                step: 'Ticket Resolved',
                timestamp: 'Just now',
                officer: 'Dean of Academic Affairs',
                notes,
              },
            ],
          };
        }
        return g;
      })
    );
  };

  // Department Policy Tuner Handler
  const handleUpdatePolicy = (code: string, newThreshold: number) => {
    setDepartmentPolicies((prev) =>
      prev.map((p) => (p.code === code ? { ...p, attendanceThreshold: newThreshold } : p))
    );

    if (code === 'CSE') {
      setAttendanceList((prev) =>
        prev.map((s) => ({
          ...s,
          departmentThreshold: newThreshold,
        }))
      );
    }
  };

  // Faculty Attendance Sync Handler
  const handleFacultyAttendanceSubmitted = (
    courseCode: string,
    _date: string,
    presentCount: number
  ) => {
    setAttendanceList((prev) =>
      prev.map((s) => {
        if (s.courseCode === courseCode) {
          const newTotal = s.totalClasses + 1;
          const newAttended = s.attendedClasses + 1;
          const newPct = Math.round((newAttended / newTotal) * 1000) / 10;
          return {
            ...s,
            totalClasses: newTotal,
            attendedClasses: newAttended,
            percentage: newPct,
            lastBiometricPunch: `Today, 10:15 AM · Faculty Verified (${presentCount} present)`,
          };
        }
        return s;
      })
    );

    const newLog: BiometricLog = {
      id: `bio-${Math.floor(9100 + Math.random() * 900)}`,
      timestamp: 'Today, 10:15:22 AM',
      deviceLocation: `Faculty Gateway · ${courseCode} Class`,
      deviceId: 'BIO-FAC-SYNC-01',
      verificationMode: 'Biometric',
      status: 'Verified',
    };
    setBiometricLogs((prev) => [newLog, ...prev]);
  };

  // Student available subtabs
  const studentNavTabs = [
    { id: 'overview', label: 'Student Overview' },
    { id: 'attendance', label: 'Attendance & Biometrics' },
    { id: 'registration', label: 'Credit-Based Electives' },
    { id: 'examinations', label: 'Exams & Results' },
    { id: 'fees', label: 'Fee Management' },
    { id: 'grievance', label: 'Grievance Redressal' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Bar */}
      <Navbar
        currentRole={isLogin ? loginRole : currentRole}
        isHome={isHome}
        isLogin={isLogin}
        onGoHome={handleGoHome}
        onOpenLogin={handleOpenLogin}
        onRoleChange={handleRoleChange}
        onSignOut={handleSignOut}
        userProfile={USER_PROFILES[currentRole]}
        notifications={notifications}
        onMarkNotificationAsRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        activeTab={studentTab}
        onTabChange={setStudentTab}
        availableTabs={!isHome && !isLogin && currentRole === 'student' ? studentNavTabs : []}
      />

      {/* Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Contextual Status Bar - Only shown when authenticated inside a portal */}
        {!isHome && !isLogin && (
          <div className="bg-white rounded-xl border border-slate-200 p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Currently logged in to <strong className="text-slate-900 uppercase font-bold">{currentRole} Portal</strong>. You can switch portals or sign out anytime.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleGoHome}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs"
              >
                <Home className="w-3.5 h-3.5" />
                <span>College Home</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Views: Homepage, Login Page, or Authenticated Stakeholder Dashboards */}
        {isHome ? (
          <Homepage onOpenLogin={handleOpenLogin} />
        ) : isLogin ? (
          <LoginPage
            initialRole={loginRole}
            onLoginSuccess={handleLoginSuccess}
            onBackToHome={handleGoHome}
          />
        ) : (
          <>
            {currentRole === 'student' && (
              <StudentDashboard
                student={STUDENT_ACADEMIC_HISTORY}
                studentName={USER_PROFILES.student.name}
                courses={courses}
                onToggleCourseRegistration={handleToggleCourseRegistration}
                attendanceList={attendanceList}
                biometricLogs={biometricLogs}
                condonationRequests={condonationRequests}
                onAddCondonationRequest={handleAddCondonationRequest}
                examSchedule={EXAM_SCHEDULE}
                semesterResults={SEMESTER_RESULTS_HISTORY}
                feeLedger={feeLedger}
                onFeePaymentSuccess={handleFeePaymentSuccess}
                grievances={grievances}
                onAddGrievance={handleAddGrievance}
                activeSubTab={studentTab}
                onSubTabChange={setStudentTab}
              />
            )}

            {currentRole === 'faculty' && (
              <FacultyDashboard
                facultyName={USER_PROFILES.faculty.name}
                department={USER_PROFILES.faculty.department}
                employeeId={USER_PROFILES.faculty.identifier}
                courses={courses}
                onAttendanceSubmitted={handleFacultyAttendanceSubmitted}
              />
            )}

            {currentRole === 'parent' && (
              <ParentDashboard
                parentName={USER_PROFILES.parent.name}
                wardName={USER_PROFILES.parent.wardName || 'Student Ward'}
                student={STUDENT_ACADEMIC_HISTORY}
                attendanceList={attendanceList}
                semesterResults={SEMESTER_RESULTS_HISTORY}
                feeLedger={feeLedger}
                onFeePaymentSuccess={handleFeePaymentSuccess}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard
                adminName={USER_PROFILES.admin.name}
                department={USER_PROFILES.admin.department}
                condonationRequests={condonationRequests}
                onApproveCondonation={handleApproveCondonation}
                onRejectCondonation={handleRejectCondonation}
                departmentPolicies={departmentPolicies}
                onUpdatePolicy={handleUpdatePolicy}
                integrations={EXTERNAL_INTEGRATIONS}
                grievances={grievances}
                onResolveGrievance={handleResolveGrievance}
              />
            )}
          </>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-500 border-b border-slate-100 pb-6">
            <div>
              <span className="font-bold text-slate-900 text-sm">Nagarjuna College Of Engineering and Technology</span>
              <p className="text-slate-500 text-xs mt-0.5">
                Mudugurki, Venkatagiri Kote Post, Devanahalli, Bengaluru-562103
              </p>
              <span className="block text-[11px] text-slate-400 mt-1">
                Autonomous Institution · Affiliated to VTU · AICTE Approved · NAAC 'A' Grade · Biometric IoT Gateway v4.8
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                onClick={handleGoHome}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                College Home
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => handleOpenLogin('student')}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Student Login
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => handleOpenLogin('faculty')}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Faculty Login
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => handleOpenLogin('parent')}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Parent Login
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => handleOpenLogin('admin')}
                className="text-slate-600 hover:text-slate-900 font-medium"
              >
                Admin Login
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              © 2026 Nagarjuna College Of Engineering and Technology. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Controller of Examinations</span>
              <span aria-hidden="true">·</span>
              <span>Academic Council</span>
              <span aria-hidden="true">·</span>
              <span>Dean of Systems</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
