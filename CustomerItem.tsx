import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Customer, CustomerStatus } from '../types';
import StatusBadge from './StatusBadge';
import { EditIcon, TrashIcon, ClockIcon, MessageSquareIcon, WhatsAppIcon, CUSTOMER_STATUS_OPTIONS } from '../constants';

interface CustomerItemProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onViewInteractions: (customer: Customer) => void;
  onUpdateStatus: (customerId: string, status: CustomerStatus) => void;
}

const CustomerItem: React.FC<CustomerItemProps> = ({ customer, onEdit, onDelete, onViewInteractions, onUpdateStatus }) => {
  const { id, name, company, email, phone, status, followUpDate, followUpTime, interactions, linkedin, address, city } = customer;
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
        setIsStatusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusChange = (newStatus: CustomerStatus) => {
    if (newStatus !== status && window.confirm(`هل أنت متأكد من تغيير حالة العميل إلى "${newStatus}"؟`)) {
      onUpdateStatus(id, newStatus);
    }
    setIsStatusMenuOpen(false);
  };

  const formattedWhatsApp = `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;

  const followUpInfo = useMemo(() => {
    if (!followUpDate) return null;

    const now = new Date();
    const followUpDateTime = new Date(`${followUpDate}T${followUpTime || '00:00:00'}`);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const followUpDay = new Date(followUpDate);
    followUpDay.setHours(0,0,0,0);


    let text = `متابعة في: ${followUpDateTime.toLocaleDateString('ar-EG')}`;
    if (followUpTime) {
      text += ` الساعة ${followUpDateTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Overdue
    if (followUpDateTime < now) {
      return {
        badgeClassName: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        badgeText: `فات موعدها: ${followUpDateTime.toLocaleDateString('ar-EG')}`,
        cardBorderColor: 'border-red-500 dark:border-red-400',
        cardBgColor: 'bg-red-50/60 dark:bg-red-900/25'
      };
    }
    
    // Due Today
    if (followUpDay.getTime() === today.getTime()) {
      return {
        badgeClassName: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 animate-pulse',
        badgeText: `متابعة اليوم الساعة ${followUpDateTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`,
        cardBorderColor: 'border-yellow-500 dark:border-yellow-400',
        cardBgColor: 'bg-yellow-50/60 dark:bg-yellow-900/25'
      };
    }

    // Future
    return {
      badgeClassName: 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200',
      badgeText: text,
      cardBorderColor: 'border-slate-400 dark:border-slate-500',
      cardBgColor: 'bg-slate-50 dark:bg-slate-700'
    };
  }, [followUpDate, followUpTime]);

  const cardBgColor = followUpInfo?.cardBgColor || 'bg-slate-50 dark:bg-slate-700';
  const cardBorderColor = followUpInfo?.cardBorderColor || 'border-transparent';

  return (
    <div className={`${cardBgColor} rounded-lg shadow-md p-5 border-2 ${cardBorderColor} flex flex-col justify-between transition-all duration-300 hover:shadow-xl`}>
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{name}</h3>
          <div className="relative" ref={statusMenuRef}>
            <button onClick={() => setIsStatusMenuOpen(prev => !prev)} aria-haspopup="true" aria-expanded={isStatusMenuOpen}>
                <StatusBadge status={status} />
            </button>
            {isStatusMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-10 animate-fade-in-up">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {CUSTOMER_STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="block w-full text-right px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      role="menuitem"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{company}</p>
        
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p><strong>البريد:</strong> <a href={`mailto:${email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{email}</a></p>
          <p><strong>الهاتف:</strong> <a href={formattedWhatsApp} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">{phone}<WhatsAppIcon /></a></p>
          {address && <p><strong>العنوان:</strong> {address}</p>}
          {city && <p><strong>المدينة:</strong> {city}</p>}
          {linkedin && <p><strong>لينكدإن:</strong> <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">الملف الشخصي</a></p>}
        </div>

        {followUpInfo && (
          <div className={`mt-4 flex items-center text-sm p-2 rounded-md ${followUpInfo.badgeClassName}`}>
            <ClockIcon />
            <span className="mr-2">{followUpInfo.badgeText}</span>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-600 mt-4 pt-4 flex justify-between items-center">
        <button
          onClick={() => onViewInteractions(customer)}
          className="flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300"
          aria-label="عرض التفاعلات"
        >
          <MessageSquareIcon />
          <span className="mr-1">({interactions.length})</span>
        </button>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(customer)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300" aria-label="تعديل"><EditIcon/></button>
          <button onClick={() => onDelete(id)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400" aria-label="حذف"><TrashIcon /></button>
        </div>
      </div>
    </div>
  );
};

export default CustomerItem;