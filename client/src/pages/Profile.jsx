import { useState, useEffect } from 'react';
import { Star, MapPin, Calendar, GraduationCap, Edit3, ExternalLink, Shield, Award, Briefcase } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import GigCard from '../components/GigCard';
import EditProfileModal from '../components/EditProfileModal';
import { formatDate } from '../utils/formatDate';
import { getGigsBySeller } from '../services/gigService';
import { PageLoader } from '../components/Loader';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('gigs');
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (user && user.role === 'seller') {
      const fetchGigs = async () => {
        try {
          const { data } = await getGigsBySeller(user._id);
          setGigs(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchGigs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const profileUser = {
    name: user?.name,
    email: user?.email,
    role: user?.role,
    university: user?.university || 'University Student',
    bio: user?.bio || 'Passionate student freelancer ready to build amazing things.',
    skills: user?.skills || [],
    rating: user?.rating || 0.0,
    reviewCount: user?.reviewCount || 0,
    portfolio: user?.portfolio || [],
    verificationStatus: user?.verificationStatus || (user?.isVerified ? 'verified' : 'pending'),
    createdAt: user?.createdAt,
  };

  const tabs = [
    { id: 'gigs', label: 'My Gigs' },
    { id: 'portfolio', label: 'Portfolio' },
  ];

  if (!user) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Profile header */}
      <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden mb-8 shadow-xl shadow-black/10">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-primary via-primary-dark to-accent relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23fff%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020zm40%200V20L20%2040z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
        </div>

        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6 -mt-14">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold border-4 border-bg-secondary shadow-xl flex-shrink-0 relative overflow-hidden">
              {user.avatar ? (
                <img src={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + user.avatar : user.avatar} alt={profileUser.name} className="w-full h-full object-cover" />
              ) : (
                profileUser.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 pt-2 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-text-primary">{profileUser.name}</h1>
                <div className="flex items-center gap-2">
                  {profileUser.verificationStatus === 'verified' ? (
                    <span className="flex items-center gap-1 text-xs bg-success/10 text-success px-2.5 py-1 rounded-full font-medium shadow-sm border border-success/20">
                      <Shield size={12} /> Verified Student
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs bg-warning/10 text-warning px-2.5 py-1 rounded-full font-medium shadow-sm border border-warning/20">
                      <Shield size={12} /> Manual Review Pending
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium capitalize border border-primary/20">
                    <Briefcase size={12} /> {profileUser.role}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-4">
                <span className="flex items-center gap-1 font-medium text-text-primary"><GraduationCap size={14} className="text-primary" /> {profileUser.university}</span>
                <span className="flex items-center gap-1"><Star size={14} className="fill-warning text-warning" /> {profileUser.rating.toFixed(1)} ({profileUser.reviewCount} reviews)</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {formatDate(profileUser.createdAt)}</span>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">{profileUser.bio}</p>
            </div>
            <Button variant="secondary" size="sm" className="flex-shrink-0 hover:bg-primary hover:text-white hover:border-primary transition-all" onClick={() => setShowEditModal(true)}>
              <Edit3 size={14} /> Edit Profile
            </Button>
          </div>

          {/* Skills */}
          <div className="mt-6 border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3">Skills</h3>
            {profileUser.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profileUser.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 text-xs font-medium bg-bg-card border border-border rounded-lg text-text-secondary hover:text-primary hover:border-primary/30 transition-colors shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No skills added yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg-secondary rounded-xl border border-border mb-8 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in relative min-h-[200px]">
        {loading && <PageLoader />}
        
        {!loading && activeTab === 'gigs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {gigs.length > 0 ? (
              gigs.map((gig) => <GigCard key={gig._id} gig={gig} />)
            ) : (
              <div className="col-span-full text-center py-10 bg-bg-secondary rounded-xl border border-dashed border-border">
                <p className="text-text-muted text-sm mb-4">You don't have any active gigs.</p>
                {user.role === 'seller' && (
                  <Button variant="outline" size="sm" onClick={() => window.location.href='/dashboard/create-gig'}>
                    Create Your First Gig
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {profileUser.portfolio.length > 0 ? (
              profileUser.portfolio.map((item, i) => (
                <div key={i} className="bg-bg-secondary rounded-xl border border-border overflow-hidden card-hover group shadow-sm">
                  <div className="h-44 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🖥️</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors mb-1">{item.title}</h3>
                    <p className="text-sm text-text-secondary mb-3">{item.description}</p>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover font-medium transition-colors">
                        View Project <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 bg-bg-secondary rounded-xl border border-dashed border-border">
                <p className="text-text-muted text-sm mb-2">No portfolio items yet.</p>
                <p className="text-text-muted text-xs">Add projects to your portfolio from the Edit Profile modal.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
    </div>
  );
};

export default Profile;
