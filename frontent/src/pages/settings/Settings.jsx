import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/dataService';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.name) return toast.error('Name is required');
    setSaving(true);
    try {
      await authService.updateProfile(profileData);
      updateUser(profileData);
      toast.success('Profile updated');
    } catch (err) { toast.error(err?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) return toast.error('Fill all fields');
    if (passwordData.newPassword !== passwordData.confirmPassword) return toast.error('Passwords do not match');
    if (passwordData.newPassword.length < 6) return toast.error('Min 6 characters');
    setSaving(true);
    try {
      const { data } = await authService.changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      if (data.data?.token) localStorage.setItem('token', data.data.token);
      toast.success('Password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err?.message || 'Failed'); } finally { setSaving(false); }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: HiOutlineUser },
    { id: 'security', label: 'Security', icon: HiOutlineLockClosed },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="page-header">Settings</h1><p className="text-dark-400 text-sm mt-1">Manage your account</p></div>

      <div className="flex gap-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25' : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
            }`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="glass-card p-6 max-w-2xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dark-700/50">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/25">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-dark-100">{user?.name}</h3>
              <p className="text-dark-400 text-sm">{user?.email}</p>
              <span className="badge-primary mt-1 capitalize">{user?.role}</span>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="label-text">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="input-field pl-12" />
              </div>
            </div>
            <div>
              <label className="label-text">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input type="email" value={user?.email || ''} className="input-field pl-12 opacity-60 cursor-not-allowed" disabled />
              </div>
            </div>
            <div>
              <label className="label-text">Phone</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                <input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="input-field pl-12" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Update Profile'}</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="glass-card p-6 max-w-2xl">
          <h3 className="text-lg font-bold text-dark-100 mb-4">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="label-text">Current Password</label>
              <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="label-text">New Password</label>
              <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="input-field" required />
            </div>
            <div>
              <label className="label-text">Confirm New Password</label>
              <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="input-field" required />
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Changing...' : 'Change Password'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;
