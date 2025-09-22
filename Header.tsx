import React from 'react';
import { PlusIcon, DownloadIcon, UploadIcon } from '../constants';

interface HeaderProps {
  onAddCustomer: () => void;
  onExport: () => void;
  onImport: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onAddCustomer, onExport, onImport, isLoading }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md mb-8">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          نظام إدارة علاقات العملاء
        </h1>
        <div className="flex items-center gap-x-2">
            <button
              onClick={onImport}
              disabled={isLoading}
              className="flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="استيراد من CSV"
            >
              <UploadIcon />
              <span className="hidden sm:inline mr-2">استيراد</span>
            </button>
            <button
              onClick={onExport}
              disabled={isLoading}
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="تصدير إلى CSV"
            >
              <DownloadIcon />
              <span className="hidden sm:inline mr-2">تصدير</span>
            </button>
            <button
              onClick={onAddCustomer}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
            >
              <PlusIcon />
              <span>إضافة عميل</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;