import { useState, useEffect } from 'react';
import { HiOutlineCheck, HiOutlineX, HiOutlineClock } from 'react-icons/hi';
import { attendanceService, classService, studentService } from '../../services/dataService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existing, setExisting] = useState([]);

  useEffect(() => { classService.getAll().then(r => setClasses(r.data.data || [])); }, []);

  useEffect(() => {
    if (selectedClass) fetchStudentsAndAttendance();
  }, [selectedClass, date]);

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      const [stuRes, attRes] = await Promise.all([
        studentService.getAll({ class: selectedClass, limit: 100 }),
        attendanceService.getAll({ class: selectedClass, date })
      ]);
      const studs = stuRes.data.data || [];
      const att = attRes.data.data || [];
      setStudents(studs);
      setExisting(att);
      const recs = studs.map(s => {
        const ex = att.find(a => a.student?._id === s._id);
        return { student: s._id, status: ex?.status || 'present', name: `${s.firstName} ${s.lastName}`, rollNumber: s.rollNumber, studentId: s.studentId };
      });
      setRecords(recs);
    } catch {} finally { setLoading(false); }
  };

  const updateStatus = (idx, status) => {
    const updated = [...records];
    updated[idx].status = status;
    setRecords(updated);
  };

  const markAll = (status) => setRecords(records.map(r => ({ ...r, status })));

  const handleSubmit = async () => {
    if (!selectedClass || !records.length) return toast.error('Select a class first');
    setSaving(true);
    try {
      await attendanceService.mark({ classId: selectedClass, date, records: records.map(r => ({ student: r.student, status: r.status })) });
      toast.success(`Attendance marked for ${records.length} students`);
    } catch (err) { toast.error(err?.message || 'Failed'); } finally { setSaving(false); }
  };

  const stats = { present: records.filter(r => r.status === 'present').length, absent: records.filter(r => r.status === 'absent').length, late: records.filter(r => r.status === 'late').length };

  return (
    <div className="space-y-6">
      <div><h1 className="page-header">Attendance</h1><p className="text-dark-400 text-sm mt-1">Mark daily attendance</p></div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="select-field w-full sm:w-56">
          <option value="">Select Class</option>
          {classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field w-full sm:w-48" />
      </div>

      {selectedClass && records.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card p-4 text-center border border-emerald-500/10">
              <p className="text-2xl font-bold text-emerald-400">{stats.present}</p><p className="text-xs text-dark-500">Present</p>
            </div>
            <div className="glass-card p-4 text-center border border-rose-500/10">
              <p className="text-2xl font-bold text-rose-400">{stats.absent}</p><p className="text-xs text-dark-500">Absent</p>
            </div>
            <div className="glass-card p-4 text-center border border-amber-500/10">
              <p className="text-2xl font-bold text-amber-400">{stats.late}</p><p className="text-xs text-dark-500">Late</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => markAll('present')} className="btn-secondary text-sm">All Present</button>
            <button onClick={() => markAll('absent')} className="btn-secondary text-sm">All Absent</button>
          </div>

          {loading ? <LoadingSpinner /> : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr>
                    <th className="table-header">#</th><th className="table-header">Student</th><th className="table-header">Roll</th><th className="table-header">Status</th>
                  </tr></thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={r.student} className="hover:bg-dark-800/40">
                        <td className="table-cell text-dark-500">{i + 1}</td>
                        <td className="table-cell font-medium text-dark-200">{r.name}</td>
                        <td className="table-cell text-dark-400">{r.rollNumber || r.studentId}</td>
                        <td className="table-cell">
                          <div className="flex gap-1.5">
                            {['present', 'absent', 'late'].map(s => (
                              <button key={s} onClick={() => updateStatus(i, s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  r.status === s
                                    ? s === 'present' ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                                    : s === 'absent' ? 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30'
                                    : 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                                    : 'bg-dark-800 text-dark-500 hover:bg-dark-700'
                                }`}>
                                {s === 'present' ? <HiOutlineCheck className="w-4 h-4 inline" /> : s === 'absent' ? <HiOutlineX className="w-4 h-4 inline" /> : <HiOutlineClock className="w-4 h-4 inline" />}
                                <span className="ml-1 hidden sm:inline capitalize">{s}</span>
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={handleSubmit} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save Attendance
            </button>
          </div>
        </>
      )}

      {selectedClass && records.length === 0 && !loading && (
        <div className="text-center py-12"><p className="text-dark-500">No students in this class</p></div>
      )}
    </div>
  );
};

export default Attendance;
