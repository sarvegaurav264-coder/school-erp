import { NavLink, useLocation } from 'react-router-dom';
import {
  HiOutlineHome, HiOutlineUserGroup, HiOutlineAcademicCap, HiOutlineBookOpen,
  HiOutlineClipboardList, HiOutlineCalendar, HiOutlineCash, HiOutlineSpeakerphone,
  HiOutlineClock, HiOutlineChartBar, HiOutlineCog, HiOutlineX
} from 'react-icons/hi';

const menuItems = [
  { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
  { path: '/students', icon: HiOutlineUserGroup, label: 'Students' },
  { path: '/teachers', icon: HiOutlineAcademicCap, label: 'Teachers' },
  { path: '/classes', icon: HiOutlineBookOpen, label: 'Classes' },
  { path: '/subjects', icon: HiOutlineChartBar, label: 'Subjects' },
  { path: '/attendance', icon: HiOutlineClipboardList, label: 'Attendance' },
  { path: '/exams', icon: HiOutlineCalendar, label: 'Exams' },
  { path: '/fees', icon: HiOutlineCash, label: 'Fees' },
  { path: '/notices', icon: HiOutlineSpeakerphone, label: 'Notices' },
  { path: '/timetable', icon: HiOutlineClock, label: 'Timetable' },
  { path: '/settings', icon: HiOutlineCog, label: 'Settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-[260px] bg-dark-900/95 backdrop-blur-xl
        border-r border-white/[0.06] flex flex-col
        transition-transform duration-300 ease-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <HiOutlineAcademicCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">School ERP</h1>
              <p className="text-[10px] text-dark-400 font-medium uppercase tracking-widest">Management</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-dark-800 text-dark-400">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 mb-3 text-[10px] font-semibold text-dark-500 uppercase tracking-widest">Main Menu</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-600/20 to-primary-600/5 text-primary-400 border border-primary-500/20 shadow-neon'
                    : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800/60'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-primary-400' : 'text-dark-500 group-hover:text-dark-300'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-lg shadow-primary-400/50" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="glass-card p-3 rounded-xl">
            <p className="text-xs text-dark-400 text-center">v1.0.0 — School ERP</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
