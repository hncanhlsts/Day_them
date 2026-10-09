export type TabType = 'lich-day' | 'lop-hoc' | 'hoc-phi' | 'bao-cao';

export type ScreenType = 
  | 'main' 
  | 'create-class' 
  | 'reschedule-session' 
  | 'attendance-feedback';

export interface ClassSession {
  id: string;
  timeRange: string;
  durationMinutes: number;
  status: 'completed' | 'upcoming_soon' | 'upcoming_later' | 'canceled';
  statusText: string;
  subject: string;
  gradeBadge: string;
  studentName: string;
  location: string;
  locationType: 'home' | 'online' | 'studio';
  fee: number;
  feeNote: string;
  onlineLink?: string;
  studentGroup?: string[];
  dayOfWeek: string;
  date: string;
}

export interface Student {
  id: string;
  name: string;
  initials: string;
  subject: string;
  gradeBadge: string;
  classType: '1-kèm-1' | 'Nhóm nhỏ' | 'Lớp Online';
  categoryKey: '1-on-1' | 'group' | 'urgent';
  feePerSession: number;
  completedSessions: number;
  totalSessions: number;
  statusBadge: string;
  statusType: 'success' | 'warning' | 'urgent' | 'neutral';
  parentName: string;
  parentPhone: string;
  note?: string;
  goal?: string;
  nextLesson?: string;
  reschedulePlan?: string;
  avatarUrl?: string;
}

export interface Invoice {
  id: string;
  studentName: string;
  initials: string;
  subject: string;
  parentName: string;
  parentPhone: string;
  dueDate: string;
  sessionCount: number;
  ratePerSession: number;
  totalAmount: number;
  status: 'pending' | 'overdue' | 'settled';
  overdueDays?: number;
  bankMemo: string;
  sessions: {
    number: string;
    date: string;
    topic: string;
    duration: string;
    price: number;
    scoreNote?: string;
    isMakeup?: boolean;
  }[];
}

export interface PaymentReceipt {
  id: string;
  studentName: string;
  subject: string;
  method: string;
  timeText: string;
  amount: number;
}

export interface TutorProfile {
  name: string;
  fullName: string;
  title: string;
  avatarUrl: string;
  heroAvatarUrl: string;
  logoUrl: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountNumberRaw: string;
  accountHolder: string;
  qrCodeUrl?: string;
}
