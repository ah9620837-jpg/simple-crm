import React from 'react';
import { Customer, CustomerStatus, FilterState } from '../types';
import CustomerItem from './CustomerItem';
import { CUSTOMER_STATUS_OPTIONS } from '../constants';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onViewInteractions: (customer: Customer) => void;
  onUpdateStatus: (customerId: string, status: CustomerStatus) => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ customers, onEdit, onDelete, onViewInteractions, onUpdateStatus, filters, onFilterChange }) => {
    
  const handleClearFilters = () => {
    onFilterChange({ text: '', status: '', startDate: '', endDate: '' });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg">
      <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">قائمة العملاء ({customers.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            <div className="sm:col-span-2 lg:col-span-3">
                <label htmlFor="searchText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">بحث</label>
                <input
                    id="searchText"
                    type="text"
                    placeholder="ابحث بالاسم, الشركة, الهاتف..."
                    value={filters.text}
                    onChange={(e) => onFilterChange({ text: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            <div>
                <label htmlFor="searchStatus" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الحالة</label>
                <select 
                    id="searchStatus"
                    value={filters.status}
                    onChange={(e) => onFilterChange({ status: e.target.value as CustomerStatus | '' })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">كل الحالات</option>
                    {CUSTOMER_STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            <div>
                 <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">من تاريخ متابعة</label>
                 <input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => onFilterChange({ startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
             <div>
                 <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">إلى تاريخ متابعة</label>
                 <input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => onFilterChange({ endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="sm:col-span-2 lg:col-span-2">
                 <button 
                    onClick={handleClearFilters}
                    className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
                >
                    مسح الفلاتر
                </button>
            </div>
          </div>
      </div>
      
      {customers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map(customer => (
            <CustomerItem
              key={customer.id}
              customer={customer}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewInteractions={onViewInteractions}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-500 dark:text-slate-400 text-lg">لا يوجد عملاء يطابقون معايير البحث.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerList;