import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineUserGroup } from 'react-icons/hi';
import Modal from '../../components/common/Modal';
import { classService, teacherService } from '../../services/dataService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', section: 'A', classTeacher: '', capacity: 40, room: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classRes, teacherRes] = await Promise.all([classService.getAll(), teacherService.getAll({ limit: 100 })]);
      setClasses(classRes.data.data || []);
      setTeachers(teacherRes.data.data || []);
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (cls) => {
    setSelected(cls);
    setFormData({ name: cls.name, section: cls.section, classTeacher: cls.classTeacher?._id || '', capacity: cls.capacity, room: cls.room || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.section) return toast.error('Name and section required');
    setSaving(true);
    try {
      if (selected) { await classService.update(selected._id, formData); toast.success('Class updated'); }
      else { await classService.create(formData); toast.success('Class created'); }
      setShowModal(false); fetchData();
    } catch (err) { toast.error(err?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this class?')) return;
    try { await classService.delete(id); toast.success('Class deleted'); fetchData(); } catch (err) { toast.error(err?.message || 'Cannot delete'); }
  };

  if (loading) return <LoadingSpinner size="lg" text="Loading classes..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="page-header">Classes</h1><p className="text-dark-400 text-sm mt-1">Manage class sections</p></div>
        <button onClick={() => { setSelected(null); setFormData({ name: '', section: 'A', classTeacher: '', capacity: 40, room: '' }); setShowModal(true); }} className="btn-primary flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Class</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classes.map((cls, i) => (
          <div key={cls._id} className="glass-card-hover p-5 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-primary-500/20 flex items-center justify-center border border-violet-500/10">
                <HiOutlineUserGroup className="w-6 h-6 text-violet-400" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(cls)} className="p-1.5 rounded-lg hover:bg-dark-700 text-dark-500 hover:text-amber-400 transition-colors"><HiOutlinePencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(cls._id)} className="p-1.5 rounded-lg hover:bg-dark-700 text-dark-500 hover:text-rose-400 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-dark-100">{cls.name} - {cls.section}</h3>
            <p className="text-xs text-dark-500 mt-1">Room: {cls.room || 'N/A'} • Capacity: {cls.capacity}</p>
            {cls.classTeacher && <p className="text-xs text-primary-400 mt-2">Teacher: {cls.classTeacher.firstName} {cls.classTeacher.lastName}</p>}
            <div className="mt-3 pt-3 border-t border-dark-700/50 flex items-center justify-between">
              <span className="text-xs text-dark-400">{cls.academicYear}</span>
              <span className="badge-primary text-[10px]">{cls.studentCount || 0} students</span>
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 && <div className="text-center py-12"><p className="text-dark-500">No classes found</p></div>}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selected ? 'Edit Class' : 'Add Class'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-text">Class Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="e.g. Class 1" required /></div>
            <div><label className="label-text">Section *</label><input type="text" value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})} className="input-field" placeholder="e.g. A" required /></div>
            <div><label className="label-text">Room</label><input type="text" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className="input-field" /></div>
            <div><label className="label-text">Capacity</label><input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} className="input-field" min="1" /></div>
          </div>
          <div><label className="label-text">Class Teacher</label><select value={formData.classTeacher} onChange={e => setFormData({...formData, classTeacher: e.target.value})} className="select-field"><option value="">Select Teacher</option>{teachers.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}</select></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700/50">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : selected ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClassList;
