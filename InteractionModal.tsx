
import React, { useState } from 'react';
import { Customer, Interaction, InteractionType } from '../types';

interface InteractionModalProps {
  customer: Customer;
  onClose: () => void;
  onSave: (customerId: string, interactions: Interaction[]) => void;
}

const InteractionModal: React.FC<InteractionModalProps> = ({ customer, onClose, onSave }) => {
  const [interactions, setInteractions] = useState<Interaction[]>(customer.interactions);
  const [newInteractionType, setNewInteractionType] = useState<InteractionType>(InteractionType.Call);
  const [newInteractionNotes, setNewInteractionNotes] = useState('');

  const handleAddInteraction = () => {
    if (!newInteractionNotes.trim()) {
      alert('يرجى كتابة ملاحظات للتفاعل.');
      return;
    }
    const newInteraction: Interaction = {
      id: Date.now().toString(),
      type: newInteractionType,
      notes: newInteractionNotes,
      date: new Date().toISOString(),
    };
    const updatedInteractions = [newInteraction, ...interactions];
    setInteractions(updatedInteractions);
    onSave(customer.id, updatedInteractions);
    setNewInteractionNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">سجل التفاعلات لـ {customer.name}</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={newInteractionType}
              onChange={(e) => setNewInteractionType(e.target.value as InteractionType)}
              className="md:col-span-1 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.values(InteractionType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="أضف ملاحظاتك هنا..."
              value={newInteractionNotes}
              onChange={(e) => setNewInteractionNotes(e.target.value)}
              className="md:col-span-2 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddInteraction}
            className="w-full px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            إضافة تفاعل جديد
          </button>
        </div>

        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          {interactions.length > 0 ? (
            interactions.map(interaction => (
              <div key={interaction.id} className="p-4 rounded-md bg-slate-100 dark:bg-slate-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{interaction.type}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(interaction.date).toLocaleString('ar-EG')}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{interaction.notes}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400">لا توجد تفاعلات مسجلة.</p>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 text-left">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractionModal;
