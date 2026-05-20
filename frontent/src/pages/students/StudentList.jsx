import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { studentService, classService } from '../../services/dataService';
import toast from 'react-hot-toast';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: 'Male',
    class: '', section: '', rollNumber: '', bloodGroup: '', admissionDate: new Date().toISOString().split('T')[0],
    parentInfo: { fatherName: '', motherName: '', guardianPhone: '', guardianEmail: '' },
    address: { street: '', city: '', state: '', zipCode: '' }
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [search, filterClass]);

  const fetchClasses = async () => {
    try {
      const { data } = await classService.getAll();
      setClasses(data.data || []);
    } catch {}
  };

  const fetchStudents = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filterClass) params.class = filterClass;
      const { data } = await studentService.getAll(params);
      setStudents(data.data || []);
      setPagination(data.pagination || {});
    } catch { setStudents([]); } finally { setLoading(false); }
  };

  const resetForm = () => {
    setFormData({
      firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: 'Male',
      class: '', section: '', rollNumber: '', bloodGroup: '', admissionDate: new Date().toISOString().split('T')[0],
      parentInfo: { fatherName: '', motherName: '', guardianPhone: '', guardianEmail: '' },
      address: { street: '', city: '', state: '', zipCode: '' }
    });
    setSelectedStudent(null);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };

  const openEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName, lastName: student.lastName, email: student.email || '',
      phone: student.phone || '', dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
      gender: student.gender, class: student.class?._id || student.class || '',
      section: student.section || '', rollNumber: student.rollNumber || '',
      bloodGroup: student.bloodGroup || '', admissionDate: student.admissionDate?.split('T')[0] || '',
      parentInfo: student.parentInfo || { fatherName: '', motherName: '', guardianPhone: '', guardianEmail: '' },
      address: student.address || { street: '', city: '', state: '', zipCode: '' }
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.class) {
      return toast.error('Please fill in required fields');
    }
    setSaving(true);
    try {
      if (selectedStudent) {
        await studentService.update(selectedStudent._id, formData);
        toast.success('Student updated');
      } else {
        await studentService.create(formData);
        toast.success('Student added');
      }
      setShowModal(false);
      fetchStudents();
    } catch (err) { toast.error(err?.message || 'Failed to save'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return;
    try {
      await studentService.delete(id);
      toast.success('Student removed');
      fetchStudents();
    } catch { toast.error('Failed to delete'); }
  };

  const columns = [
    { header: 'Student', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 flex items-center justify-center text-primary-400 text-sm font-bold border border-primary-500/10">
          {row.firstName?.[0]}{row.lastName?.[0]}
        </div>
        <div>
          <p className="font-medium text-dark-100">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-dark-500">{row.studentId}</p>
        </div>
      </div>
    )},
    { header: 'Class', render: (row) => (
      <span className="badge-primary">{row.class?.name || 'N/A'} {row.class?.section || ''}</span>
    )},
    { header: 'Gender', render: (row) => (
      <span className={row.gender === 'Female' ? 'text-pink-400' : 'text-blue-400'}>{row.gender}</span>
    )},
    { header: 'Phone', accessor: 'phone' },
    { header: 'Actions', render: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setSelectedStudent(row); setShowViewModal(true); }} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-cyan-400 transition-colors">
          <HiOutlineEye className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-amber-400 transition-colors">
          <HiOutlinePencil className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(row._id); }} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-rose-400 transition-colors">
          <HiOutlineTrash className="w-4 h-4" />
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Students</h1>
          <p className="text-dark-400 text-sm mt-1">Manage student records</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          <input type="text" placeholder="Search students..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="select-field w-full sm:w-48">
          <option value="">All Classes</option>
          {classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}
        </select>
      </div>

      <DataTable columns={columns} data={students} loading={loading} pagination={pagination}
        onPageChange={fetchStudents} emptyMessage="No students found" />

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedStudent ? 'Edit Student' : 'Add New Student'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="label-text">First Name *</label><input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="input-field" required /></div>
            <div><label className="label-text">Last Name *</label><input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="input-field" required /></div>
            <div><label className="label-text">Date of Birth *</label><input type="date" value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} className="input-field" required /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="label-text">Gender *</label><select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="select-field"><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div><label className="label-text">Class *</label><select value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="select-field" required><option value="">Select Class</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name} - {c.section}</option>)}</select></div>
            <div><label className="label-text">Roll Number</label><input type="text" value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="label-text">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" /></div>
            <div><label className="label-text">Phone</label><input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="input-field" /></div>
            <div><label className="label-text">Blood Group</label><select value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="select-field"><option value="">Select</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}</select></div>
          </div>

          <div className="border-t border-dark-700/50 pt-4">
            <p className="text-sm font-medium text-dark-300 mb-3">Parent Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="label-text">Father's Name</label><input type="text" value={formData.parentInfo.fatherName} onChange={e => setFormData({...formData, parentInfo: {...formData.parentInfo, fatherName: e.target.value}})} className="input-field" /></div>
              <div><label className="label-text">Mother's Name</label><input type="text" value={formData.parentInfo.motherName} onChange={e => setFormData({...formData, parentInfo: {...formData.parentInfo, motherName: e.target.value}})} className="input-field" /></div>
              <div><label className="label-text">Guardian Phone</label><input type="text" value={formData.parentInfo.guardianPhone} onChange={e => setFormData({...formData, parentInfo: {...formData.parentInfo, guardianPhone: e.target.value}})} className="input-field" /></div>
              <div><label className="label-text">Guardian Email</label><input type="email" value={formData.parentInfo.guardianEmail} onChange={e => setFormData({...formData, parentInfo: {...formData.parentInfo, guardianEmail: e.target.value}})} className="input-field" /></div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700/50">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {selectedStudent ? 'Update' : 'Add'} Student
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Student Profile">
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold">
                {selectedStudent.firstName?.[0]}{selectedStudent.lastName?.[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-100">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                <p className="text-dark-400">{selectedStudent.studentId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Class', `${selectedStudent.class?.name || 'N/A'} ${selectedStudent.class?.section || ''}`],
                ['Gender', selectedStudent.gender],
                ['DOB', selectedStudent.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toLocaleDateString() : 'N/A'],
                ['Phone', selectedStudent.phone || 'N/A'],
                ['Email', selectedStudent.email || 'N/A'],
                ['Blood Group', selectedStudent.bloodGroup || 'N/A'],
                ['Father', selectedStudent.parentInfo?.fatherName || 'N/A'],
                ['Mother', selectedStudent.parentInfo?.motherName || 'N/A']
              ].map(([label, value], i) => (
                <div key={i} className="p-3 rounded-xl bg-dark-800/40">
                  <p className="text-xs text-dark-500 mb-1">{label}</p>
                  <p className="text-sm font-medium text-dark-200">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentList;
