import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, RefreshCw, Check, MessageSquare, Heart, Share2, ArrowLeft, Shield, Award, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import { formatPrice } from '../utils/formatDate';
import useAuth from '../hooks/useAuth';
import { getGigById } from '../services/gigService';
import { getReviewsByGig } from '../services/reviewService';
import { createOrder } from '../services/orderService';
import { createPaymentOrder, verifyPayment } from '../services/paymentService';
import { suggestPricing } from '../services/aiService';
import { PageLoader } from '../components/Loader';
import OnlineIndicator from '../components/OnlineIndicator';

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedTier, setSelectedTier] = useState('basic');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [aiPricing, setAiPricing] = useState(null);

  const tiers = ['basic', 'standard', 'premium'];

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        setLoading(true);
        const { data: gigData } = await getGigById(id);
        setGig(gigData);

        const { data: reviewsData } = await getReviewsByGig(id);
        setReviews(reviewsData.reviews || []);

        // Fetch AI Pricing recommendation
        try {
          const { data: aiData } = await suggestPricing({ category: gigData.category, title: gigData.title });
          setAiPricing(aiData.recommended);
        } catch(e) { /* ignore ai error */ }

      } catch (error) {
        console.error('Failed to fetch gig details', error);
        toast.error('Failed to load gig details');
      } finally {
        setLoading(false);
      }
    };

    fetchGigDetails();
  }, [id]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (user.role === 'seller' && user._id === gig.seller._id) {
      toast.error('You cannot purchase your own gig');
      return;
    }

    try {
      setPurchasing(true);

      // 1. Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setPurchasing(false);
        return;
      }

      // 2. Create DB Order (status: pending)
      const { data: order } = await createOrder({
        gigId: gig._id,
        tier: selectedTier,
        requirements: 'I need this service ASAP.'
      });

      // 3. Create Razorpay Payment Order
      const { data: rzpOrder } = await createPaymentOrder({ orderId: order._id });

      // 4. Open Razorpay Checkout modal
      const options = {
        key: rzpOrder.key, // rzp_test_demo_key or actual test key
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'UniLance',
        description: `Payment for ${gig.title}`,
        order_id: rzpOrder.razorpayOrderId,
        handler: async function (response) {
          try {
            // 5. Verify Signature
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });
            toast.success('Payment successful! Order created.');
            navigate('/dashboard/orders');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#6366F1',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Purchase error', error);
      toast.error(error.response?.data?.message || 'Payment initiation failed');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!gig) return <div className="text-center py-20 text-text-primary">Gig not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back */}
      <Link to="/gigs" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Gigs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full border border-primary/20 capitalize">
                {gig.category.replace('-', ' ')}
              </span>
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-warning text-warning" />
                <span className="text-sm font-semibold text-warning">{gig.rating.toFixed(1)}</span>
                <span className="text-sm text-text-muted">({gig.reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">{gig.title}</h1>
          </div>

          {/* Cover image */}
          <div className="h-64 sm:h-80 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl border border-border flex items-center justify-center overflow-hidden">
            {gig.images && gig.images.length > 0 ? (
              <img src={import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + gig.images[0] : gig.images[0]} alt={gig.title} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-3 flex items-center justify-center w-24 h-24 bg-bg-card rounded-full mx-auto">💻</div>
                <p className="text-text-secondary text-sm">No Preview Available</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-lg font-bold text-text-primary mb-4">About this gig</h2>
            <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{gig.description}</div>
            <div className="flex flex-wrap gap-2 mt-6">
              {gig.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs bg-bg-card rounded-full text-text-secondary border border-border">{tag}</span>
              ))}
            </div>
          </div>

          {/* Seller */}
          <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-lg font-bold text-text-primary mb-6">About the Seller</h2>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {gig.seller.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <OnlineIndicator isOnline={gig.seller.isOnline} lastSeen={gig.seller.lastSeen} size="lg" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-primary">{gig.seller.name}</h3>
                <p className="text-sm text-primary font-medium mb-1">{gig.seller.university || 'University Student'}</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-warning text-warning" />
                    <span className="text-sm font-semibold text-text-primary">{gig.seller.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <span className="text-sm text-text-muted">{gig.seller.reviewCount || 0} reviews</span>
                  <span className={`flex items-center gap-1 text-sm ${gig.seller.isVerified ? 'text-success' : 'text-warning'}`}>
                    <Shield size={12} /> {gig.seller.isVerified ? 'Verified Student' : 'Verification Pending'}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{gig.seller.bio || 'This seller has not added a bio yet.'}</p>
                <div className="flex flex-wrap gap-2">
                  {gig.seller.skills && gig.seller.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 text-xs bg-primary/10 text-primary rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <Link to={`/messages?to=${gig.seller._id}`}>
                <Button variant="secondary" className="w-full sm:w-auto">
                  <MessageSquare size={16} /> Contact Seller
                </Button>
              </Link>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-primary">Reviews ({reviews.length})</h2>
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-warning text-warning" />
                <span className="font-bold text-text-primary">{gig.rating.toFixed(1)}</span>
              </div>
            </div>
            {reviews.length === 0 ? (
              <p className="text-sm text-text-muted">No reviews yet for this gig.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center text-text-secondary font-semibold text-sm">
                        {review.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{review.user?.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={12} className="fill-warning text-warning" />)}</div>
                          <span className="text-xs text-text-muted">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pricing sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            
            {/* AI Pricing Suggestion */}
            {aiPricing && gig.pricing[selectedTier].price > 0 && (
               <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 flex gap-3 text-sm">
                 <Sparkles className="text-primary flex-shrink-0 mt-0.5" size={16} />
                 <div>
                   <p className="font-medium text-text-primary">AI Pricing Insight</p>
                   <p className="text-text-secondary mt-1">
                     The recommended market price for {selectedTier} tier in this category is <strong className="text-primary">{formatPrice(aiPricing[selectedTier])}</strong>.
                     {gig.pricing[selectedTier].price < aiPricing[selectedTier] ? ' This gig is a great deal!' : ' This seller offers premium quality.'}
                   </p>
                 </div>
               </div>
            )}

            {/* Tier selector */}
            <div className="bg-bg-secondary rounded-2xl border border-border overflow-hidden shadow-xl shadow-black/10">
              <div className="grid grid-cols-3">
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`py-3 text-sm font-medium capitalize transition-all ${
                      selectedTier === tier 
                        ? 'bg-primary text-white' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-text-primary">{gig.pricing[selectedTier].title || `${selectedTier} Package`}</h3>
                  <span className="text-2xl font-bold text-text-primary">{formatPrice(gig.pricing[selectedTier].price || 0)}</span>
                </div>
                <p className="text-sm text-text-secondary mb-4 min-h-[40px]">{gig.pricing[selectedTier].description || 'No description provided.'}</p>
                <div className="flex items-center gap-4 mb-6 text-sm text-text-secondary">
                  <span className="flex items-center gap-1"><Clock size={14} /> {gig.pricing[selectedTier].deliveryDays || 3} day delivery</span>
                  <span className="flex items-center gap-1"><RefreshCw size={14} /> Revisions</span>
                </div>
                {gig.pricing[selectedTier].features && gig.pricing[selectedTier].features.length > 0 && (
                  <ul className="space-y-2.5 mb-6">
                    {gig.pricing[selectedTier].features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                        <Check size={14} className="text-success flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
                
                {gig.pricing[selectedTier].price > 0 ? (
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handlePurchase} 
                    disabled={purchasing || (user?.role === 'seller' && user?._id === gig.seller?._id)}
                  >
                    {purchasing ? 'Processing...' : `Continue (${formatPrice(gig.pricing[selectedTier].price)})`}
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" disabled>
                    Not Available
                  </Button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => { setSaved(!saved); toast.success(saved ? 'Removed from saved' : 'Gig saved!'); }}>
                <Heart size={16} className={saved ? 'fill-error text-error' : ''} />
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                <Share2 size={16} /> Share
              </Button>
            </div>

            {/* Trust badges */}
            <div className="bg-bg-secondary rounded-2xl border border-border p-5 space-y-3">
              {[
                { icon: Shield, text: 'Secure Payment Protection' },
                { icon: Clock, text: 'On-time Delivery Guarantee' },
                { icon: Award, text: 'Verified Student Seller' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-text-secondary">
                  <Icon size={16} className="text-success flex-shrink-0" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
