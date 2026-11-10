import React from 'react';
import {
  GraduationCap,
  UserCheck,
  Users,
  ShieldCheck,
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  Fingerprint,
  Layers,
  Award,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Clock,
  Sparkles,
  Search,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Compass,
  Lock,
} from 'lucide-react';
import { UserRole } from '../types';

interface HomepageProps {
  onOpenLogin: (role: UserRole) => void;
}

export const Homepage: React.FC<HomepageProps> = ({ onOpenLogin }) => {
  return (
    <div className="space-y-12">
      {/* Institutional Announcement Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-sm tracking-wider shrink-0">
            Official Circular
          </span>
          <span className="truncate text-slate-200">
            December 2026 End-Semester Examination Schedules Published & Hall Ticket Issuance Active · Flexible CBCS Course Add/Drop Closes Friday
          </span>
        </div>
        <button
          onClick={() => onOpenLogin('student')}
          className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 shrink-0 transition-colors"
        >
          <span>Student Login & Hall Tickets</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50/60 via-slate-50 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-slate-500 block">
                NAGARJUNA COLLEGE OF ENGINEERING AND TECHNOLOGY · ESTABLISHED 2001
              </span>
              <span className="text-xs font-semibold text-emerald-800">
                Mudugurki, Venkatagiri Kote Post, Devanahalli, Bengaluru-562103 · Autonomous Institution
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Academic & Administrative Management Portal
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
              Nagarjuna College Of Engineering and Technology’s centralized digital campus ecosystem empowering students, faculty, parents, and administrators with flexible credit course choice (CBCS), biometric attendance governance, transparent examination grading, automated fee reconciliation, and grievance redressal.
            </p>
          </div>

          {/* Quick Launch Action Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenLogin('student')}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Student Portal Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onOpenLogin('faculty')}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>Faculty & Staff Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onOpenLogin('parent')}
              className="flex items-center gap-2 px-5 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>Parent & Guardian Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onOpenLogin('admin')}
              className="flex items-center gap-2 px-5 py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-blue-300" />
              <span>Administrator Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>
      </div>

      {/* 4 Interactive Stakeholder Portals Showcase */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Integrated University Governance
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            Dedicated Stakeholder Gateways
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Select your university stakeholder role to authenticate and access your dedicated workspace and tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Student Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">
                  Scholar Suite
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Student Portal</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Undergraduate & Postgraduate Scholars
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Flexible CBCS Elective Cart (20-28 Credits)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Biometric Attendance & Condonation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Official Dec 2026 Hall Ticket & Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Online Fees with Govt NSP Scholarship Offset</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenLogin('student')}
              className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Login to Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Faculty Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Instruction & Research
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Faculty Portal</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Teaching Faculty, Instructors & Mentors
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Weekly Workload: 12h Theory + 4h Lab</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>One-Click Class Attendance Marker</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Continuous Mid-Term & Internal Grading</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Moodle LMS v4.2 Synchronizer</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenLogin('faculty')}
              className="mt-6 w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-300" />
              <span>Login to Faculty Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Parent Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Guardian Supervision
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Parent Portal</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Parents & Registered Guardians
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Automated Low Attendance Shortage Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Ward's Cumulative CGPA & Marks Cards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Online Fee Payment on Behalf of Ward</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct Communication with Faculty Mentor</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenLogin('parent')}
              className="mt-6 w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Login to Parent Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Admin Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider">
                  Academic Governance
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Administrator Portal</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Academic Directorate & Deans
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Department Attendance Policy Tuner (85% CSE)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Attendance Condonation Approval Queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>5 External Subsystem Health Monitors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Agile Sprint Delivery & Stakeholder Feedback</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenLogin('admin')}
              className="mt-6 w-full py-2.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-blue-300" />
              <span>Login to Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* University Institutional Pillars & Statistics */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-md">
        <div className="max-w-4xl space-y-2">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
            Nagarjuna College Of Engineering and Technology at a Glance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Pillars of Academic Rigor, Research & Governance
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Located at Mudugurki, Venkatagiri Kote Post, Devanahalli, Bengaluru-562103, NCET is an autonomous engineering institution fostering excellence across Computer Science, Electronics, Mechanical, and emerging engineering disciplines.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 border-t border-slate-800 pt-8 text-center">
          <div className="p-2 space-y-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">4,850+</span>
            <span className="text-[11px] text-slate-400 block font-medium">Enrolled Scholars</span>
          </div>

          <div className="p-2 space-y-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">310+</span>
            <span className="text-[11px] text-slate-400 block font-medium">Doctoral Faculty</span>
          </div>

          <div className="p-2 space-y-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tabular-nums">A++</span>
            <span className="text-[11px] text-slate-400 block font-medium">NAAC Accreditation</span>
          </div>

          <div className="p-2 space-y-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">48</span>
            <span className="text-[11px] text-slate-400 block font-medium">Biometric IoT Readers</span>
          </div>

          <div className="p-2 space-y-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">94.2%</span>
            <span className="text-[11px] text-slate-400 block font-medium">Campus Placement Rate</span>
          </div>

          <div className="p-2 space-y-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tabular-nums">₹4.2 Cr</span>
            <span className="text-[11px] text-slate-400 block font-medium">Govt. NSP Scholarships</span>
          </div>
        </div>
      </div>

      {/* Flexible CBCS Academic Highlights (Case Study Change 1) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 block">
              Flexible Credit-Based Choice System (CBCS)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              Interdisciplinary Academic Electives
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Nagarjuna College Of Engineering and Technology students can cross-register for cutting-edge courses from Biotechnology, Physics, and Management, earning valid semester credits toward their honors degree.
            </p>
          </div>

          <button
            onClick={() => onOpenLogin('student')}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition-colors shrink-0"
          >
            <span>Explore Course Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Biotechnology & Genomics</span>
            <h4 className="font-bold text-slate-900 text-sm">AI in Healthcare & Computational Biology</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Applying deep neural architectures to genomic sequences, medical image segmentation, and EHR informatics.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Code: OE-BT31</span>
              <span className="font-bold text-indigo-700">3 Credits</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Physics & Quantum Sciences</span>
            <h4 className="font-bold text-slate-900 text-sm">Quantum Computing Foundations & Qubits</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Superposition, quantum entanglement, Shor's factorization algorithm, and IBM Qiskit circuit simulations.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Code: OE-PH32</span>
              <span className="font-bold text-indigo-700">3 Credits</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Management & Finance</span>
            <h4 className="font-bold text-slate-900 text-sm">Financial Econometrics & Algorithmic Trading</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Time-series statistical modeling, Black-Scholes asset valuation, and algorithmic portfolio risk optimization.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Code: OE-MS33</span>
              <span className="font-bold text-indigo-700">3 Credits</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
