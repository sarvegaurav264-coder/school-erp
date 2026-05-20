import CountUp from 'react-countup';

const StatCard = ({ title, value, icon: Icon, color = 'blue', trend, suffix = '', prefix = '', delay = 0 }) => {
  const colors = {
    blue: { bg: 'from-blue-600/20 to-blue-600/5', icon: 'bg-blue-500/15 text-blue-400 ring-blue-500/20', border: 'border-blue-500/10', glow: 'shadow-blue-500/10' },
    emerald: { bg: 'from-emerald-600/20 to-emerald-600/5', icon: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/20', border: 'border-emerald-500/10', glow: 'shadow-emerald-500/10' },
    violet: { bg: 'from-violet-600/20 to-violet-600/5', icon: 'bg-violet-500/15 text-violet-400 ring-violet-500/20', border: 'border-violet-500/10', glow: 'shadow-violet-500/10' },
    amber: { bg: 'from-amber-600/20 to-amber-600/5', icon: 'bg-amber-500/15 text-amber-400 ring-amber-500/20', border: 'border-amber-500/10', glow: 'shadow-amber-500/10' },
    rose: { bg: 'from-rose-600/20 to-rose-600/5', icon: 'bg-rose-500/15 text-rose-400 ring-rose-500/20', border: 'border-rose-500/10', glow: 'shadow-rose-500/10' },
    cyan: { bg: 'from-cyan-600/20 to-cyan-600/5', icon: 'bg-cyan-500/15 text-cyan-400 ring-cyan-500/20', border: 'border-cyan-500/10', glow: 'shadow-cyan-500/10' },
  };
  const c = colors[color] || colors.blue;

  return (
    <div className={`glass-card-hover p-5 border ${c.border} group animate-fade-in`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-dark-400">{title}</p>
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-lg text-dark-300">{prefix}</span>}
            <h3 className="text-3xl font-bold text-dark-50 tracking-tight">
              <CountUp end={typeof value === 'number' ? value : 0} duration={2} separator="," delay={delay / 1000} />
            </h3>
            {suffix && <span className="text-sm text-dark-400 ml-1">{suffix}</span>}
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
              <span className="text-dark-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.icon} ring-1 transition-transform duration-300 group-hover:scale-110`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
