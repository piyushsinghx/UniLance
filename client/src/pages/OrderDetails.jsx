import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  Clock,
  RefreshCw,
  CheckCircle2,
  Download,
  UploadCloud,
  MessageSquare,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import OrderStatusBadge from '../components/OrderStatusBadge';
import ReviewForm from '../components/ReviewForm';
import { PageLoader } from '../components/Loader';
import useAuth from '../hooks/useAuth';
import { SocketContext } from '../context/SocketContext';
import { getOrderById, deliverOrder, requestRevision, acceptDelivery } from '../services/orderService';
import { uploadMultipleImages } from '../services/uploadService';
import { formatPrice, formatDate } from '../utils/formatDate';

const workflowProgress = {
  pending: 0,
  active: 33,
  delivered: 66,
  revision: 66,
  completed: 100,
  cancelled: 0,
};

const deliveredStatuses = ['delivered', 'revision', 'completed'];

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket } = useContext(SocketContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deliveryFiles, setDeliveryFiles] = useState([]);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [revisionMessage, setRevisionMessage] = useState('');
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const handleOrderUpdate = (updatedOrder) => {
      if (updatedOrder._id === id) {
        setOrder(updatedOrder);
      }
    };

    socket.on('orderStatusUpdate', handleOrderUpdate);
    return () => socket.off('orderStatusUpdate', handleOrderUpdate);
  }, [socket, id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliver = async (e) => {
    e.preventDefault();

    if (!deliveryMessage.trim()) {
      toast.error('Please add a delivery summary before sending files.');
      return;
    }

    try {
      setActionLoading(true);
      let uploadedFiles = [];

      if (deliveryFiles.length > 0) {
        const uploadData = new FormData();
        deliveryFiles.forEach((file) => uploadData.append('images', file));
        const res = await uploadMultipleImages(uploadData);
        uploadedFiles = res.data.urls || [];
      }

      await deliverOrder(id, {
        deliveryFiles: uploadedFiles,
        deliveryMessage: deliveryMessage.trim(),
      });

      toast.success('Delivery sent successfully.');
      setShowDeliveryForm(false);
      setDeliveryFiles([]);
      setDeliveryMessage('');
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit delivery');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevision = async (e) => {
    e.preventDefault();

    if (!revisionMessage.trim()) {
      toast.error('Please explain the revision needed.');
      return;
    }

    try {
      setActionLoading(true);
      await requestRevision(id, { message: revisionMessage.trim() });
      toast.success('Revision requested');
      setShowRevisionForm(false);
      setRevisionMessage('');
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request revision');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!window.confirm('Accept this delivery and complete the order?')) {
      return;
    }

    try {
      setActionLoading(true);
      await acceptDelivery(id);
      toast.success('Order completed successfully.');
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept delivery');
    } finally {
      setActionLoading(false);
    }
  };

  const getFileHref = (file) => {
    const filePath = typeof file === 'string' ? file : file?.url;
    if (!filePath) {
      return '#';
    }

    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    return `${import.meta.env.VITE_API_URL || ''}${filePath}`;
  };

  if (loading) return <PageLoader />;
  if (!order) return <div className="text-center py-20 text-text-primary">Order not found.</div>;

  const isSeller = user?._id === order.seller?._id;
  const isBuyer = user?._id === order.buyer?._id;
  const hasDelivery = deliveredStatuses.includes(order.status) && (order.deliveryMessage || order.deliveryFiles?.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-bg-secondary rounded-2xl border border-border p-6 sm:p-8 shadow-xl shadow-black/10">
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-text-primary mb-2">Order Tracking</h1>
                <p className="text-sm text-text-secondary">
                  Order ID: <span className="font-mono text-primary">{order._id}</span>
                </p>
              </div>
              <OrderStatusBadge status={order.status} className="px-3 py-1.5 text-sm" />
            </div>

            <div className="relative mt-10 mb-8 max-w-3xl mx-auto px-4">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-bg-card -translate-y-1/2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-700"
                  style={{ width: `${workflowProgress[order.status] || 0}%` }}
                ></div>
              </div>

              <div className="relative flex justify-between">
                {[
                  { label: 'Pending', icon: Package, active: ['pending', 'active', 'delivered', 'revision', 'completed'].includes(order.status) },
                  { label: 'Active', icon: Clock, active: ['active', 'delivered', 'revision', 'completed'].includes(order.status) },
                  { label: 'Delivered', icon: UploadCloud, active: ['delivered', 'revision', 'completed'].includes(order.status) },
                  { label: 'Completed', icon: CheckCircle2, active: order.status === 'completed' },
                ].map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-bg-secondary transition-colors duration-500 ${step.active ? 'bg-primary text-white' : 'bg-bg-card text-text-muted'}`}>
                        <Icon size={16} />
                      </div>
                      <span className={`text-xs font-semibold mt-2 ${step.active ? 'text-primary' : 'text-text-muted'}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.status === 'pending' && (
              <div className="rounded-xl border border-warning/20 bg-warning/10 p-4 text-sm text-text-secondary">
                Payment is being processed. The order becomes active as soon as Razorpay confirms the transaction.
              </div>
            )}

            {hasDelivery && (
              <div className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-sm">Latest Delivery</h3>
                    <p className="text-xs text-text-secondary">
                      {formatDate(order.deliveredAt || order.updatedAt)}
                    </p>
                  </div>
                </div>

                {order.deliveryMessage && (
                  <div className="bg-bg-secondary border border-border rounded-lg p-4 mb-4">
                    <p className="text-sm text-text-primary whitespace-pre-line">{order.deliveryMessage}</p>
                  </div>
                )}

                {order.deliveryFiles?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.deliveryFiles.map((file, index) => (
                      <a
                        key={`${getFileHref(file)}-${index}`}
                        href={getFileHref(file)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm bg-bg-card border border-border p-3 rounded-lg hover:border-primary transition-colors hover:text-primary"
                      >
                        <Download size={16} /> Delivery file {index + 1}
                      </a>
                    ))}
                  </div>
                )}

                {isBuyer && order.status === 'delivered' && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Button onClick={handleAccept} disabled={actionLoading} className="flex-1 bg-success hover:bg-success/90">
                      Accept & Complete
                    </Button>
                    <Button variant="outline" onClick={() => setShowRevisionForm(true)} disabled={actionLoading} className="border-error text-error hover:bg-error/10">
                      Request Revision
                    </Button>
                  </div>
                )}
              </div>
            )}

            {order.revisionRequests?.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="font-bold text-text-primary text-sm mb-4">Revision History</h3>
                {order.revisionRequests.map((revision, index) => (
                  <div key={`${revision.requestedAt}-${index}`} className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2 text-orange-500">
                      <RefreshCw size={16} />
                      <span className="font-bold text-sm">Revision Requested</span>
                      <span className="text-xs ml-auto opacity-70">{formatDate(revision.requestedAt)}</span>
                    </div>
                    <p className="text-sm text-text-primary">{revision.message}</p>
                    {revision.resolvedAt && (
                      <p className="text-xs text-text-secondary mt-3">Resolved on {formatDate(revision.resolvedAt)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isSeller && ['active', 'revision'].includes(order.status) && (
              <div className="mt-8 pt-6 border-t border-border">
                {!showDeliveryForm ? (
                  <Button onClick={() => setShowDeliveryForm(true)} className="w-full">
                    <UploadCloud size={18} className="mr-2" /> Deliver Project
                  </Button>
                ) : (
                  <form onSubmit={handleDeliver} className="space-y-4 bg-bg-secondary border border-border rounded-xl p-6">
                    <h3 className="font-bold text-text-primary">Deliver Your Work</h3>
                    <FileUpload multiple={true} accept="*" onUploadSelect={(files) => setDeliveryFiles(files)} />
                    <textarea
                      placeholder="Describe what you delivered and any important notes for the buyer..."
                      rows={4}
                      className="w-full bg-bg-primary border border-border rounded-xl p-3 text-sm text-text-primary focus:outline-none focus:border-primary"
                      value={deliveryMessage}
                      onChange={(e) => setDeliveryMessage(e.target.value)}
                    ></textarea>
                    <div className="flex gap-3 justify-end pt-2">
                      <Button type="button" variant="secondary" onClick={() => setShowDeliveryForm(false)}>Cancel</Button>
                      <Button type="submit" disabled={actionLoading}>{actionLoading ? 'Uploading...' : 'Submit Delivery'}</Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {isBuyer && showRevisionForm && (
              <form onSubmit={handleRevision} className="mt-6 space-y-4 bg-bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold text-text-primary">Request Revision</h3>
                <p className="text-xs text-text-secondary">Be specific about what needs to change so the seller can revise quickly.</p>
                <textarea
                  placeholder="Explain the changes required..."
                  rows={4}
                  required
                  className="w-full bg-bg-primary border border-border rounded-xl p-3 text-sm text-text-primary focus:outline-none focus:border-error focus:ring-1 focus:ring-error"
                  value={revisionMessage}
                  onChange={(e) => setRevisionMessage(e.target.value)}
                ></textarea>
                <div className="flex gap-3 justify-end pt-2">
                  <Button type="button" variant="secondary" onClick={() => setShowRevisionForm(false)}>Cancel</Button>
                  <Button type="submit" disabled={actionLoading} className="bg-error hover:bg-error/90 border-error">Submit Revision</Button>
                </div>
              </form>
            )}

            {/* Review Form - after order completion */}
            {isBuyer && order.status === 'completed' && !reviewSubmitted && (
              <div className="mt-8">
                <ReviewForm
                  gigId={order.gig?._id}
                  gigTitle={order.gig?.title || 'this gig'}
                  onReviewSubmitted={() => setReviewSubmitted(true)}
                />
              </div>
            )}
            {reviewSubmitted && (
              <div className="mt-8 bg-success/10 border border-success/20 rounded-xl p-6 text-center">
                <CheckCircle2 size={32} className="text-success mx-auto mb-3" />
                <p className="font-semibold text-text-primary">Thank you for your review!</p>
                <p className="text-sm text-text-secondary mt-1">Your feedback helps other buyers make informed decisions.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <div className="bg-bg-secondary rounded-2xl border border-border p-6 shadow-xl shadow-black/10">
            <h3 className="font-bold text-text-primary text-sm mb-4 pb-2 border-b border-border">Order Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-text-muted">Item</span>
                <span className="text-text-primary font-medium text-right max-w-[150px] truncate">{order.gig?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tier</span>
                <span className="text-text-primary font-medium capitalize">{order.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Price</span>
                <span className="text-text-primary font-bold">{formatPrice(order.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Payment</span>
                <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}`}>
                  {order.paymentStatus === 'paid' ? 'Paid via Razorpay' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Date Placed</span>
                <span className="text-text-primary font-medium">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Due Date</span>
                <span className="text-text-primary font-medium">{formatDate(order.deliveryDate)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                {isSeller ? 'Buyer' : 'Seller'}
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                  {(isSeller ? order.buyer.name : order.seller.name).charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">{isSeller ? order.buyer.name : order.seller.name}</p>
                  <Link to={`/messages?to=${isSeller ? order.buyer._id : order.seller._id}`} className="text-xs text-primary hover:text-primary-hover flex items-center gap-1 mt-1">
                    <MessageSquare size={12} /> Message
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Requirements Provided</h4>
              <p className="text-sm text-text-secondary italic">"{order.requirements || 'None'}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
