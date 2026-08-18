import React from 'react';
import Badge from '../ui/Badge';
import { CheckCircle, Clock, AlertCircle, XCircle, RotateCcw } from 'lucide-react';

function OrderStatusBadge({ status }) {
  const getBadgeConfig = (st) => {
    switch ((st || '').toLowerCase()) {
      case 'completed':
        return { variant: 'success', icon: <CheckCircle size={12} /> };
      case 'processing':
        return { variant: 'info', icon: <Clock size={12} /> };
      case 'pending':
        return { variant: 'warning', icon: <AlertCircle size={12} /> };
      case 'cancelled':
        return { variant: 'danger', icon: <XCircle size={12} /> };
      case 'refunded':
        return { variant: 'neutral', icon: <RotateCcw size={12} /> };
      default:
        return { variant: 'neutral', icon: null };
    }
  };

  const { variant, icon } = getBadgeConfig(status);

  return (
    <Badge variant={variant}>
      {icon}
      <span>{status}</span>
    </Badge>
  );
}

export default OrderStatusBadge;
