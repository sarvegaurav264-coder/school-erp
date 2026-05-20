import { HiOutlineMenuAlt2, HiOutlineBell, HiOutlineSearch, HiOutlineLogout, HiOutlineUser } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-dark-900/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-dark-800 text-dark-400 hover:text-dark-200 transition-colors"
          >
            <HiOutlineMenuAlt2 className="w-6 h-6" />
          </button>

          {/* Search */}
          <div className={`${showSearch ? 'flex' : 'hidden md:flex'} items-center relative`}>
            <HiOutlineSearch className="absolute left-3 w-4 h-4 text-dark-500" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-64 lg:w-80 pl-10 pr-4 py-2.5 bg-dark-800/60 border border-dark-700/50 rounded-xl text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:border-primary-500/30 focus:ring-1 focus:ring-primary-500/20 transition-all"
            />
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden p-2 rounded-xl hover:bg-dark-800 text-dark-400"
          >
            <HiOutlineSearch className="w-5 h-5" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl hover:bg-dark-800 text-dark-400 hover:text-dark-200 transition-colors">
            <HiOutlineBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-rose rounded-full ring-2 ring-dark-900" />
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-dark-800 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-500/20">
                {getInitials(user?.name)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-dark-100 leading-tight">{user?.name || 'User'}</p>
                <p className="text-xs text-dark-500 capitalize">{user?.role || 'admin'}</p>
              </div>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-glass-lg border border-white/[0.08] py-2 animate-fade-in">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-semibold text-dark-100">{user?.name}</p>
                  <p className="text-xs text-dark-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-800/60 transition-colors"
                >
                  <HiOutlineUser className="w-4 h-4" />
                  Profile Settings
                </button>
                <div className="border-t border-white/[0.06] mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <HiOutlineLogout className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
