import React from 'react';
import { X, Printer, ShieldCheck, Download, Calendar, MapPin, QrCode } from 'lucide-react';
import { StudentAcademicHistory, ExamScheduleItem } from '../../types';

interface HallTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentAcademicHistory;
  studentName: string;
  exams: ExamScheduleItem[];
}

export const HallTicketModal: React.FC<HallTicketModalProps> = ({
  isOpen,
  onClose,
  student,
  studentName,
  exams,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wide uppercase">
              Official University Examination Hall Ticket
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Hall Ticket</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hall Ticket Printable Content */}
        <div className="p-6 sm:p-8 space-y-6 print:p-0">
          {/* Institution Header */}
          <div className="text-center border-b border-slate-200 pb-5">
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500">
              Controller of Examinations · Academic Directorate
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1">
              NAGARJUNA COLLEGE OF ENGINEERING AND TECHNOLOGY
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Mudugurki, Venkatagiri Kote Post, Devanahalli, Bengaluru-562103 · Autonomous Institution
            </p>
            <p className="text-xs text-slate-600 mt-1">
              End-Semester Theory & Practical Examinations · December 2026
            </p>
          </div>

          {/* Student Identification & Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="sm:col-span-3 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Candidate Name</span>
                <span className="font-bold text-slate-900 text-sm">{studentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Roll Number</span>
                <span className="font-mono font-bold text-indigo-700 text-sm">{student.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Branch & Degree</span>
                <span className="font-medium text-slate-800">{student.degree} · {student.branch}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current Semester</span>
                <span className="font-semibold text-slate-800">Semester {student.currentSemester} (Regular)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Primary Examination Center</span>
                <span className="font-medium text-slate-800">Main Campus, Academic Complex North</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Admission Reg No</span>
                <span className="font-mono font-medium text-slate-800">{student.admissionNo}</span>
              </div>
            </div>

            {/* Verification Barcode / QR Simulation */}
            <div className="sm:col-span-1 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 pl-0 sm:pl-3">
              <div className="w-20 h-20 bg-white border border-slate-300 rounded-lg p-2 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-slate-900" />
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1">VERIFIED: ADM-2026</span>
            </div>
          </div>

          {/* Examination Schedule Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Course Schedule & Seating Allocation
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Date & Slot</th>
                    <th className="py-2.5 px-3">Course Code</th>
                    <th className="py-2.5 px-3">Subject Title</th>
                    <th className="py-2.5 px-3">Exam Hall</th>
                    <th className="py-2.5 px-3 text-right">Desk / Seat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-900">
                        <div>{exam.examDate}</div>
                        <div className="text-[10px] text-slate-500">{exam.timeSlot}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-indigo-700">
                        {exam.courseCode}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {exam.courseTitle}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {exam.hallNumber}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {exam.seatNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rules & Controller Signature */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div className="space-y-1">
              <p className="font-semibold text-slate-700">Important Instructions for Candidates:</p>
              <ul className="list-disc pl-4 text-[11px] space-y-0.5">
                <li>Candidates must be seated 15 minutes before exam commencement.</li>
                <li>Digital smart devices, notes, and programmable calculators are strictly prohibited.</li>
                <li>Must produce this Hall Ticket alongside University RFID Card upon request.</li>
              </ul>
            </div>

            <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="font-serif italic font-bold text-slate-800 text-sm">Controller of Examinations</div>
              <div className="text-[10px] uppercase font-semibold text-slate-500">
                Academic Directorate
              </div>
              <div className="text-[9px] text-emerald-600 font-semibold mt-0.5">
                Digital Security Seal Affixed
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
          >
            Download / Print
          </button>
        </div>
      </div>
    </div>
  );
};
