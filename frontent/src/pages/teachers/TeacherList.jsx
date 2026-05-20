import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { teacherService } from '../../services/dataService';
import toast from 'react-hot-toast';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: 'Male',
    qualification: '', experience: 0, salary: 0, joiningDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => { fetchTeachers(); }, [search]);

  const fetchTeachers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      const { data } = await teacherService.getAll(params);
      setTeachers(data.data || []);
      setPagination(data.pagination || {});
    } catch { setTeachers([]); } finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({ firstName: '', lastName: '', email: '', phone: '', gender: 'Male', qualification: '', experience: 0, salary: 0, joiningDate: new Date().toISOString().split('T')[0] });
    setSelectedTeacher(null);
  };

  const openEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      firstName: teacher.firstName, lastName: teacher.lastName, email: teacher.email,
      phone: teacher.phone, gender: teacher.gender, qualification: teacher.qualification,
      experience: teacher.experience || 0, salary: teacher.salary || 0,
      joiningDate: teacher.joiningDate?.split('T')[0] || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.qualification) {
      return toast.error('Please fill required fields');
    }
    setSaving(true);
    try {
      if (selectedTeacher) {
        await teacherService.update(selectedTeacher._id, formData);
        toast.success('Teacher updated');
      } else {
        await teacherService.create(formData);
        toast.success('Teacher added');
      }
      setShowModal(false); fetchTeachers();
    } catch (err) { toast.error(err?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this teacher?')) return;
    try { await teacherService.delete(id); toast.success('Teacher removed'); fetchTeachers(); } catch { toast.error('Failed'); }
  };

  const columns = [
    { header: 'Teacher', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold border border-emerald-500/10">
          {row.firstName?.[0]}{row.lastName?.[0]}
        </div>
        <div>
          <p className="font-medium text-dark-100">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-dark-500">{row.teacherId}</p>
        </div>
      </div>
    )},
    { header: 'Email', accessor: 'email' },
    { header: 'Qualification', render: (row) => <span className="badge-info">{row.qualification}</span> },
    { header: 'Experience', render: (row) => <span>{row.experience || 0} yrs</span> },
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => { setSelectedTeacher(row); setShowViewModal(true); }} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-cyan-400 transition-colors"><HiOutlineEye className="w-4 h-4" /></button>
        <button onClick={() => openEdit(row)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-amber-400 transition-colors"><HiOutlinePencil className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(row._id)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-rose-400 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="page-header">Teachers</h1><p className="text-dark-400 text-sm mt-1">Manage teaching staff</p></div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Teacher</button>
      </div>

      <div className="relative">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
        <input type="text" placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
      </div>

      <DataTable columns={columns} data={teachers} loading={loading} pagination={pagination} onPageChange={fetchTeachers} emptyMessage="No teachers found" />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedTeacher ? 'Edit Teacher' : 'Add Teacher'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label-text">First Name *</label><input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="input-field" required /></div>
            <div><label className="label-text">Last Name *</label><input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="input-field" required /></div>
            <div><label className="label-text">Email *</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" required /></div>
            <div><label className="label-text">Phone *</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-field" required /></div>
            <div><label className="label-text">Gender *</label><select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="select-field"><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div><label className="label-text">Qualification *</label><input type="text" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} className="input-field" required /></div>
            <div><label className="label-text">Experience (years)</label><input type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: Number(e.target.value)})} className="input-field" min="0" /></div>
            <div><label className="label-text">Salary</label><input type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: Number(e.target.value)})} className="input-field" min="0" /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700/50">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : selectedTeacher ? 'Update' : 'Add'} Teacher</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Teacher Profile">
        {selectedTeacher && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                {selectedTeacher.firstName?.[0]}{selectedTeacher.lastName?.[0]}
              </div>
              <div><h3 className="text-xl font-bold text-dark-100">{selectedTeacher.firstName} {selectedTeacher.lastName}</h3><p className="text-dark-400">{selectedTeacher.teacherId}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[['Email', selectedTeacher.email], ['Phone', selectedTeacher.phone], ['Gender', selectedTeacher.gender], ['Qualification', selectedTeacher.qualification], ['Experience', `${selectedTeacher.experience || 0} years`], ['Salary', `₹${(selectedTeacher.salary || 0).toLocaleString()}`]].map(([l, v], i) => (
                <div key={i} className="p-3 rounded-xl bg-dark-800/40"><p className="text-xs text-dark-500 mb-1">{l}</p><p className="text-sm font-medium text-dark-200">{v}</p></div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeacherList;
