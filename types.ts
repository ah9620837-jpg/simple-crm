
export enum CustomerStatus {
  Interested = 'مهتم',
  Meeting = 'اجتماع',
  ProposalSent = 'عرض مرسل',
  ClosedWon = 'تم الإغلاق (نجاح)',
  ClosedLost = 'تم الإغلاق (فشل)',
}

export enum InteractionType {
  Call = 'مكالمة',
  WhatsApp = 'واتساب',
  Email = 'بريد إلكتروني',
}

export interface Interaction {
  id: string;
  type: InteractionType;
  notes: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  address?: string;
  city?: string;
  linkedin?: string;
  status: CustomerStatus;
  interactions: Interaction[];
  followUpDate?: string;
  followUpTime?: string;
}

export interface FilterState {
  text: string;
  status: CustomerStatus | '';
  startDate: string;
  endDate: string;
}