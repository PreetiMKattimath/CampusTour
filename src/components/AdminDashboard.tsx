import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  Settings,
  Activity,
  CheckCircle2,
  XCircle,
  FileText,
  Save,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Cpu,
  Layers,
  Send,
} from 'lucide-react';
import {
  CondonationRequest,
  DepartmentPolicy,
  ExternalIntegrationStatus,
  GrievanceTicket,
} from '../types';

interface AdminDashboardProps {
  adminName: string;
  department: string;
  condonationRequests: CondonationRequest[];
  onApproveCondonation: (id: string, notes: string) => void;
  onRejectCondonation: (id: string, notes: string) => void;
  departmentPolicies: DepartmentPolicy[];
  onUpdatePolicy: (code: string, newThreshold: number) => void;
  integrations: ExternalIntegrationStatus[];
  grievances: GrievanceTicket[];
  onResolveGrievance: (id: string, resolutionNotes: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminName,
  department,
  condonationRequests,
  onApproveCondonation,
  onRejectCondonation,
  departmentPolicies,
  onUpdatePolicy,
  integrations,
  grievances,
  onResolveGrievance,
}) => {
  const [activeTab, setActiveTab] = useState<'policies' | 'condonations' | 'integrations' | 'grievances' | 'sprint'>('condonations');
  const [editingPolicies, setEditingPolicies] = useState<Record<string, number>>(
    departmentPolicies.reduce((acc, p) => ({ ...acc, [p.code]: p.attendanceThreshold }), {})
  );
  const [policySavedMsg, setPolicySavedMsg] = useState('');

  // Review state
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('Approved per Academic Regulation Clause 4.2 upon verified certification.');

  // Stakeholder Feedback Form (Case Study Change 5 / Section 4)
  const [stakeholderFeedback, setStakeholderFeedback] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState<'Student' | 'Faculty' | 'Parent' | 'Management'>('Student');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handlePolicyChange = (code: string, val: number) => {
    setEditingPolicies((prev) => ({ ...prev, [code]: val }));
  };

  const handleSavePolicies = () => {
    Object.entries(editingPolicies).forEach(([code, val]) => {
      onUpdatePolicy(code, val);
    });
    setPolicySavedMsg('Departmental attendance & evaluation policies successfully updated across all modules!');
    setTimeout(() => setPolicySavedMsg(''), 4000);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stakeholderFeedback.trim()) return;
    setFeedbackSubmitted(true);
    setStakeholderFeedback('');
    setTimeout(() => setFeedbackSubmitted(false), 4000);
  };

  const pendingCondonations = condonationRequests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Administrator Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>{department}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-blue-800">Academic & Systems Controller</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                {adminName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span>Central University Administration</span>
                <span aria-hidden="true">·</span>
                <span>Active Semester: 2026-2027 Odd</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-semibold">All 5 Core Subsystems Synced</span>
              </div>
            </div>
          </div>

          {/* Central System Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6 text-center">
            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Total Students
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">4,850</span>
              <span className="text-[10px] text-slate-500 block">Across 6 Depts</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Faculty Strength
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">310</span>
              <span className="text-[10px] text-slate-500 block">Active Instructors</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Pending Condonations
              </span>
              <span
                className={`text-xl font-black font-mono ${
                  pendingCondonations.length > 0 ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {pendingCondonations.length}
              </span>
              <span className="text-[10px] text-slate-500 block">Needs Approval</span>
            </div>

            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                External Systems
              </span>
              <span className="text-xl font-black text-emerald-600 font-mono">5 / 5</span>
              <span className="text-[10px] text-slate-500 block">100% Operational</span>
            </div>
          </div>
        </div>

        {/* Admin Navigation Subtabs */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('condonations')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'condonations'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Condonation Queue ({pendingCondonations.length})
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'policies'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Department Policies
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'integrations'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            External Integrations
          </button>
          <button
            onClick={() => setActiveTab('grievances')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'grievances'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Grievances ({grievances.length})
          </button>
          <button
            onClick={() => setActiveTab('sprint')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'sprint'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Agile Sprints & Feedback
          </button>
        </div>
      </div>

      {/* Condonation Approvals Queue */}
      {activeTab === 'condonations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Attendance Condonation Approval Directorate
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review student condonation applications submitted with medical, sports, or hackathon representation documentation.
            </p>
          </div>

          <div className="space-y-4">
            {condonationRequests.map((req) => (
              <div
                key={req.id}
                className={`p-5 rounded-xl border space-y-4 transition-all ${
                  req.status === 'pending'
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-xs">{req.id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-slate-800 text-sm">{req.studentName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-indigo-700 text-xs">{req.rollNo}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Subject: <strong>{req.subjectCode} - {req.subjectTitle}</strong> · Category: {req.reasonCategory}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance</span>
                    <span className="font-mono font-black text-amber-700 text-sm">
                      {req.currentAttendance}% (Req: {req.requiredThreshold}%)
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <span className="font-semibold text-slate-900 block">Student Justification:</span>
                  <p className="bg-white p-3 rounded-lg border border-slate-200 text-slate-600 leading-relaxed">
                    {req.justification}
                  </p>
                  <span className="text-[11px] text-slate-500 block pt-1">
                    Attached Document: <strong className="text-indigo-700">{req.documentName}</strong>
                  </span>
                </div>

                {req.status === 'pending' ? (
                  <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Enter review remarks..."
                      defaultValue="Approved under Academic Regulation Clause 4.2 upon verified certification."
                      id={`remark-${req.id}`}
                      className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white flex-1"
                    />

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          const input = document.getElementById(`remark-${req.id}`) as HTMLInputElement;
                          onRejectCondonation(req.id, input?.value || 'Insufficient justification.');
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => {
                          const input = document.getElementById(`remark-${req.id}`) as HTMLInputElement;
                          onApproveCondonation(req.id, input?.value || 'Approved by Dean Academics.');
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Approve Condonation
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Decision: <strong>{req.status.toUpperCase()}</strong> on {req.decisionDate || 'Nov 04, 2026'}
                    </span>
                    <span className="text-emerald-700 font-medium">Remarks: {req.reviewNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Department Policy Manager (Case Study Change 4) */}
      {activeTab === 'policies' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Departmental Policy Configuration (Case Study Change 4)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The university introduced varying attendance and evaluation thresholds across departments (e.g. CSE 85% vs Mechanical 75%).
              </p>
            </div>
            <button
              onClick={handleSavePolicies}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Save & Propagate Policies</span>
            </button>
          </div>

          {policySavedMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{policySavedMsg}</span>
            </div>
          )}

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Department Code</th>
                  <th className="py-2.5 px-3">Academic Department</th>
                  <th className="py-2.5 px-3 text-center">Mandatory Attendance Threshold</th>
                  <th className="py-2.5 px-3 text-center">Internal Weight</th>
                  <th className="py-2.5 px-3 text-center">Semester End Weight</th>
                  <th className="py-2.5 px-3 text-right">Max Condonation Grace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departmentPolicies.map((pol) => (
                  <tr key={pol.code} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">{pol.code}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{pol.name}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editingPolicies[pol.code] ?? pol.attendanceThreshold}
                          onChange={(e) => handlePolicyChange(pol.code, parseInt(e.target.value) || 75)}
                          className="w-16 font-mono font-bold text-center py-1 px-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-600 bg-white"
                        />
                        <span className="font-bold text-slate-600">%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-700">
                      {pol.internalMarksWeight}%
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-700">
                      {pol.semesterEndWeight}%
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                      {pol.condonationGraceLimit}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* External Integrations Console (Case Study Change 2) */}
      {activeTab === 'integrations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                External Systems & API Integration Console (Case Study Change 2)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring biometric hardware, payment gateways, Moodle LMS, scholarship portals, and campus placements.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> All Endpoints Healthy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">{item.name}</h4>
                    <span className="text-xs font-mono text-indigo-700 font-semibold">{item.provider}</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Synced Records: {item.syncedRecords.toLocaleString()}</span>
                  <span>Last Ping: {item.lastPing}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grievance Management Audit */}
      {activeTab === 'grievances' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-900">
            Student Grievance Audit & Resolution Portal
          </h2>

          <div className="space-y-4">
            {grievances.map((g) => (
              <div key={g.id} className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-slate-900">{g.id}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-700">{g.studentName} ({g.rollNo})</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-indigo-700 font-medium">{g.category}</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg">
                    {g.status}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{g.subject}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{g.description}</p>

                {g.status !== 'Resolved' && (
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        onResolveGrievance(
                          g.id,
                          'Resolved by Dean Academics: System log verified and issue corrected.'
                        )
                      }
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Mark as Resolved & Notify Student
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agile Sprint Release Delivery & Feedback (Case Study Change 5 & Section 4) */}
      {activeTab === 'sprint' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Agile Release Delivery Board (Case Study Section 4 & 5)
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Sprint 12 Deployment Status & Rollout
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Addressing stakeholder demand for frequent iterations, feedback loops, and feature rollouts without complete redesigns.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-emerald-950 font-bold">Release 2.4 - Flexible CBCS Course Cart</strong>
                  <span className="text-emerald-700 font-semibold text-[10px]">Deployed Live</span>
                </div>
                <p className="text-emerald-800">
                  Added support for interdisciplinary courses, credit bounds checking, and instant elective drop/add.
                </p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-emerald-950 font-bold">Release 2.3 - Attendance Condonation Workflow</strong>
                  <span className="text-emerald-700 font-semibold text-[10px]">Deployed Live</span>
                </div>
                <p className="text-emerald-800">
                  Automated notifications for low attendance below departmental thresholds (85% CSE) and Dean approval portal.
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-slate-900 font-bold">Release 2.5 - Biometric IoT Real-Time Webhooks</strong>
                  <span className="text-amber-700 font-semibold text-[10px]">Staging Testing</span>
                </div>
                <p className="text-slate-600">
                  Direct push notifications to parents when RFID card is tapped at campus gate.
                </p>
              </div>
            </div>
          </div>

          {/* Stakeholder Continuous Feedback Collection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Continuous Stakeholder Feedback Collection
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                "Feedback should be collected after every release." (Case Study Change 5)
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Stakeholder Persona</label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Student">Student Feedback</option>
                  <option value="Faculty">Faculty Feedback</option>
                  <option value="Parent">Parent Feedback</option>
                  <option value="Management">University Management Feedback</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Release Feedback / Suggestion</label>
                <textarea
                  rows={4}
                  value={stakeholderFeedback}
                  onChange={(e) => setStakeholderFeedback(e.target.value)}
                  placeholder="Share feedback on newly released features, usability, or requested improvements..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              {feedbackSubmitted && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg font-medium">
                  Stakeholder feedback recorded and logged in the Sprint Retrospective backlog!
                </div>
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Submit Release Feedback</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
