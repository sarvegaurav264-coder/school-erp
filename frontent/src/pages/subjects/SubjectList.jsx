import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { subjectService, classService, teacherService } from '../../services/dataService';
import toast from 'react-hot-toast';

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterClass, setFilterClass] = useState('');
  const [formData, setFormData] = useState({ name: '', code: '', class: '', teacher: '', type: 'Core', totalMarks: 100, passingMarks: 35 });

  useEffect(() => {
    Promise.all([classService.getAll(), teacherService.getAll({ limit: 100 })]).then(([c, t]) => {
      setClasses(c.data.data || []);
      setTeachers(t.data.data || []);
    });
  }, []);

  useEffect(() => { fetchSubjects(); }, [filterClass]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const params = filterClass ? { class: filterClass } : {};
      const { data } = await subjectService.getAll(params);
      setSubjects(data.data || []);
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (subj) => {
    setSelected(subj);
    setFormData({ name: subj.name, code: subj.code, class: subj.class?._id || '', teacher: subj.teacher?._id || '', type: subj.type, totalMarks: subj.totalMarks, passingMarks: subj.passingMarks });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.class) return toast.error('Fill required fields');
    setSaving(true);
    try {
      if (selected) { await subjectService.update(selected._id, formData); toast.success('Updated'); }
      else { await subjectService.create(formData); toast.success('Created'); }
      setShowModal(false); fetchSubjects();
    } catch (err) { toast.error(err?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete?')) return;
    try { await subjectService.delete(id); toast.success('Deleted'); fetchSubjects(); } catch { toast.error('Failed'); }
  };

  const columns = [
    { header: 'Subject', render: (r) => <div><p className="font-medium text-dark-100">{r.name}</p><p className="text-xs text-dark-500">{r.code}</p></div> },
    { header: 'Class', render: (r) => <span className="badge-primary">{r.class?.name} {r.class?.section}</span> },
    { header: 'Teacher', render: (r) => r.teacher ? `${r.teacher.firstName} ${r.teacher.lastName}` : 'N/A' },
    { header: 'Type', render: (r) => <span className="badge-info">{r.type}</span> },
    { header: 'Marks', render: (r) => `${r.passingMarks}/${r.totalMarks}` },
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
        <div><h1 className="page-header">Subjects</h1><p className="text-dark-400 text-sm mt-1">Manage subjects</p></div>
        <button onClick={() => { setSelected(null); setFormData({ name: '', code: '', class: '', teacher: '', type: 'Core', totalMarks: 100, passingMarks: 35 }); setShowModal(true); }} className="btn-primary flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Subject</button>
      </div>
      <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="select-field w-full sm:w-48">
        <option value="">All Classes</option>
        {classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
      </select>
      <DataTable columns={columns} data={subjects} loading={loading} emptyMessage="No subjects found" />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selected ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-text">Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" required /></div>
            <div><label className="label-text">Code *</label><input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="input-field" required /></div>
            <div><label className="label-text">Class *</label><select value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="select-field" required><option value="">Select</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}</select></div>
            <div><label className="label-text">Teacher</label><select value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})} className="select-field"><option value="">Select</option>{teachers.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}</select></div>
            <div><label className="label-text">Type</label><select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="select-field"><option>Core</option><option>Elective</option><option>Lab</option><option>Extra</option></select></div>
            <div><label className="label-text">Total Marks</label><input type="number" value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: Number(e.target.value)})} className="input-field" /></div>
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

export default SubjectList;
