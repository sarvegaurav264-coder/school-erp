import { useState, useEffect } from 'react';
import { HiOutlineSave } from 'react-icons/hi';
import { timetableService, classService, subjectService, teacherService } from '../../services/dataService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const defaultPeriods = [
  { periodNumber: 1, startTime: '08:00', endTime: '08:45', subject: '', teacher: '' },
  { periodNumber: 2, startTime: '08:45', endTime: '09:30', subject: '', teacher: '' },
  { periodNumber: 3, startTime: '09:45', endTime: '10:30', subject: '', teacher: '' },
  { periodNumber: 4, startTime: '10:30', endTime: '11:15', subject: '', teacher: '' },
  { periodNumber: 5, startTime: '11:30', endTime: '12:15', subject: '', teacher: '' },
  { periodNumber: 6, startTime: '12:15', endTime: '13:00', subject: '', teacher: '' },
  { periodNumber: 7, startTime: '13:30', endTime: '14:15', subject: '', teacher: '' },
  { periodNumber: 8, startTime: '14:15', endTime: '15:00', subject: '', teacher: '' },
];

const Timetable = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [activeDay, setActiveDay] = useState('Monday');
  const [periods, setPeriods] = useState(defaultPeriods);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([classService.getAll(), teacherService.getAll({ limit: 100 })]).then(([c, t]) => {
      setClasses(c.data.data || []);
      setTeachers(t.data.data || []);
    });
  }, []);

  useEffect(() => {
    if (selectedClass) {
      subjectService.getAll({ class: selectedClass }).then(r => setSubjects(r.data.data || []));
      fetchTimetable();
    }
  }, [selectedClass, activeDay]);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const { data } = await timetableService.getAll({ class: selectedClass, day: activeDay });
      const existing = data.data?.find(t => t.day === activeDay);
      if (existing?.periods?.length) {
        const merged = defaultPeriods.map((dp, i) => {
          const ep = existing.periods.find(p => p.periodNumber === dp.periodNumber);
          return ep ? { ...dp, subject: ep.subject?._id || ep.subject || '', teacher: ep.teacher?._id || ep.teacher || '' } : dp;
        });
        setPeriods(merged);
      } else {
        setPeriods(defaultPeriods.map(p => ({ ...p, subject: '', teacher: '' })));
      }
    } catch { setPeriods(defaultPeriods); } finally { setLoading(false); }
  };

  const updatePeriod = (idx, field, value) => {
    const updated = [...periods];
    updated[idx] = { ...updated[idx], [field]: value };
    setPeriods(updated);
  };

  const handleSave = async () => {
    if (!selectedClass) return toast.error('Select a class');
    setSaving(true);
    try {
      await timetableService.createOrUpdate({ classId: selectedClass, day: activeDay, periods });
      toast.success(`${activeDay} timetable saved`);
    } catch (err) { toast.error(err?.message || 'Failed'); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="page-header">Timetable</h1><p className="text-dark-400 text-sm mt-1">Manage class schedules</p></div>

      <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="select-field w-full sm:w-56">
        <option value="">Select Class</option>
        {classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
      </select>

      {selectedClass && (
        <>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {days.map(day => (
              <button key={day} onClick={() => setActiveDay(day)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeDay === day ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                }`}>{day}</button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : (
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead><tr>
                  <th className="table-header">Period</th><th className="table-header">Time</th>
                  <th className="table-header">Subject</th><th className="table-header">Teacher</th>
                </tr></thead>
                <tbody>
                  {periods.map((p, i) => (
                    <tr key={i} className="hover:bg-dark-800/40">
                      <td className="table-cell font-medium text-primary-400">P{p.periodNumber}</td>
                      <td className="table-cell text-dark-400 text-xs">{p.startTime} - {p.endTime}</td>
                      <td className="table-cell">
                        <select value={p.subject} onChange={e => updatePeriod(i, 'subject', e.target.value)} className="select-field py-2 text-sm">
                          <option value="">-- Select --</option>
                          {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                      </td>
                      <td className="table-cell">
                        <select value={p.teacher} onChange={e => updatePeriod(i, 'teacher', e.target.value)} className="select-field py-2 text-sm">
                          <option value="">-- Select --</option>
                          {teachers.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiOutlineSave className="w-5 h-5" />}
              Save Timetable
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Timetable;
