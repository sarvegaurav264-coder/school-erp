import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineCash, HiOutlineTrash } from 'react-icons/hi';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/common/StatCard';
import { feeService, studentService } from '../../services/dataService';
import toast from 'react-hot-toast';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [feeStats, setFeeStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({
    student: '', feeType: 'Tuition', amount: 0, discount: 0, fine: 0,
    month: '', dueDate: '', remarks: ''
  });
  const [payData, setPayData] = useState({ amount: 0, paymentMethod: 'upi', transactionId: '' });

  useEffect(() => {
    studentService.getAll({ limit: 200 }).then(r => setStudents(r.data.data || []));
    fetchStats();
  }, []);

  useEffect(() => { fetchFees(); }, [filterStatus]);

  const fetchFees = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filterStatus) params.status = filterStatus;
      const { data } = await feeService.getAll(params);
      setFees(data.data || []);
      setPagination(data.pagination || {});
    } catch {} finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try { const { data } = await feeService.getStats(); setFeeStats(data.data); } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student || !formData.amount || !formData.month || !formData.dueDate) return toast.error('Fill required fields');
    setSaving(true);
    try {
      await feeService.create(formData);
      toast.success('Fee created');
      setShowModal(false); fetchFees(); fetchStats();
    } catch (err) { toast.error(err?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!payData.amount) return toast.error('Enter amount');
    setSaving(true);
    try {
      await feeService.pay(selected._id, payData);
      toast.success('Payment recorded');
      setShowPayModal(false); fetchFees(); fetchStats();
    } catch (err) { toast.error(err?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete fee record?')) return;
    try { await feeService.delete(id); toast.success('Deleted'); fetchFees(); fetchStats(); } catch { toast.error('Failed'); }
  };

  const statusColors = { paid: 'badge-success', unpaid: 'badge-danger', partial: 'badge-warning', overdue: 'badge-danger' };
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const columns = [
    { header: 'Student', render: (r) => r.student ? `${r.student.firstName} ${r.student.lastName}` : 'N/A' },
    { header: 'Type', render: (r) => <span className="badge-info">{r.feeType}</span> },
    { header: 'Month', accessor: 'month' },
    { header: 'Amount', render: (r) => `₹${(r.totalAmount || r.amount || 0).toLocaleString()}` },
    { header: 'Paid', render: (r) => `₹${(r.paidAmount || 0).toLocaleString()}` },
    { header: 'Status', render: (r) => <span className={statusColors[r.status]}>{r.status}</span> },
    { header: 'Actions', render: (r) => (
      <div className="flex gap-1">
        {r.status !== 'paid' && (
          <button onClick={() => { setSelected(r); setPayData({ amount: (r.totalAmount || r.amount) - (r.paidAmount || 0), paymentMethod: 'upi', transactionId: '' }); setShowPayModal(true); }}
            className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-emerald-400"><HiOutlineCash className="w-4 h-4" /></button>
        )}
        <button onClick={() => handleDelete(r._id)} className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-rose-400"><HiOutlineTrash className="w-4 h-4" /></button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="page-header">Fees</h1><p className="text-dark-400 text-sm mt-1">Manage fee collection</p></div>
        <button onClick={() => { setFormData({ student: '', feeType: 'Tuition', amount: 0, discount: 0, fine: 0, month: '', dueDate: '', remarks: '' }); setShowModal(true); }} className="btn-primary flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Fee</button>
      </div>

      {feeStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Fees" value={feeStats.summary?.total || 0} icon={HiOutlineCash} color="blue" prefix="₹" />
          <StatCard title="Collected" value={feeStats.summary?.collected || 0} icon={HiOutlineCash} color="emerald" prefix="₹" delay={100} />
          <StatCard title="Pending" value={(feeStats.summary?.total || 0) - (feeStats.summary?.collected || 0)} icon={HiOutlineCash} color="rose" prefix="₹" delay={200} />
        </div>
      )}

      <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select-field w-full sm:w-48">
        <option value="">All Status</option>
        <option value="paid">Paid</option><option value="unpaid">Unpaid</option>
        <option value="partial">Partial</option><option value="overdue">Overdue</option>
      </select>

      <DataTable columns={columns} data={fees} loading={loading} pagination={pagination} onPageChange={fetchFees} />

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Fee Record" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="label-text">Student *</label><select value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} className="select-field" required><option value="">Select</option>{students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.studentId})</option>)}</select></div>
            <div><label className="label-text">Fee Type</label><select value={formData.feeType} onChange={e => setFormData({...formData, feeType: e.target.value})} className="select-field">{['Tuition','Transport','Library','Laboratory','Sports','Exam','Admission','Other'].map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="label-text">Amount *</label><input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="input-field" required min="0" /></div>
            <div><label className="label-text">Discount</label><input type="number" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} className="input-field" min="0" /></div>
            <div><label className="label-text">Month *</label><select value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className="select-field" required><option value="">Select</option>{months.map(m => <option key={m}>{m}</option>)}</select></div>
            <div><label className="label-text">Due Date *</label><input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="input-field" required /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700/50">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Pay Modal */}
      <Modal isOpen={showPayModal} onClose={() => setShowPayModal(false)} title="Record Payment">
        <form onSubmit={handlePay} className="space-y-4">
          <div><label className="label-text">Amount *</label><input type="number" value={payData.amount} onChange={e => setPayData({...payData, amount: Number(e.target.value)})} className="input-field" required min="1" /></div>
          <div><label className="label-text">Method</label><select value={payData.paymentMethod} onChange={e => setPayData({...payData, paymentMethod: e.target.value})} className="select-field"><option value="upi">UPI</option><option value="cash">Cash</option><option value="card">Card</option><option value="bank">Bank Transfer</option><option value="online">Online</option></select></div>
          <div><label className="label-text">Transaction ID</label><input type="text" value={payData.transactionId} onChange={e => setPayData({...payData, transactionId: e.target.value})} className="input-field" /></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700/50">
            <button type="button" onClick={() => setShowPayModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Processing...' : 'Record Payment'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeeManagement;
