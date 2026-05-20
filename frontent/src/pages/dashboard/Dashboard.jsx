import { useState, useEffect } from 'react';
import { HiOutlineUserGroup, HiOutlineAcademicCap, HiOutlineBookOpen, HiOutlineCash, HiOutlineCalendar, HiOutlineSpeakerphone } from 'react-icons/hi';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../../components/common/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { dashboardService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await dashboardService.getStats();
      setStats(data.data);
    } catch {
      // Use fallback data if API fails
      setStats({
        totalStudents: 0, totalTeachers: 0, totalClasses: 0,
        totalFees: 0, collectedFees: 0, pendingFees: 0,
        genderDistribution: { Male: 0, Female: 0 },
        attendanceToday: { present: 0, absent: 0, late: 0, total: 0 },
        recentNotices: [], upcomingExams: [], monthlyEnrollment: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading dashboard..." />;

  const genderData = stats?.genderDistribution ? [
    { name: 'Male', value: stats.genderDistribution.Male || 0 },
    { name: 'Female', value: stats.genderDistribution.Female || 0 },
    { name: 'Other', value: stats.genderDistribution.Other || 0 }
  ].filter(d => d.value > 0) : [];

  const attendanceData = stats?.attendanceToday ? [
    { name: 'Present', value: stats.attendanceToday.present, color: '#10b981' },
    { name: 'Absent', value: stats.attendanceToday.absent, color: '#f43f5e' },
    { name: 'Late', value: stats.attendanceToday.late, color: '#f59e0b' }
  ].filter(d => d.value > 0) : [];

  const enrollmentData = stats?.monthlyEnrollment?.length ? stats.monthlyEnrollment.map(m => ({
    month: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m._id] || m._id,
    students: m.count
  })) : [
    { month: 'Jan', students: 12 }, { month: 'Feb', students: 18 }, { month: 'Mar', students: 15 },
    { month: 'Apr', students: 22 }, { month: 'May', students: 20 }, { month: 'Jun', students: 25 }
  ];

  const feeData = [
    { name: 'Collected', amount: stats?.collectedFees || 0 },
    { name: 'Pending', amount: stats?.pendingFees || 0 }
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-card px-4 py-3 border border-white/[0.08] rounded-xl shadow-glass-lg">
        <p className="text-sm font-medium text-dark-200 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs text-dark-400">
            <span style={{ color: p.color || p.fill }} className="font-medium">{p.name}: </span>
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Dashboard</h1>
          <p className="text-dark-400 text-sm mt-1">Welcome back, {user?.name || 'Admin'} 👋</p>
        </div>
        <div className="text-sm text-dark-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={HiOutlineUserGroup} color="blue" delay={0} />
        <StatCard title="Total Teachers" value={stats?.totalTeachers || 0} icon={HiOutlineAcademicCap} color="emerald" delay={100} />
        <StatCard title="Total Classes" value={stats?.totalClasses || 0} icon={HiOutlineBookOpen} color="violet" delay={200} />
        <StatCard title="Total Fees" value={stats?.totalFees || 0} icon={HiOutlineCash} color="amber" prefix="₹" delay={300} />
        <StatCard title="Collected" value={stats?.collectedFees || 0} icon={HiOutlineCash} color="cyan" prefix="₹" delay={400} />
        <StatCard title="Pending" value={stats?.pendingFees || 0} icon={HiOutlineCash} color="rose" prefix="₹" delay={500} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-bold text-dark-100 mb-4">Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={enrollmentData}>
              <defs>
                <linearGradient id="gradArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#475569" fontSize={12} />
              <YAxis stroke="#475569" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="students" stroke="#6366f1" fill="url(#gradArea)" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Collection */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-bold text-dark-100 mb-4">Fee Collection</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={feeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#475569" fontSize={12} />
              <YAxis stroke="#475569" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {feeData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#10b981' : '#f43f5e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gender Distribution */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="text-lg font-bold text-dark-100 mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={genderData.length ? genderData : [{ name: 'No Data', value: 1 }]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {(genderData.length ? genderData : [{ name: 'No Data', value: 1 }]).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Notices */}
        <div className="lg:col-span-2 glass-card p-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-dark-100">Recent Notices</h3>
            <HiOutlineSpeakerphone className="w-5 h-5 text-dark-500" />
          </div>
          <div className="space-y-3">
            {stats?.recentNotices?.length ? stats.recentNotices.map((notice, i) => (
              <div key={notice._id || i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-dark-800/40 transition-colors">
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                  notice.priority === 'urgent' ? 'bg-rose-400' :
                  notice.priority === 'high' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-200 truncate">{notice.title}</p>
                  <p className="text-xs text-dark-500 mt-0.5">
                    {new Date(notice.createdAt).toLocaleDateString()} • {notice.category}
                  </p>
                </div>
                <span className={`badge text-[10px] ${
                  notice.priority === 'urgent' ? 'badge-danger' :
                  notice.priority === 'high' ? 'badge-warning' : 'badge-success'
                }`}>
                  {notice.priority}
                </span>
              </div>
            )) : (
              <p className="text-sm text-dark-500 text-center py-8">No recent notices</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Exams */}
      {stats?.upcomingExams?.length > 0 && (
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-dark-100">Upcoming Exams</h3>
            <HiOutlineCalendar className="w-5 h-5 text-dark-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.upcomingExams.map((exam, i) => (
              <div key={exam._id || i} className="p-4 rounded-xl bg-dark-800/40 border border-dark-700/30 hover:border-primary-500/20 transition-colors">
                <p className="font-medium text-dark-200 text-sm">{exam.name}</p>
                <p className="text-xs text-dark-500 mt-1">
                  {exam.class?.name} {exam.class?.section} • {exam.subject?.name}
                </p>
                <p className="text-xs text-primary-400 mt-2 font-medium">
                  {new Date(exam.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
