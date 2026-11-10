import React, { useState } from 'react';
import { X, MessageSquare, AlertCircle, Shield, Check } from 'lucide-react';
import { GrievanceTicket } from '../../types';

interface NewGrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  rollNo: string;
  onSubmit: (ticket: Omit<GrievanceTicket, 'id' | 'submittedAt' | 'status' | 'timeline'>) => void;
}

export const NewGrievanceModal: React.FC<NewGrievanceModalProps> = ({
  isOpen,
  onClose,
  studentName,
  rollNo,
  onSubmit,
}) => {
  const [category, setCategory] = useState<GrievanceTicket['category']>('Attendance & Biometrics');
  const [priority, setPriority] = useState<GrievanceTicket['priority']>('High');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setErrorMsg('Please enter both subject and description.');
      return;
    }

    onSubmit({
      studentId: 'u-std-104',
      studentName: isAnonymous ? 'Confidential Student' : studentName,
      rollNo: isAnonymous ? 'REDACTED' : rollNo,
      category,
      priority,
      subject,
      description,
      isAnonymous,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wide uppercase">
              Lodge Student Grievance / Redressal Request
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Grievance Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GrievanceTicket['category'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white font-medium"
              >
                <option value="Attendance & Biometrics">Attendance & Biometrics</option>
                <option value="Academic">Academic Curriculum & Teaching</option>
                <option value="Examination & Evaluation">Examination & Evaluation</option>
                <option value="Hostel & Mess">Hostel & Mess Facilities</option>
                <option value="Infrastructure">Campus Infrastructure & Wi-Fi</option>
              </select>
            </div>

            <div>
              <label className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Urgency Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as GrievanceTicket['priority'])}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white font-medium"
              >
                <option value="Low">Low - General Feedback</option>
                <option value="Medium">Medium - Regular Resolution</option>
                <option value="High">High - Impairing Academic Studies</option>
                <option value="Urgent">Urgent - Immediate Dean Intervention</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Complaint Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Biometric terminal failed to log punch for CS401 on Nov 07"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white text-xs"
            />
          </div>

          <div>
            <label className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Detailed Description & Evidence
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Provide exact classroom, date, faculty involved, device identifier, or relevant specifics..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-white"
            />
          </div>

          {/* Anonymous Option */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="font-semibold text-slate-800 block">Submit Anonymously</span>
                <span className="text-[10px] text-slate-500">
                  Your identity and roll number will be concealed from departmental staff.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 rounded-sm text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

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
              Submit Grievance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
