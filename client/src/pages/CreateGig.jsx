import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import { createGig } from '../services/gigService';
import { generateDescription, suggestPricing } from '../services/aiService';
import { uploadMultipleImages } from '../services/uploadService';
import useAuth from '../hooks/useAuth';

const CATEGORIES = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
  { value: 'video-editing', label: 'Video Editing' },
  { value: 'mobile-development', label: 'Mobile Dev' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' },
];

const CreateGig = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState('');
  const [images, setImages] = useState([]);
  const isVerifiedSeller = user?.isVerified || user?.verificationStatus === 'verified';

  const [formData, setFormData] = useState({
    title: '',
    category: 'web-development',
    description: '',
    tags: '',
    pricing: {
      basic: { title: 'Basic', description: '', price: 0, deliveryDays: 3, features: '' },
      standard: { title: 'Standard', description: '', price: 0, deliveryDays: 5, features: '' },
      premium: { title: 'Premium', description: '', price: 0, deliveryDays: 7, features: '' }
    }
  });

  const handlePricingChange = (tier, field, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [tier]: {
          ...prev.pricing[tier],
          [field]: field === 'price' || field === 'deliveryDays' ? Number(value) : value
        }
      }
    }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.category) {
      toast.error('Please enter a title and category first.');
      return;
    }
    
    try {
      setAiLoading('description');
      const { data } = await generateDescription({ 
        title: formData.title, 
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()) 
      });
      setFormData(prev => ({ ...prev, description: data.description }));
      toast.success('Description generated!');
    } catch (error) {
      toast.error('Failed to generate description');
    } finally {
      setAiLoading('');
    }
  };

  const handleSuggestPricing = async () => {
    if (!formData.title || !formData.category) {
      toast.error('Please enter a title and category first.');
      return;
    }

    try {
      setAiLoading('pricing');
      const { data } = await suggestPricing({ 
        title: formData.title, 
        category: formData.category 
      });
      
      const { recommended } = data;
      setFormData(prev => ({
        ...prev,
        pricing: {
          basic: { ...prev.pricing.basic, price: recommended.basic },
          standard: { ...prev.pricing.standard, price: recommended.standard },
          premium: { ...prev.pricing.premium, price: recommended.premium }
        }
      }));
      toast.success('Pricing updated with AI suggestions!');
    } catch (error) {
      toast.error('Failed to suggest pricing');
    } finally {
      setAiLoading('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerifiedSeller) {
      toast.error('Student verification is required before publishing gigs.');
      return;
    }

    setLoading(true);

    try {
      let uploadedImages = [];
      if (images && images.length > 0) {
        const uploadData = new FormData();
        images.forEach(img => uploadData.append('images', img));
        const uploadRes = await uploadMultipleImages(uploadData);
        uploadedImages = uploadRes.data.urls;
      }

      // Format data
      const gigData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        images: uploadedImages,
        pricing: {
          basic: {
            ...formData.pricing.basic,
            features: formData.pricing.basic.features.split(',').map(f => f.trim()).filter(Boolean)
          },
          standard: {
            ...formData.pricing.standard,
            features: formData.pricing.standard.features.split(',').map(f => f.trim()).filter(Boolean)
          },
          premium: {
            ...formData.pricing.premium,
            features: formData.pricing.premium.features.split(',').map(f => f.trim()).filter(Boolean)
          }
        }
      };

      await createGig(gigData);
      toast.success('Gig created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-text-primary">Create a New Gig</h1>
        <p className="text-text-secondary mt-1">Fill out the details to publish your service to the marketplace.</p>
      </div>

      {!isVerifiedSeller && (
        <div className="mb-6 rounded-xl border border-warning/20 bg-warning/10 p-4 text-sm text-text-secondary">
          Your student verification is still pending. You can prepare your gig draft, but publishing will stay locked until the account is verified.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Overview section */}
        <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8 shadow-xl shadow-black/10">
          <h2 className="text-lg font-bold text-text-primary border-b border-border pb-4 mb-6">1. Overview</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Gig Title</label>
              <input
                type="text"
                required
                maxLength={80}
                placeholder="I will do something I'm really good at..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Search Tags</label>
                <input
                  type="text"
                  placeholder="react, web design, writing (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery section */}
        <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8 shadow-xl shadow-black/10">
          <h2 className="text-lg font-bold text-text-primary border-b border-border pb-4 mb-6">2. Gallery</h2>
          <p className="text-sm text-text-secondary mb-4">Upload high-quality images to showcase your work (Max 3 images).</p>
          <FileUpload 
            multiple={true} 
            maxSizeMB={5}
            onUploadSelect={(files) => setImages(files)}
            placeholder="Drag & drop images here or click to browse"
          />
        </div>

        {/* Description section */}
        <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8 shadow-xl shadow-black/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 mb-6 gap-4">
            <h2 className="text-lg font-bold text-text-primary">3. Description</h2>
            <Button 
              type="button" 
              variant="accent" 
              size="sm" 
              onClick={handleGenerateDescription}
              disabled={aiLoading === 'description'}
              className="whitespace-nowrap bg-gradient-to-r from-primary to-accent border-none text-white shadow-lg shadow-primary/20 hover:scale-[1.02]"
            >
              {aiLoading === 'description' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              AI Write Description
            </Button>
          </div>
          
          <textarea
            required
            rows={10}
            placeholder="Describe your gig in detail, explain what you offer, and why buyers should choose you..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-bg-primary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary transition-colors resize-y leading-relaxed"
          ></textarea>
        </div>

        {/* Pricing section */}
        <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8 shadow-xl shadow-black/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 mb-6 gap-4">
            <h2 className="text-lg font-bold text-text-primary">4. Pricing & Scopes</h2>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleSuggestPricing}
              disabled={aiLoading === 'pricing'}
              className="whitespace-nowrap border-primary/50 text-primary hover:bg-primary/10"
            >
              {aiLoading === 'pricing' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              AI Suggest Prices
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['basic', 'standard', 'premium'].map((tier) => (
              <div key={tier} className={`p-5 rounded-xl border ${tier === 'standard' ? 'border-primary bg-primary/5' : 'border-border bg-bg-primary'}`}>
                <h3 className="font-bold text-text-primary capitalize mb-4 pb-2 border-b border-border/50 text-lg flex items-center justify-between">
                  {tier}
                  {tier === 'standard' && <span className="text-[10px] uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full">Popular</span>}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Package Title</label>
                    <input
                      type="text"
                      required
                      value={formData.pricing[tier].title}
                      onChange={(e) => handlePricingChange(tier, 'title', e.target.value)}
                      className="w-full bg-transparent border-b border-border px-1 py-2 text-text-primary text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Description</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.pricing[tier].description}
                      onChange={(e) => handlePricingChange(tier, 'description', e.target.value)}
                      className="w-full bg-transparent border-b border-border px-1 py-2 text-text-primary text-sm focus:outline-none focus:border-primary resize-none"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Features (comma separated)</label>
                    <input
                      type="text"
                      value={formData.pricing[tier].features}
                      onChange={(e) => handlePricingChange(tier, 'features', e.target.value)}
                      className="w-full bg-transparent border-b border-border px-1 py-2 text-text-primary text-sm focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Days to Deliver</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={formData.pricing[tier].deliveryDays}
                        onChange={(e) => handlePricingChange(tier, 'deliveryDays', e.target.value)}
                        className="w-full bg-transparent border-b border-border px-1 py-2 text-text-primary text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Price (₹)</label>
                      <div className="relative">
                        <IndianRupee size={14} className="absolute left-1 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                          type="number"
                          min={0}
                          required
                          value={formData.pricing[tier].price}
                          onChange={(e) => handlePricingChange(tier, 'price', e.target.value)}
                          className="w-full bg-transparent border-b border-border pl-6 pr-1 py-2 text-text-primary text-sm focus:outline-none focus:border-primary font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" size="lg" disabled={loading || !isVerifiedSeller} className="min-w-[150px]">
            {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Publish Gig'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateGig;
