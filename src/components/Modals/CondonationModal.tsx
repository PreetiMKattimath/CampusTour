import React, { useState } from 'react';
import { X, FileText, AlertTriangle, CheckCircle2, Upload, HelpCircle } from 'lucide-react';
import { SubjectAttendance, CondonationRequest } from '../../types';
import { evaluateCondonation } from '../../utils/academicCalculations';

interface CondonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceList: SubjectAttendance[];
  studentName: string;
  rollNo: string;
  onSubmit: (request: Omit<CondonationRequest, 'id' | 'submissionDate' | 'status'>) => void;
}

export const CondonationModal: React.FC<CondonationModalProps> = ({
  isOpen,
  onClose,
  attendanceList,
  studentName,
  rollNo,
  onSubmit,
}) => {
  // Filter subjects that might need attention or pick first subject
  const defaultSubject = attendanceList.find((s) => s.percentage < s.departmentThreshold) || attendanceList[0];

  const [selectedSubjectId, setSelectedSubjectId] = useState(defaultSubject?.subjectId || '');
  const [reasonCategory, setReasonCategory] = useState<
    'Medical Emergency' | 'University Sports' | 'Academic Hackathon' | 'Family Bereavement'
  >('Academic Hackathon');
  const [justification, setJustification] = useState(
    'Represented Nagarjuna College Of Engineering and Technology at the National Inter-University Smart India Hackathon Grand Finale in New Delhi with prior Dean clearance.'
  );
  const [fileName, setFileName] = useState('Official_Attendance_Duty_Certificate.pdf');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentSubject = attendanceList.find((s) => s.subjectId === selectedSubjectId) || defaultSubject;
  const evaluation = currentSubject
    ? evaluateCondonation(currentSubject.percentage, currentSubject.departmentThreshold, Boolean(fileName))
    : { eligible: true, shortage: 0, reason: '' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) {
      setErrorMsg('Please provide a detailed justification for attendance condonation.');
      return;
    }
    if (!fileName) {
      setErrorMsg('Supporting official documentation is mandatory for condonation consideration.');
      return;
    }

    if (!currentSubject) return;

    onSubmit({
      studentId: 'u-std-104',
      studentName,
      rollNo,
      subjectCode: currentSubject.courseCode,
      subjectTitle: currentSubject.courseTitle,
      currentAttendance: currentSubject.percentage,
      requiredThreshold: currentSubject.departmentThreshold,
      shortage: Math.max(0, currentSubject.departmentThreshold - currentSubject.percentage),
      reasonCategory,
      justification,
      documentName: fileName,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wide uppercase">
              Apply for Attendance Condonation
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Policy Context Alert */}
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-blue-900 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Academic Regulation Clause 4.2:</span>
              <p className="text-[11px] leading-relaxed text-blue-800">
                Department attendance policy requires minimum {currentSubject?.departmentThreshold}% attendance. 
                Under special grounds (medical or university sports/hackathons), up to 10% shortage may be condoned by the Academic Council upon verified documentation.
              </p>
            </div>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Select Course
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white font-medium"
            >
              {attendanceList.map((subj) => (
                <option key={subj.subjectId} value={subj.subjectId}>
                  {subj.courseCode} - {subj.courseTitle} (Current: {subj.percentage}% / Req: {subj.departmentThreshold}%)
                </option>
              ))}
            </select>
          </div>

          {/* Attendance Status Snapshot */}
          {currentSubject && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Attended</span>
                <p className="font-bold text-slate-800 text-sm font-mono">
                  {currentSubject.attendedClasses} / {currentSubject.totalClasses}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Your Attendance</span>
                <p
                  className={`font-bold text-sm font-mono ${
                    currentSubject.percentage < currentSubject.departmentThreshold
                      ? 'text-red-600'
                      : 'text-emerald-600'
                  }`}
                >
                  {currentSubject.percentage}%
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Department Minimum</span>
                <p className="font-bold text-slate-800 text-sm font-mono">
                  {currentSubject.departmentThreshold}%
                </p>
              </div>
            </div>
          )}

          {/* Grounds / Reason Category */}
          <div>
            <label className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Grounds for Condonation
            </label>
            <select
              value={reasonCategory}
              onChange={(e) =>
                setReasonCategory(e.target.value as CondonationRequest['reasonCategory'])
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white font-medium"
            >
              <option value="Academic Hackathon">Academic Competition / National Hackathon</option>
              <option value="Medical Emergency">Medical Emergency / Hospitalization</option>
              <option value="University Sports">Official University Sports / Athletics</option>
              <option value="Family Bereavement">Family Bereavement / Unavoidable Personal Crisis</option>
            </select>
          </div>

          {/* Detailed Justification */}
          <div>
            <label className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Detailed Academic Statement
            </label>
            <textarea
              rows={3}
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Explain the circumstances, relevant dates, and faculty/dean prior approvals..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
            />
          </div>

          {/* Supporting Document Upload Simulation */}
          <div>
            <label className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Upload Verified Certificate / Duty Slip (PDF)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <div className="font-medium text-slate-700">
                {fileName ? (
                  <span className="text-emerald-700 font-semibold">{fileName}</span>
                ) : (
                  <span>Click to attach certificate or attendance duty order</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Maximum file size: 5MB · Official PDF / JPEG</p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-sm transition-colors"
            >
              Submit Application to Dean
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
