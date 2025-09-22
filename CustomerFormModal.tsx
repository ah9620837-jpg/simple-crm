
import React, { useState } from 'react';
import { Customer, CustomerStatus } from '../types';
import { CUSTOMER_STATUS_OPTIONS } from '../constants';

interface CustomerFormModalProps {
  customer: Customer | null;
  onSave: (customer: Customer) => void;
  onClose: () => void;
}

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'interactions'>>({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    company: customer?.company || '',
    address: customer?.address || '',
    city: customer?.city || '',
    linkedin: customer?.linkedin || '',
    status: customer?.status || CustomerStatus.Interested,
    followUpDate: customer?.followUpDate || '',
    followUpTime: customer?.followUpTime || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('الاسم والهاتف حقول إلزامية.');
      return;
    }
    const customerToSave: Customer = {
      ...formData,
      id: customer?.id || '',
      interactions: customer?.interactions || [],
    };
    onSave(customerToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{customer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الاسم*</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الشركة</label>
              <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">العنوان</label>
              <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">المدينة</label>
              <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الهاتف*</label>
              <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">رابط لينكدإن (اختياري)</label>
              <input type="url" name="linkedin" id="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الحالة</label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CUSTOMER_STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="followUpDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">تاريخ المتابعة</label>
                <input type="date" name="followUpDate" id="followUpDate" value={formData.followUpDate} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label htmlFor="followUpTime" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">وقت المتابعة</label>
                <input type="time" name="followUpTime" id="followUpTime" value={formData.followUpTime} onChange={handleChange} disabled={!formData.followUpDate} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"/>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition">إلغاء</button>
              <button type="submit" className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition">حفظ</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerFormModal;