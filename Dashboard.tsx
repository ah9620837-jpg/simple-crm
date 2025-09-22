import React, { useMemo } from 'react';
import { Customer } from '../types';
import { BellIcon, ClockIcon } from '../constants';

interface DashboardProps {
  customers: Customer[];
}

const Dashboard: React.FC<DashboardProps> = ({ customers }) => {
  const { dueToday, overdue } = useMemo(() => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueToday: Customer[] = [];
    const overdue: Customer[] = [];

    customers.forEach(customer => {
      if (!customer.followUpDate) return;
      
      const followUpDateTime = new Date(`${customer.followUpDate}T${customer.followUpTime || '00:00:00'}`);
      
      const followUpDay = new Date(customer.followUpDate);
      followUpDay.setHours(0,0,0,0);

      if (followUpDateTime < now) {
          overdue.push(customer);
      } else if (followUpDay.getTime() === today.getTime()) {
          dueToday.push(customer);
      }
    });

    return { dueToday, overdue };
  }, [customers]);
  
  if (dueToday.length === 0 && overdue.length === 0) {
      return null;
  }

  return (
    <div className="mb-8 p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
            <BellIcon />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">تذكيرات المتابعة</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/50 p-4 rounded-lg">
                <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">متابعات اليوم ({dueToday.length})</h3>
                {dueToday.length > 0 ? (
                    <ul className="space-y-2">
                        {dueToday.map(c => <li key={c.id} className="text-sm text-slate-700 dark:text-slate-300">{c.name} - {c.company}</li>)}
                    </ul>
                ) : <p className="text-sm text-slate-500 dark:text-slate-400">لا توجد متابعات لليوم.</p>}
            </div>
             <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
                <h3 className="font-bold text-red-800 dark:text-red-200 mb-2">متابعات متأخرة ({overdue.length})</h3>
                {overdue.length > 0 ? (
                    <ul className="space-y-2">
                        {overdue.map(c => <li key={c.id} className="text-sm text-slate-700 dark:text-slate-300">{c.name} - {c.company}</li>)}
                    </ul>
                ) : <p className="text-sm text-slate-500 dark:text-slate-400">لا توجد متابعات متأخرة.</p>}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
