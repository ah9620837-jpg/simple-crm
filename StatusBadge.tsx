
import React from 'react';
import { CustomerStatus } from '../types';
import { CUSTOMER_STATUS_COLORS } from '../constants';

interface StatusBadgeProps {
  status: CustomerStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClasses = CUSTOMER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
