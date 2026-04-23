import { useState, useEffect } from 'react';
import { X, Save, Camera, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';
import { updateUserProfile } from '../services/userService';
import { uploadImage } from '../services/uploadService';
import useAuth from '../hooks/useAuth';

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    university: '',
    skills: [],
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        university: user.university || '',
        skills: user.skills || [],
      });
      setAvatarPreview(user.avatar || '');
      setAvatarFile(null);
    }
  }, [user, isOpen]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let avatarUrl = user.avatar || '';

      if (avatarFile) {
        const uploadData = new FormData();
        uploadData.append('image', avatarFile);
        const res = await uploadImage(uploadData);
        avatarUrl = res.data.url;
      }

      const { data } = await updateUserProfile(user._id, {
        ...formData,
        avatar: avatarUrl,
      });

      updateUser(data);
      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg mx-4 bg-bg-secondary rounded-2xl border border-border shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-bg-secondary rounded-t-2xl">
          <h2 className="text-lg font-bold text-text-primary">Edit Profile</h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-card rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold overflow-hidden border-4 border-bg-primary shadow-xl">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={20} className="text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-text-muted mt-2">Click to change avatar</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              maxLength={50}
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* University */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">University</label>
            <input
              type="text"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              placeholder="MIT, Stanford, etc."
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              maxLength={500}
              placeholder="Tell people about yourself..."
              className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            ></textarea>
            <p className="text-xs text-text-muted mt-1 text-right">{formData.bio.length}/500</p>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Skills</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Type a skill and press Enter"
                className="flex-1 bg-bg-primary border border-border rounded-xl px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addSkill}>
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg border border-primary/20">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-error transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
