import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  CreditCard,
  Mail,
  Phone,
  Send,
  ShieldCheck,
  UserCheck,
  Building,
} from 'lucide-react';
import { StudentAcademicHistory, SubjectAttendance, SemesterResult } from '../types';
import { FeeItem } from '../utils/academicCalculations';
import { FeePaymentModal } from './Modals/FeePaymentModal';

interface ParentDashboardProps {
  parentName: string;
  wardName: string;
  student: StudentAcademicHistory;
  attendanceList: SubjectAttendance[];
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
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  parentName,
  wardName,
  student,
  attendanceList,
  semesterResults,
  feeLedger,
  onFeePaymentSuccess,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mentorMessage, setMentorMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const pendingAmount =
    feeLedger.items.reduce((acc, i) => acc + i.amount, 0) -
    feeLedger.scholarshipAmount -
    feeLedger.paidAmount;

  const lowAttendanceSubjects = attendanceList.filter((s) => s.percentage < s.departmentThreshold);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorMessage.trim()) return;
    setMessageSent(true);
    setMentorMessage('');
    setTimeout(() => setMessageSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Parent Welcome & Ward Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-800 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              {parentName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Nagarjuna College Of Engineering and Technology · Parent Portal</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-amber-800">Verified Parent / Guardian</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Welcome, {parentName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span>Ward: <strong className="text-slate-800 font-bold">{wardName}</strong></span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-700">Roll: {student.rollNo}</span>
                <span aria-hidden="true">·</span>
                <span>{student.degree} (Sem {student.currentSemester})</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6 text-center">
            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Ward's CGPA
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {student.cgpa.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block">Top 10% in CSE</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Overall Attendance
              </span>
              <span className="text-xl font-black text-amber-600 font-mono">
                86.1%
              </span>
              <span className="text-[10px] text-slate-500 block">Threshold: 85%</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Fee Dues
              </span>
              <span className="text-xl font-black text-amber-800 font-mono">
                ₹{pendingAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 block">Due Nov 30</span>
            </div>
          </div>
        </div>

        {/* Automated Low Attendance Parent Notification (Case Study Change 3) */}
        {lowAttendanceSubjects.length > 0 && (
          <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950 text-sm">
                  Automated Guardian Alert: Attendance Shortage Recorded
                </span>
                <p className="text-amber-800 mt-0.5 leading-relaxed">
                  Your ward (<strong>Roll: NU-2024-CS104</strong>) currently has <strong>73.3%</strong> attendance in{' '}
                  <strong>CS401: Design & Analysis of Algorithms</strong>, which is below the department requirement of 85%.
                  A condonation application or makeup class attendance is required prior to semester-end examinations.
                </p>
              </div>
            </div>
            <a
              href="#mentor-contact"
              className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg shrink-0 text-center transition-colors shadow-xs"
            >
              Contact Faculty Mentor
            </a>
          </div>
        )}
      </div>

      {/* Ward Academic & Attendance Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Subject Attendance Monitor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Real-Time Course Attendance Monitor
                </h3>
                <p className="text-xs text-slate-400">
                  Biometric attendance logs recorded at campus lecture halls
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-700 font-mono">
                Updated Today, 09:02 AM
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Faculty Instructor</th>
                    <th className="py-2.5 px-3 text-center">Classes Attended</th>
                    <th className="py-2.5 px-3 text-right">Attendance %</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceList.map((subject) => {
                    const isBelow = subject.percentage < subject.departmentThreshold;
                    return (
                      <tr key={subject.subjectId} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-slate-800 block">
                            {subject.courseCode}
                          </span>
                          <span className="text-slate-600 font-medium">{subject.courseTitle}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{subject.facultyName}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-medium">
                          {subject.attendedClasses} / {subject.totalClasses}
                        </td>
                        <td
                          className={`py-2.5 px-3 text-right font-mono font-bold text-sm ${
                            isBelow ? 'text-amber-700' : 'text-emerald-600'
                          }`}
                        >
                          {subject.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              isBelow
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isBelow ? 'Warning' : 'Normal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Results History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Ward's Semester Performance Records
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
              {semesterResults.map((sem) => (
                <div key={sem.semesterNumber} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Semester {sem.semesterNumber}
                  </span>
                  <span className="text-xl font-black font-mono text-indigo-700">
                    {sem.sgpa.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {sem.creditsEarned} Credits Earned
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fee Payment & Mentor Communication */}
        <div className="space-y-6">
          {/* Quick Fee Pay Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Semester Fee Status
              </h3>
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Balance Due</span>
              <div className="text-2xl font-black font-mono text-slate-900">
                ₹{pendingAmount.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-slate-500">
                After ₹35,000 Govt. Scholarship credit
              </span>
            </div>

            {pendingAmount > 0 ? (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Pay Fee on Behalf of Ward</span>
              </button>
            ) : (
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-center text-xs font-semibold">
                All semester dues are fully cleared!
              </div>
            )}
          </div>

          {/* Faculty Mentor Direct Communication */}
          <div id="mentor-contact" className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Ward's Academic Faculty Mentor
            </h3>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm">{student.mentor.name}</div>
              <div className="text-slate-500">{student.mentor.designation}</div>
              <div className="pt-2 border-t border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{student.mentor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{student.mentor.phone}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3 text-xs">
              <label className="font-semibold text-slate-700 block">
                Send Direct Message to Faculty Mentor
              </label>
              <textarea
                rows={3}
                value={mentorMessage}
                onChange={(e) => setMentorMessage(e.target.value)}
                placeholder="Inquire about attendance condonation, academic progress, or schedule a parent meeting..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              />

              {messageSent && (
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-md text-xs font-medium">
                  Message delivered to Dr. Arvind Swaminathan's university inbox.
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Transmit Note to Mentor</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <FeePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        studentName={student.mentor.name}
        rollNo={student.rollNo}
        department={student.branch}
        pendingAmount={pendingAmount}
        items={feeLedger.items}
        scholarshipName={feeLedger.scholarshipName}
        scholarshipAmount={feeLedger.scholarshipAmount}
        onPaymentSuccess={onFeePaymentSuccess}
      />
    </div>
  );
};
