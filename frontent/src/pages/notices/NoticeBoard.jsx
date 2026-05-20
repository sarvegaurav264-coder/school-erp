import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSpeakerphone } from 'react-icons/hi';
import Modal from '../../components/common/Modal';
import { noticeService } from '../../services/dataService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', category: 'General', priority: 'medium', audience: 'all' });

  useEffect(() => { fetchNotices(); }, [filterCat]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filterCat) params.category = filterCat;
      const { data } = await noticeService.getAll(params);
      setNotices(data.data || []);
    } catch {} finally { setLoading(false); }
  };

  const openEdit = (notice) => {
    setSelected(notice);
    setFormData({ title: notice.title, description: notice.description, category: notice.category, priority: notice.priority, audience: notice.audience });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return toast.error('Fill required fields');
    setSaving(true);
    try {
      if (selected) { await noticeService.update(selected._id, formData); toast.success('Updated'); }
      else { await noticeService.create(formData); toast.success('Posted'); }
      setShowModal(false); fetchNotices();
    } catch (err) { toast.error(err?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete notice?')) return;
    try { await noticeService.delete(id); toast.success('Deleted'); fetchNotices(); } catch { toast.error('Failed'); }
  };

  const priorityColors = { urgent: 'badge-danger', high: 'badge-warning', medium: 'badge-info', low: 'badge-success' };
  const catEmojis = { General: '📢', Academic: '📚', Event: '🎉', Holiday: '🏖️', Exam: '📝', Sports: '⚽', Other: '📌' };
  const categories = ['General', 'Academic', 'Event', 'Holiday', 'Exam', 'Sports', 'Other'];

  if (loading) return <LoadingSpinner size="lg" text="Loading notices..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="page-header">Notice Board</h1><p className="text-dark-400 text-sm mt-1">Announcements & notices</p></div>
        <button onClick={() => { setSelected(null); setFormData({ title: '', description: '', category: 'General', priority: 'medium', audience: 'all' }); setShowModal(true); }} className="btn-primary flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Post Notice</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterCat('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!filterCat ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'}`}>All</button>
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterCat === c ? 'bg-primary-600 text-white' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'}`}>{catEmojis[c]} {c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((notice, i) => (
          <div key={notice._id} className="glass-card-hover p-5 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{catEmojis[notice.category] || '📌'}</span>
                <span className={priorityColors[notice.priority]}>{notice.priority}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(notice)} className="p-1.5 rounded-lg hover:bg-dark-700 text-dark-500 hover:text-amber-400"><HiOutlinePencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(notice._id)} className="p-1.5 rounded-lg hover:bg-dark-700 text-dark-500 hover:text-rose-400"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <h3 className="text-base font-bold text-dark-100 mb-2 line-clamp-2">{notice.title}</h3>
            <p className="text-sm text-dark-400 mb-3 line-clamp-3">{notice.description}</p>
            <div className="flex items-center justify-between text-xs text-dark-500 pt-3 border-t border-dark-700/50">
              <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
              <span className="capitalize">👥 {notice.audience}</span>
            </div>
          </div>
        ))}
      </div>

      {notices.length === 0 && <div className="text-center py-12"><p className="text-dark-500">No notices found</p></div>}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selected ? 'Edit Notice' : 'Post Notice'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label-text">Title *</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" required /></div>
          <div><label className="label-text">Description *</label><textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field resize-none" required /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="label-text">Category</label><select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="select-field">{categories.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="label-text">Priority</label><select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="select-field"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
            <div><label className="label-text">Audience</label><select value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})} className="select-field"><option value="all">All</option><option value="students">Students</option><option value="teachers">Teachers</option><option value="parents">Parents</option></select></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-dark-700/50">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Post'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoticeBoard;
