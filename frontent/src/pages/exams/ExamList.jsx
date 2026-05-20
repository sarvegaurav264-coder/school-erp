import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { examService, classService, subjectService } from '../../services/dataService';
import toast from 'react-hot-toast';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterClass, setFilterClass] = useState('');
  const [formData, setFormData] = useState({
    name: '', type: 'Unit Test', class: '', subject: '', date: '',
    startTime: '', endTime: '', totalMarks: 100, passingMarks: 35, status: 'scheduled'
  });

  useEffect(() => { classService.getAll().then(r => setClasses(r.data.data || [])); }, []);
  useEffect(() => { fetchExams(); }, [filterClass]);
  useEffect(() => {
    if (formData.class) {
      subjectService.getAll({ class: formData.class }).then(r => setSubjects(r.data.data || []));
    }
  }, [formData.class]);

  const fetchExams = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filterClass) params.class = filterClass;
      const { data } = await examService.getAll(params);
      setExams(data.data || []);
      setPagination(data.pagination || {});
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (exam) => {
    setSelected(exam);
    setFormData({
      name: exam.name, type: exam.type, class: exam.class?._id || '',
      subject: exam.subject?._id || '', date: exam.date?.split('T')[0] || '',
      startTime: exam.startTime || '', endTime: exam.endTime || '',
      totalMarks: exam.totalMarks, passingMarks: exam.passingMarks, status: exam.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.class || !formData.subject || !formData.date) return toast.error('Fill required fields');
    setSaving(true);
    try {
      if (selected) { await examService.update(selected._id, formData); toast.success('Updated'); }
      else { await examService.create(formData); toast.success('Created'); }
      setShowModal(false); fetchExams();
    } catch (err) { toast.error(err?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam?')) return;
    try { await examService.delete(id); toast.success('Deleted'); fetchExams(); } catch { toast.error('Failed'); }
  };

  const statusColors = { scheduled: 'badge-info', ongoing: 'badge-warning', completed: 'badge-success', cancelled: 'badge-danger' };

  const columns = [
    { header: 'Exam', render: (r) => <div><p className="font-medium text-dark-100">{r.name}</p><p className="text-xs text-dark-500">{r.type}</p></div> },
    { header: 'Class', render: (r) => <span className="badge-primary">{r.class?.name} {r.class?.section}</span> },
    { header: 'Subject', render: (r) => r.subject?.name || 'N/A' },
    { header: 'Date', render: (r) => r.date ? new Date(r.date).toLocaleDateString() : 'N/A' },
    { header: 'Marks', render: (r) => `${r.passingMarks}/${r.totalMarks}` },
    { header: 'Status', render: (r) => <span className={statusColors[r.status] || 'badge-info'}>{r.status}</span> },
    { header: 'Actions', render: (r) => (
      <div className="flex gap-1">
        <button onClick={() => openEdit(r)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-amber-400"><HiOutlinePencil className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(r._id)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-rose-400"><HiOutlineTrash className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="page-header">Exams</h1><p className="text-dark-400 text-sm mt-1">Manage examinations</p></div>
        <button onClick={() => { setSelected(null); setFormData({ name: '', type: 'Unit Test', class: '', subject: '', date: '', startTime: '', endTime: '', totalMarks: 100, passingMarks: 35, status: 'scheduled' }); setShowModal(true); }} className="btn-primary flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Exam</button>
      </div>

      <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="select-field w-full sm:w-48">
        <option value="">All Classes</option>
        {classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
      </select>

      <DataTable columns={columns} data={exams} loading={loading} pagination={pagination} onPageChange={fetchExams} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selected ? 'Edit Exam' : 'Add Exam'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label-text">Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" required /></div>
            <div><label className="label-text">Type *</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="select-field"><option>Unit Test</option><option>Mid Term</option><option>Final</option><option>Quiz</option><option>Assignment</option></select></div>
            <div><label className="label-text">Class *</label><select value={formData.class} onChange={e => setFormData({...formData, class: e.target.value, subject: ''})} className="select-field" required><option value="">Select</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}</select></div>
            <div><label className="label-text">Subject *</label><select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="select-field" required><option value="">Select</option>{subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
            <div><label className="label-text">Date *</label><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="input-field" required /></div>
            <div><label className="label-text">Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="select-field"><option>scheduled</option><option>ongoing</option><option>completed</option><option>cancelled</option></select></div>
            <div><label className="label-text">Total Marks</label><input type="number" value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: Number(e.target.value)})} className="input-field" /></div>
            <div><label className="label-text">Passing Marks</label><input type="number" value={formData.passingMarks} onChange={e => setFormData({...formData, passingMarks: Number(e.target.value)})} className="input-field" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700/50">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExamList;
