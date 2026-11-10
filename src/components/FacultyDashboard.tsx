import React, { useState } from 'react';
import {
  UserCheck,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Award,
  Upload,
  Send,
  AlertCircle,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { Course } from '../types';
import { convertMarksToGrade } from '../utils/academicCalculations';

interface FacultyDashboardProps {
  facultyName: string;
  department: string;
  employeeId: string;
  courses: Course[];
  onAttendanceSubmitted: (courseCode: string, date: string, presentCount: number) => void;
}

interface StudentRosterItem {
  id: string;
  rollNo: string;
  name: string;
  status: 'Present' | 'Absent' | 'On Duty';
  midTerm1: number; // out of 25
  midTerm2: number; // out of 25
  internalAssignment: number; // out of 10
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  facultyName,
  department,
  employeeId,
  courses,
  onAttendanceSubmitted,
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'marks' | 'announcements' | 'workload'>('attendance');
  const [selectedCourseCode, setSelectedCourseCode] = useState('CS401');

  // Roster state for grading & attendance
  const [roster, setRoster] = useState<StudentRosterItem[]>([
    { id: '1', rollNo: 'NU-2024-CS104', name: 'Student CS104', status: 'Present', midTerm1: 22, midTerm2: 23, internalAssignment: 9 },
    { id: '2', rollNo: 'NU-2024-CS108', name: 'Student CS108', status: 'Present', midTerm1: 19, midTerm2: 21, internalAssignment: 8 },
    { id: '3', rollNo: 'NU-2024-CS112', name: 'Student CS112', status: 'Absent', midTerm1: 14, midTerm2: 17, internalAssignment: 7 },
    { id: '4', rollNo: 'NU-2024-CS115', name: 'Student CS115', status: 'Present', midTerm1: 24, midTerm2: 25, internalAssignment: 10 },
    { id: '5', rollNo: 'NU-2024-CS120', name: 'Student CS120', status: 'On Duty', midTerm1: 20, midTerm2: 18, internalAssignment: 8 },
    { id: '6', rollNo: 'NU-2024-CS124', name: 'Student CS124', status: 'Present', midTerm1: 21, midTerm2: 22, internalAssignment: 9 },
  ]);

  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState('');
  const [marksSavedMessage, setMarksSavedMessage] = useState('');

  // Announcement state
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementCategory, setAnnouncementCategory] = useState('Assignment 3 Deadline Extension');
  const [announcementSent, setAnnouncementSent] = useState(false);

  const toggleStudentStatus = (id: string, status: 'Present' | 'Absent' | 'On Duty') => {
    setRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const markAllPresent = () => {
    setRoster((prev) => prev.map((s) => ({ ...s, status: 'Present' })));
  };

  const handleSaveAttendance = () => {
    const presentCount = roster.filter((s) => s.status === 'Present' || s.status === 'On Duty').length;
    const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    onAttendanceSubmitted(selectedCourseCode, today, presentCount);

    setAttendanceSavedMessage(
      `Attendance successfully recorded for ${selectedCourseCode} (${presentCount}/${roster.length} present). Synced with Biometric Central Database.`
    );
    setTimeout(() => setAttendanceSavedMessage(''), 4000);
  };

  const updateStudentMark = (id: string, field: 'midTerm1' | 'midTerm2' | 'internalAssignment', val: number) => {
    const clamped = Math.max(0, Math.min(field === 'internalAssignment' ? 10 : 25, val));
    setRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: clamped } : s))
    );
  };

  const handlePublishMarks = () => {
    setMarksSavedMessage(
      `Internal Continuous Assessment marks for ${selectedCourseCode} published and synced to Student Grade Portals!`
    );
    setTimeout(() => setMarksSavedMessage(''), 4000);
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setAnnouncementSent(true);
    setAnnouncementText('');
    setTimeout(() => setAnnouncementSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Faculty Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              {facultyName.charAt(6) || 'R'}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>{department}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-emerald-800">Department Head & Associate Prof</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {facultyName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="font-mono font-semibold text-slate-700">ID: {employeeId}</span>
                <span aria-hidden="true">·</span>
                <span>Office: CS Block Room 304</span>
                <span aria-hidden="true">·</span>
                <span>Office Hours: Mon, Wed 02:00 - 04:00 PM</span>
              </div>
            </div>
          </div>

          {/* Workload Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6 text-center">
            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Weekly Lectures
              </span>
              <span className="text-xl font-black text-slate-900 font-mono tabular-nums">12 Hrs</span>
              <span className="text-[10px] text-slate-500 block">3 Theory Courses</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Laboratory Load
              </span>
              <span className="text-xl font-black text-slate-900 font-mono tabular-nums">4 Hrs</span>
              <span className="text-[10px] text-slate-500 block">Algorithms Lab 2</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Enrolled Students
              </span>
              <span className="text-xl font-black text-slate-900 font-mono tabular-nums">168</span>
              <span className="text-[10px] text-slate-500 block">Across 2 Batches</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Biometric Gateway
              </span>
              <span className="text-xl font-black text-emerald-600 font-mono">Active</span>
              <span className="text-[10px] text-slate-500 block">Terminal Synced</span>
            </div>
          </div>
        </div>

        {/* Faculty Subtabs */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'attendance'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Daily Attendance Entry
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'marks'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Internal Assessment & Marks
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'announcements'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Broadcast Class Notice & LMS
          </button>
          <button
            onClick={() => setActiveTab('workload')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'workload'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Teaching Workload & Timetable
          </button>
        </div>
      </div>

      {/* Attendance Entry View */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Course Attendance Entry & Biometric Verification
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Record today's class attendance. Submitting updates real-time student calculations and triggers automated warnings for deficit cases.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedCourseCode}
                onChange={(e) => setSelectedCourseCode(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
              >
                <option value="CS401">CS401 - Design & Analysis of Algorithms</option>
                <option value="CS404">CS404 - Formal Languages & Automata</option>
                <option value="CS305P">CS305P - Advanced Algorithms Lab</option>
              </select>

              <button
                onClick={markAllPresent}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Mark All Present
              </button>
            </div>
          </div>

          {attendanceSavedMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{attendanceSavedMessage}</span>
            </div>
          )}

          {/* Student Roster Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Roll Number</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Attendance History</th>
                  <th className="py-2.5 px-3 text-right">Today's Class Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roster.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {student.rollNo}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {student.name}
                      {student.rollNo === 'NU-2024-CS104' && (
                        <span className="ml-2 text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                          Shortage: 73.3%
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">
                      {student.rollNo === 'NU-2024-CS104' ? '33/45 (Needs 85%)' : '38/45 (Safe)'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() => toggleStudentStatus(student.id, 'Present')}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                            student.status === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStudentStatus(student.id, 'Absent')}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                            student.status === 'Absent'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStudentStatus(student.id, 'On Duty')}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                            student.status === 'On Duty'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          On Duty
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Terminal: Hall C-201 · Biometric Gateway Version 4.8
            </span>
            <button
              onClick={handleSaveAttendance}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 shadow-sm transition-colors"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Submit & Sync Daily Attendance</span>
            </button>
          </div>
        </div>
      )}

      {/* Marks Entry View */}
      {activeTab === 'marks' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Internal Continuous Assessment & Marks Entry
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mid-Term 1 (25), Mid-Term 2 (25), and Assignment Continuous Evaluation (10). Total internal weightage: <strong>40 Marks</strong>.
              </p>
            </div>
            <button
              onClick={handlePublishMarks}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              Publish Marks to Student Portals
            </button>
          </div>

          {marksSavedMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{marksSavedMessage}</span>
            </div>
          )}

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3 text-center">Mid-Term 1 (25)</th>
                  <th className="py-2.5 px-3 text-center">Mid-Term 2 (25)</th>
                  <th className="py-2.5 px-3 text-center">Continuous Lab/Assign (10)</th>
                  <th className="py-2.5 px-3 text-center">Scaled Internal (40)</th>
                  <th className="py-2.5 px-3 text-right">Projected Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roster.map((student) => {
                  // Internal scale: (Mid1 + Mid2)/50 * 30 + Assignment (10)
                  const rawMidTotal = (student.midTerm1 + student.midTerm2) / 50;
                  const scaledInternal = Math.round((rawMidTotal * 30 + student.internalAssignment) * 10) / 10;
                  const projectedTotal = Math.round(scaledInternal + 52); // Projecting nominal external
                  const gradeInfo = convertMarksToGrade(projectedTotal);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3 font-mono font-bold text-slate-800">{student.rollNo}</td>
                      <td className="py-2 px-3 font-medium text-slate-900">{student.name}</td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          value={student.midTerm1}
                          onChange={(e) => updateStudentMark(student.id, 'midTerm1', parseInt(e.target.value) || 0)}
                          className="w-16 text-center font-mono py-1 px-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-600"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          value={student.midTerm2}
                          onChange={(e) => updateStudentMark(student.id, 'midTerm2', parseInt(e.target.value) || 0)}
                          className="w-16 text-center font-mono py-1 px-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-600"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          value={student.internalAssignment}
                          onChange={(e) =>
                            updateStudentMark(student.id, 'internalAssignment', parseInt(e.target.value) || 0)
                          }
                          className="w-16 text-center font-mono py-1 px-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-600"
                        />
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">
                        {scaledInternal} / 40
                      </td>
                      <td className="py-2 px-3 text-right">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {gradeInfo.grade} ({gradeInfo.gradePoint} pts)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Announcements & LMS Moodle Sync */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Broadcast Classroom Announcement
            </h3>
            <p className="text-xs text-slate-500">
              Notifies all enrolled students across mobile alerts and the LMS dashboard.
            </p>

            <form onSubmit={handleSendAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Class</label>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => setSelectedCourseCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="CS401">CS401 - Design & Analysis of Algorithms (Batch A)</option>
                  <option value="CS404">CS404 - Formal Languages & Automata (Batch B)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Announcement Subject</label>
                <input
                  type="text"
                  value={announcementCategory}
                  onChange={(e) => setAnnouncementCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Message Content</label>
                <textarea
                  rows={4}
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Please note that the Dynamic Programming problem set submission deadline is extended to Thursday 11:59 PM..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              {announcementSent && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg font-medium">
                  Announcement broadcasted to 68 students and synced to Moodle LMS!
                </div>
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 shadow-sm transition-colors"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>Send Broadcast Alert</span>
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Moodle LMS Synchronization Hub
            </h3>
            <p className="text-xs text-slate-500">
              Connected to Nagarjuna College Of Engineering and Technology Moodle v4.2 Cloud Cluster.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Course Syllabus & Modules</span>
                  <span className="text-slate-500">8 Units · 24 Lecture Slides Synced</span>
                </div>
                <span className="text-emerald-700 font-semibold">Synced</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Assignment 2: Graph Traversals</span>
                  <span className="text-slate-500">65 / 68 Submissions Graded</span>
                </div>
                <span className="text-indigo-700 font-semibold font-mono">95.5% Done</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Online Quiz 3: Dynamic Programming</span>
                  <span className="text-slate-500">Scheduled for Friday 07:00 PM</span>
                </div>
                <span className="text-amber-700 font-semibold">Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workload View */}
      {activeTab === 'workload' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">
            Teaching Workload & Classroom Allocation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Workload</span>
              <span className="text-2xl font-black font-mono text-slate-900">16 Hrs/Week</span>
              <p className="text-xs text-slate-500 mt-1">Conforms with AICTE faculty norms (max 18 hrs)</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Classroom Allocated</span>
              <span className="text-2xl font-black font-mono text-slate-900">Hall C-201</span>
              <p className="text-xs text-slate-500 mt-1">Seating Capacity: 75 with AV Projector</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lab Allocation</span>
              <span className="text-2xl font-black font-mono text-slate-900">Lab B-104</span>
              <p className="text-xs text-slate-500 mt-1">Dell Precision Workstations with Ubuntu 24.04</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
