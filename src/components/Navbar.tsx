import React from 'react';
import {
  GraduationCap,
  Bell,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  UserCheck,
  Users,
  Building2,
  ChevronDown,
  Home,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { UserRole, UserProfile, UniversityNotification } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  isHome: boolean;
  isLogin: boolean;
  onGoHome: () => void;
  onOpenLogin: (role: UserRole) => void;
  onRoleChange: (role: UserRole) => void;
  onSignOut: () => void;
  userProfile: UserProfile;
  notifications: UniversityNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  availableTabs: { id: string; label: string }[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  isHome,
  isLogin,
  onGoHome,
  onOpenLogin,
  onRoleChange,
  onSignOut,
  userProfile,
  notifications,
  onMarkNotificationAsRead,
  activeTab,
  onTabChange,
  availableTabs,
}) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isAuthenticated = !isHome && !isLogin;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Bar Contract: 3 Zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark with Institutional Crest */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-3 shrink-0 text-left focus:outline-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-slate-800 transition-colors">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
                Nagarjuna College Of Engineering and Technology
              </span>
              <span className="text-[11px] text-slate-500 font-medium block whitespace-nowrap">
                NCET · Autonomous Institution · Bengaluru-562103
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-2">
            <button
              onClick={onGoHome}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                isHome
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>University Home</span>
            </button>

            {isAuthenticated && availableTabs.length > 0 && (
              <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />
            )}

            {/* Dashboard Subtabs if authenticated */}
            {isAuthenticated &&
              availableTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}

            {/* Public or Login Page Links */}
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => onOpenLogin('student')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isLogin && currentRole === 'student'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Student Login
                </button>
                <button
                  onClick={() => onOpenLogin('faculty')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isLogin && currentRole === 'faculty'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Faculty Login
                </button>
                <button
                  onClick={() => onOpenLogin('parent')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isLogin && currentRole === 'parent'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Parent Login
                </button>
                <button
                  onClick={() => onOpenLogin('admin')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isLogin && currentRole === 'admin'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Admin Login
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Role Switcher & User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Portal Switcher Dropdown - Only shown when authenticated in a portal */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  aria-label="Switch User Portal Persona"
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors whitespace-nowrap shrink-0"
                >
                  {currentRole === 'student' && <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />}
                  {currentRole === 'faculty' && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  {currentRole === 'parent' && <Users className="w-3.5 h-3.5 text-amber-600" />}
                  {currentRole === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
                  <span className="capitalize">{currentRole} Portal</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      University Gateways
                    </span>
                    <span className="text-[10px] text-slate-400">Login or Switch</span>
                  </div>

                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        onRoleChange('student');
                      } else {
                        onOpenLogin('student');
                      }
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === 'student' && !isHome ? 'bg-indigo-50/70 font-semibold text-indigo-900' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Student Portal</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Undergraduate & Postgraduate Scholars</div>
                    </div>
                    {currentRole === 'student' && !isHome && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>

                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        onRoleChange('faculty');
                      } else {
                        onOpenLogin('faculty');
                      }
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === 'faculty' && !isHome ? 'bg-emerald-50/70 font-semibold text-emerald-900' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Faculty Portal</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Department Teaching & Research Faculty</div>
                    </div>
                    {currentRole === 'faculty' && !isHome && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        onRoleChange('parent');
                      } else {
                        onOpenLogin('parent');
                      }
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === 'parent' && !isHome ? 'bg-amber-50/70 font-semibold text-amber-900' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                        <span>Parent Portal</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Ward Supervision & Fee Payments</div>
                    </div>
                    {currentRole === 'parent' && !isHome && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                  </button>

                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        onRoleChange('admin');
                      } else {
                        onOpenLogin('admin');
                      }
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      currentRole === 'admin' && !isHome ? 'bg-blue-50/70 font-semibold text-blue-900' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Administrator Portal</span>
                      </div>
                      <div className="text-[11px] text-slate-500">Academic Council & Dean Directorate</div>
                    </div>
                    {currentRole === 'admin' && !isHome && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                </div>
              )}
            </div>
            )}

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label={`University Notifications (${unreadCount} unread)`}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">University Notifications</h4>
                      <p className="text-xs text-slate-500">Real-time alerts and circulars</p>
                    </div>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => onMarkNotificationAsRead(notif.id)}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {notif.severity === 'danger' && (
                            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          )}
                          {notif.severity === 'warning' && (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          )}
                          {notif.severity === 'success' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          {notif.severity === 'info' && (
                            <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          )}

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-900">{notif.title}</span>
                              <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill & Sign In / Out Action */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {userProfile.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-semibold text-slate-900 block leading-tight">
                    {userProfile.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    {userProfile.identifier}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  title="Sign Out to University Home"
                  aria-label="Sign Out"
                  className="p-1.5 ml-1 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenLogin('student')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Portal Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar - Only for dashboard subtabs when logged in */}
      {isAuthenticated && availableTabs.length > 0 && (
        <div className="lg:hidden border-t border-slate-100 bg-slate-50/80 px-4 py-2 overflow-x-auto flex items-center gap-1.5">
          {availableTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
