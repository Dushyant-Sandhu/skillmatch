import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Compass,
  FileText,
  User,
  PlusCircle,
  Bell,
  CheckCheck,
  Menu,
  X,
  Sparkles,
  Flame,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { Notification } from '../../types';

export const Navbar: React.FC = () => {
  const { user, role, unreadCount, refreshNotifications } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notifsOpen) {
      api.getNotifications()
        .then((res) => setNotifications(res.notifications))
        .catch((e) => console.error(e));
    }
  }, [notifsOpen]);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    refreshNotifications();
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read) {
      await api.markNotificationRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
      refreshNotifications();
    }
    setNotifsOpen(false);
  };

  const isStudent = role === 'student';

  const navLinks = isStudent
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: Layers },
        { label: 'Discover', path: '/discover', icon: Compass },
        { label: 'Projects', path: '/projects', icon: Briefcase },
        { label: 'Applications', path: '/applications', icon: FileText },
        { label: 'Workspace', path: '/workspace/proj-1', icon: Flame },
        { label: 'Profile', path: `/profile/${user?.id || 'student-1'}`, icon: User },
      ]
    : [
        { label: 'Client Dashboard', path: '/client', icon: Layers },
        { label: 'Post a Project', path: '/client/post-project', icon: PlusCircle },
        { label: 'Applicants', path: '/projects/proj-1/applicants', icon: FileText },
        { label: 'Browse Talent', path: '/students', icon: User },
        { label: 'Workspace', path: '/workspace/proj-1', icon: Flame },
      ];

  return (
    <header className="sticky top-[41px] z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-brand-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
                    SkillMatch
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    MVP
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide -mt-0.5 hidden sm:block">
                  Work. Collaborate. Grow.
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path || (item.path.startsWith('/profile') && location.pathname.startsWith('/profile'));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      active
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-80" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifsOpen(!notifsOpen)}
                className="relative p-2 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-fuchsia-500 ring-2 ring-slate-950 animate-pulse" />
                )}
              </button>

              {/* Notifications Box */}
              {notifsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-2xl py-3 px-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 text-xs">
                        No notifications yet. You're all caught up!
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          to={n.link || '#'}
                          onClick={() => handleNotificationClick(n)}
                          className={`block p-2.5 rounded-xl text-left transition ${
                            n.read
                              ? 'bg-slate-950/40 hover:bg-slate-800/50 text-slate-400'
                              : 'bg-indigo-950/40 hover:bg-indigo-900/50 text-slate-200 border border-indigo-500/20'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="font-semibold text-xs text-slate-100 flex items-center gap-1">
                              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />}
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-500 whitespace-nowrap">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                            {n.message}
                          </p>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Role Badge */}
            {user ? (
              <Link
                to={isStudent ? `/profile/${user.id}` : '/client'}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-900/80 transition border border-transparent hover:border-slate-800"
              >
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {user.full_name}
                  </div>
                  <div className="text-[10px] font-medium text-slate-400 capitalize">
                    {user.role} {user.role === 'student' && user.overall_rating ? `• ${user.overall_rating} ★` : ''}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-2 rounded-xl text-slate-300 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  active
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 opacity-80" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
