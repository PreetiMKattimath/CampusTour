import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  UserCheck,
  Users,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Phone,
  Building,
  User,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  initialRole: UserRole;
  onLoginSuccess: (role: UserRole, userName: string) => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole,
  onLoginSuccess,
  onBackToHome,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default placeholder identifiers based on selected role
  useEffect(() => {
    setErrorMsg('');
    if (selectedRole === 'student') {
      setIdentifier('NU-2024-CS104');
      setPassword('••••••••••••');
    } else if (selectedRole === 'faculty') {
      setIdentifier('EMP-CS-208');
      setPassword('••••••••••••');
    } else if (selectedRole === 'parent') {
      setIdentifier('NU-2024-CS104');
      setPassword('••••••');
    } else if (selectedRole === 'admin') {
      setIdentifier('ADMIN-DIR-001');
      setPassword('••••••••••••');
    }
  }, [selectedRole]);

  const handleQuickDemoFill = () => {
    setErrorMsg('');
    if (selectedRole === 'student') {
      setIdentifier('NU-2024-CS104');
      setPassword('Student@NU2026');
    } else if (selectedRole === 'faculty') {
      setIdentifier('EMP-CS-208');
      setPassword('Faculty@NU2026');
    } else if (selectedRole === 'parent') {
      setIdentifier('NU-2024-CS104');
      setPassword('Parent@7721');
    } else if (selectedRole === 'admin') {
      setIdentifier('ADMIN-DIR-001');
      setPassword('AdminDean@2026');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your University ID / Roll Number.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your account password or access PIN.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      let roleDefaultName = '';
      if (selectedRole === 'student') roleDefaultName = 'Student';
      else if (selectedRole === 'faculty') roleDefaultName = 'Faculty Member';
      else if (selectedRole === 'parent') roleDefaultName = 'Parent / Guardian';
      else if (selectedRole === 'admin') roleDefaultName = 'Administrator';

      onLoginSuccess(selectedRole, roleDefaultName);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6">
        {/* Top return link */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to University Home</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Institution Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20">
              <GraduationCap className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                Nagarjuna College Of Engineering and Technology
              </span>
              <span className="text-[10px] text-amber-300 block font-medium">
                Mudugurki, Venkatagiri Kote Post, Devanahalli, Bengaluru-562103
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                Centralized Authentication Gateway
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Secure access for students, faculty, parents, and administrative staff
              </p>
            </div>

            {/* Segmented Role Tabs inside card */}
            <div className="pt-2">
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all ${
                    selectedRole === 'student'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Student
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('faculty')}
                  className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all ${
                    selectedRole === 'faculty'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Faculty
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('parent')}
                  className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all ${
                    selectedRole === 'parent'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Parent
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 text-xs">
            {/* Dynamic Role Description */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                {selectedRole === 'student' && <GraduationCap className="w-4 h-4 text-indigo-600" />}
                {selectedRole === 'faculty' && <UserCheck className="w-4 h-4 text-emerald-600" />}
                {selectedRole === 'parent' && <Users className="w-4 h-4 text-amber-600" />}
                {selectedRole === 'admin' && <ShieldCheck className="w-4 h-4 text-blue-600" />}
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  {selectedRole === 'student' && 'Student Academic Portal'}
                  {selectedRole === 'faculty' && 'Faculty Instruction Portal'}
                  {selectedRole === 'parent' && 'Parent & Guardian Portal'}
                  {selectedRole === 'admin' && 'Central Administration Portal'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {selectedRole === 'student' &&
                  'Access flexible CBCS course cart, real-time biometric attendance, exam hall tickets, and online fee receipts.'}
                {selectedRole === 'faculty' &&
                  'Manage weekly teaching workload, student attendance registers, continuous assessment marks, and Moodle LMS.'}
                {selectedRole === 'parent' &&
                  'Monitor ward attendance shortages, automated notifications, semester grade cards, and fee balance payments.'}
                {selectedRole === 'admin' &&
                  'Configure departmental attendance policy rules, condonation approval queue, and external subsystem integrations.'}
              </p>
            </div>

            {/* Input 1: Identifier */}
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-slate-500 block">
                {selectedRole === 'student' && 'University Roll Number'}
                {selectedRole === 'faculty' && 'Faculty Employee ID'}
                {selectedRole === 'parent' && "Ward's Roll Number / Registered Mobile"}
                {selectedRole === 'admin' && 'Administrative ID'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    selectedRole === 'student'
                      ? 'e.g. NU-2024-CS104'
                      : selectedRole === 'faculty'
                      ? 'e.g. EMP-CS-208'
                      : selectedRole === 'parent'
                      ? 'e.g. NU-2024-CS104 or +91 98450 11993'
                      : 'e.g. ADMIN-DIR-001'
                  }
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white font-mono text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Faculty Department selector if faculty */}
            {selectedRole === 'faculty' && (
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-slate-500 block">
                  Academic Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white text-xs text-slate-900 font-medium"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Biotechnology & Bioinformatics">Biotechnology & Bioinformatics</option>
                    <option value="Applied Sciences & Physics">Applied Sciences & Physics</option>
                    <option value="Management Studies">Management Studies</option>
                  </select>
                </div>
              </div>
            )}

            {/* Input 2: Password / PIN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold uppercase tracking-wider text-slate-500">
                  {selectedRole === 'parent' ? 'Access PIN / OTP' : 'Account Password'}
                </label>
                <span className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security key"
                  className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 bg-white font-mono text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Demo Quick Fill helper button */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill Prototype Credentials</span>
              </button>

              <span className="text-[10px] text-slate-400 font-mono">
                SSL 256-Bit Encrypted
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'student'
                  ? 'bg-slate-900 hover:bg-slate-800'
                  : selectedRole === 'faculty'
                  ? 'bg-emerald-800 hover:bg-emerald-900'
                  : selectedRole === 'parent'
                  ? 'bg-amber-800 hover:bg-amber-900'
                  : 'bg-blue-900 hover:bg-blue-950'
              }`}
            >
              {isSubmitting ? (
                <span>Authenticating Identity...</span>
              ) : (
                <>
                  <span>Sign In to {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
            Nagarjuna College Of Engineering and Technology · Mudugurki, Devanahalli, Bengaluru-562103 · Digital Authentication System v4.8
          </div>
        </div>
      </div>
    </div>
  );
};
