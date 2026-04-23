import { CheckCircle2, CircleDashed, Package, RefreshCw, XCircle } from 'lucide-react';

const OrderStatusBadge = ({ status, className = '' }) => {
  const config = {
    pending: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      icon: CircleDashed,
      label: 'Pending Payment',
      border: 'border-warning/20'
    },
    active: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      icon: CircleDashed, // Could use an active spinning icon
      label: 'In Progress',
      border: 'border-primary/20'
    },
    delivered: {
      bg: 'bg-accent/10',
      text: 'text-accent',
      icon: Package,
      label: 'Delivered',
      border: 'border-accent/20'
    },
    revision: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-500',
      icon: RefreshCw,
      label: 'In Revision',
      border: 'border-orange-500/20'
    },
    completed: {
      bg: 'bg-success/10',
      text: 'text-success',
      icon: CheckCircle2,
      label: 'Completed',
      border: 'border-success/20'
    },
    cancelled: {
      bg: 'bg-error/10',
      text: 'text-error',
      icon: XCircle,
      label: 'Cancelled',
      border: 'border-error/20'
    }
  };

  const current = config[status] || config.pending;
  const Icon = current.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${current.bg} ${current.text} ${current.border} ${className}`}>
      <Icon size={14} className={status === 'active' || status === 'revision' ? 'animate-[spin_4s_linear_infinite]' : ''} />
      {current.label}
    </div>
  );
};

export default OrderStatusBadge;
