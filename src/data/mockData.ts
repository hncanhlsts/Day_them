import { ClassSession, Student, Invoice, PaymentReceipt } from '../types';

export const TUTOR_PROFILE = {
  name: 'Thầy Tuấn Anh',
  fullName: 'Nguyễn Tuấn Anh',
  title: 'Gia sư Chuyên Toán - Lý - Hóa',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKMNSF4BfJJryhjHVdPO_MOqTYaMm8O487utj3UoObfaA7W_hoosxS91ACuCGqTL6fU3jGEDOpME7dtVuen-G1SD5OvVwqBG8pKv6uh2hVGir_w7gYUIVsLrAD8Z2PCfprLOrS43A6KnAnWcmyYwlY8krz-Er8v2ZavZlbFJZbuHBu4thdEJA7JlRPLJwFDnIVDOi-xCZn6MSVtW5MeB0l53Np6PKdlhWRUVSkp94q28Jj7HQXQrRv',
  heroAvatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAJg-Tt_lzDzDQMbchUCKqiUe4swbuXO01avPke9sizjumaEQx1draN8mrdmOxz5s0gbEzHAS6CdF6GlycCGoHhMpYjLfLjH9Sk1Vbp6Ib7yQtJd8rC5PEZoylnW5Nimps0VXzM-GYtQAmhC5bxGAeBBwK0tRMQobSjZvXiLkBAux67fo_JypJJZGz8CpZcs9SQd9XN3ablTcMhhuMCqFcs-KWVdMaXmDV12ClZLXvCHvbmV9zRz_y',
  logoUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1Vr_OeXhw6M8wfn-WBY9LEtd1GwgINvXflbWnWjF0Xbf1FV_S9Oby7UWZ1sgCassN5TkpeHrZdTMBe5nMRgTD3WuWnRF3xTOyxKvnDydQin4_2XG8unYmp4ym4TtT0UkQe74y7r52d8HLNYMgeRxjMuKHxpC4JLd8-wOuhS_3l94TMTnP3n4tmI3GKfCoZU6oKJ7JUVM3aqWf5wSmLXbhaPbIMr5mWAgZXmQb8t4q9DOdEztHLtupS_sA',
  bankName: 'MB Bank (Quân Đội) - CN Ba Đình',
  bankShort: 'MBBank',
  accountNumber: '0988 123 456',
  accountNumberRaw: '0988123456',
  accountHolder: 'NGUYEN TUAN ANH',
};

export const INITIAL_SESSIONS: ClassSession[] = [
  {
    id: 'ses-1',
    timeRange: '08:30 - 10:00',
    durationMinutes: 90,
    status: 'completed',
    statusText: 'Đã hoàn thành',
    subject: 'Toán nâng cao 9',
    gradeBadge: 'Lớp 9',
    studentName: 'Minh Khang',
    location: '120 Hoàng Hoa Thám, Ba Đình',
    locationType: 'home',
    fee: 300000,
    feeNote: 'Đã ghi nợ',
    dayOfWeek: 'T4',
    date: '24/10/2024'
  },
  {
    id: 'ses-2',
    timeRange: '15:00 - 16:30',
    durationMinutes: 90,
    status: 'upcoming_soon',
    statusText: 'Sắp diễn ra sau 30p',
    subject: 'Vật lý 10 – Động học',
    gradeBadge: 'Online',
    studentName: 'Hải Đăng',
    location: 'Google Meet: meet.google.com/xyz-tuand-edu',
    locationType: 'online',
    onlineLink: 'https://meet.google.com/xyz-tuand-edu',
    fee: 220000,
    feeNote: 'Chờ điểm danh',
    dayOfWeek: 'T4',
    date: '24/10/2024'
  },
  {
    id: 'ses-3',
    timeRange: '18:30 - 20:00',
    durationMinutes: 90,
    status: 'upcoming_later',
    statusText: '18:30 tối nay',
    subject: 'Hóa học 11 – Phản ứng Oxi hóa',
    gradeBadge: 'Nhóm 3',
    studentName: 'Nhóm 3 bạn: Lan, Duy, Tuấn',
    studentGroup: ['Lan', 'Duy', 'Tuấn'],
    location: 'Phòng 201 - Studio Gia Sư (Tầng 2)',
    locationType: 'studio',
    fee: 250000,
    feeNote: '250.000 đ / buổi / bạn',
    dayOfWeek: 'T4',
    date: '24/10/2024'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    name: 'Nguyễn Minh Khang',
    initials: 'MK',
    subject: 'Toán Lớp 9',
    gradeBadge: 'Lớp 9',
    classType: '1-kèm-1',
    categoryKey: '1-on-1',
    feePerSession: 300000,
    completedSessions: 7,
    totalSessions: 8,
    statusBadge: 'Thi giữa kỳ',
    statusType: 'urgent',
    parentName: 'Chị Mai',
    parentPhone: '0912.345.xxx',
    goal: 'Đang ôn thi vào lớp 10 Chuyên',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT379ihS2hPmm207bU9lqEogXiUrclBhj3i9Kqnu4jNHOx7h0ZTDtAymoT8V88oJt8LcnbPi_ayt7VuiQ4i3r1Yr4UmXq2i76LMVsYBR-yizpzxdHaV--CJjZffbbNUzpnWc_ifrsrlyikwgQXx1BByn93JlVF8yJ33yjfVNURu4AEmhWvhB9i2bPCBeJhotC3Rt7C9iA4hgCCwnfuM5ZEB8BqYQMhIrVW4z2uA2F4v-PbUJMBifB3'
  },
  {
    id: 'stu-2',
    name: 'Lê Bảo Châu',
    initials: 'BC',
    subject: 'Tiếng Anh IELTS',
    gradeBadge: 'IELTS 6.5',
    classType: 'Nhóm nhỏ',
    categoryKey: 'group',
    feePerSession: 250000,
    completedSessions: 8,
    totalSessions: 8,
    statusBadge: 'Đã đủ buổi',
    statusType: 'success',
    parentName: 'Anh Long',
    parentPhone: '0988.776.655',
    note: 'Cần nhắc làm bài Writing Task 1 trước tối thứ 6.'
  },
  {
    id: 'stu-3',
    name: 'Trần Hải Đăng',
    initials: 'HĐ',
    subject: 'Vật Lý Lớp 10',
    gradeBadge: 'Online',
    classType: 'Lớp Online',
    categoryKey: '1-on-1',
    feePerSession: 220000,
    completedSessions: 5,
    totalSessions: 8,
    statusBadge: 'Nghỉ 1 buổi',
    statusType: 'warning',
    parentName: 'Cô Hạnh',
    parentPhone: '0903.112.233',
    reschedulePlan: 'Lịch bù dự kiến: CN tuần này'
  },
  {
    id: 'stu-4',
    name: 'Phạm Hoàng Nam',
    initials: 'HN',
    subject: 'Hóa Lớp 11',
    gradeBadge: 'Lớp 11',
    classType: '1-kèm-1',
    categoryKey: '1-on-1',
    feePerSession: 280000,
    completedSessions: 6,
    totalSessions: 8,
    statusBadge: 'Ổn định',
    statusType: 'neutral',
    parentName: 'Anh Tuấn',
    parentPhone: '0977.445.566',
    nextLesson: 'Cân bằng phản ứng Oxi hóa khử'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    studentName: 'Nguyễn Minh Khang',
    initials: 'MK',
    subject: 'Toán 12 Cơ bản • Ôn thi ĐGNL',
    parentName: 'Chị Mai',
    parentPhone: '0912.345.xxx',
    dueDate: '25/10',
    sessionCount: 8,
    ratePerSession: 300000,
    totalAmount: 2400000,
    status: 'pending',
    bankMemo: 'HP T10 NGUYEN MINH KHANG',
    sessions: [
      { number: '01', date: '04/10', topic: 'Hàm số & Đạo hàm cấp 1', duration: '90 phút', price: 300000 },
      { number: '02', date: '08/10', topic: 'Cực trị hàm đa thức bậc 3 & 4', duration: '90 phút', price: 300000 },
      { number: '03', date: '11/10', topic: 'Đường tiệm cận đứng và ngang', duration: '90 phút', price: 300000 },
      { number: '04', date: '15/10', topic: 'Ôn tập chương 1 (Đã bù ca 01/10)', duration: 'Đã bù đủ', price: 300000, isMakeup: true },
      { number: '05', date: '18/10', topic: 'Nhận dạng đồ thị & Tương giao', duration: '90 phút', price: 300000 },
      { number: '06', date: '22/10', topic: 'Khái niệm lũy thừa & Hàm số mũ', duration: '90 phút', price: 300000 },
      { number: '07', date: '25/10', topic: 'Phương trình & Bất phương trình Logarit', duration: '90 phút', price: 300000 },
      { number: '08', date: '29/10', topic: 'Luyện đề kiểm tra định kỳ 45 phút', duration: '90 phút', price: 300000, scoreNote: 'Điểm: 8.8' },
    ]
  },
  {
    id: 'inv-2',
    studentName: 'Phạm Hoàng Nam',
    initials: 'HN',
    subject: 'Vật lý 10 • Phụ huynh: Anh Tuấn',
    parentName: 'Anh Tuấn',
    parentPhone: '0977.445.566',
    dueDate: '22/10',
    sessionCount: 6,
    ratePerSession: 280000,
    totalAmount: 1680000,
    status: 'overdue',
    overdueDays: 2,
    bankMemo: 'HOCPHI T10 HOANG NAM',
    sessions: [
      { number: '01', date: '03/10', topic: 'Chuyển động thẳng biến đổi đều', duration: '90 phút', price: 280000 },
      { number: '02', date: '07/10', topic: 'Sự rơi tự do & Gia tốc g', duration: '90 phút', price: 280000 },
      { number: '03', date: '10/10', topic: 'Chuyển động tròn đều', duration: '90 phút', price: 280000 },
      { number: '04', date: '14/10', topic: 'Công thức cộng vận tốc', duration: '90 phút', price: 280000 },
      { number: '05', date: '17/10', topic: 'Ba định luật Newton cơ bản', duration: '90 phút', price: 280000 },
      { number: '06', date: '21/10', topic: 'Lực hấp dẫn & Định luật vạn vật hấp dẫn', duration: '90 phút', price: 280000 }
    ]
  },
  {
    id: 'inv-3',
    studentName: 'Nhóm IELTS (Bảo Châu & Linh)',
    initials: 'IE',
    subject: 'IELTS 6.5 Foundation • 2 học sinh',
    parentName: 'Chị Hà & Chị Thủy',
    parentPhone: '0988.776.xxx',
    dueDate: '27/10',
    sessionCount: 16,
    ratePerSession: 200000,
    totalAmount: 3200000,
    status: 'pending',
    bankMemo: 'HOCPHI T10 IELTS CHAU LINH',
    sessions: [
      { number: '01', date: '02/10', topic: 'Writing Task 1 Overview & Line Graph', duration: '90 phút', price: 400000 },
      { number: '02', date: '05/10', topic: 'Bar Chart & Pie Chart Comparisons', duration: '90 phút', price: 400000 },
      { number: '03', date: '09/10', topic: 'Listening Section 2 Practice & Vocab', duration: '90 phút', price: 400000 },
      { number: '04', date: '12/10', topic: 'Speaking Part 2 Cue Cards Practice', duration: '90 phút', price: 400000 }
    ]
  }
];

export const INITIAL_RECEIPTS: PaymentReceipt[] = [
  {
    id: 'rec-1',
    studentName: 'Trần Quốc Hưng',
    subject: 'Toán 11',
    method: 'VietQR MBBank',
    timeText: '14:20 hôm nay',
    amount: 2400000
  },
  {
    id: 'rec-2',
    studentName: 'Lê Thảo My',
    subject: 'Hóa học 9',
    method: 'Tiền mặt',
    timeText: 'Hôm qua',
    amount: 1800000
  },
  {
    id: 'rec-3',
    studentName: 'Đặng Văn An',
    subject: 'Tiếng Anh 8',
    method: 'Vietcombank',
    timeText: '18/10',
    amount: 2000000
  }
];

export const TOP_CONTRIBUTING_STUDENTS = [
  {
    rank: 1,
    name: 'Nguyễn Hoàng Long',
    subjectBadge: 'Toán 12',
    sessionsText: '12/12 buổi đã dạy',
    amount: 3600000,
    statusText: 'Đã đóng đủ',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJA85dhQJGHgYbR1hesuN_vtAwa5Je3VdEHmQW9I6ESLeLvikEHs6F7z1iAhpi8lx4KWVmZhuCoJsq3hF-T6IcqZEk_is6r5hJSbDBYLnvns0XNNw6xH6UrDi-ZbI5TC4ulkpH0bBNJm4a_Sz_fuOTX0QNXb_3wpqfe9Bz4lPDKOBZTRAuk28dFeiM69FqKPvi3SGooe78dz2LbjyskjMfLb8zJM4nmrq4CftNpHPx5j1W_3ypP3Dy'
  },
  {
    rank: 2,
    name: 'Trần Bảo Trâm',
    subjectBadge: 'IELTS 6.5',
    sessionsText: '10/10 buổi đã dạy',
    amount: 3200000,
    statusText: 'Đã đóng đủ',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsWeGzd7zieFBZe0sUHxv11xCgI72TgfwYTOZQHoQ7a8dmAfakUmQ2P7Xdi6UTIS83BO2bUyCUft309L5tfSVpt22YV8mIijDg3ucu-twnd7pAPU4up_1bUFGuWNo-3-QiHP-kbRJbTEVDFdEJ5hNAJcEuvbscVFnTXXmTKdJ3njytoSZFNGaBZVKHgn-WGHCHne4iQyv-zYtk8Y2UvgZifR_ZEzfcA2nSmlw_6xhTDk2pDQL7i-FG'
  },
  {
    rank: 3,
    name: 'Lê Minh Khôi',
    subjectBadge: 'Vật Lý 11',
    sessionsText: '8/8 buổi đã dạy',
    amount: 2400000,
    statusText: 'Đã đóng đủ',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF6jNe9kECAPKTawK22wvBUj9eI5VwXdojYjcTzhpg36NaEgas1Jfr4v8Uv-kYECV-M-M6kcxGH5QT7YaT_swYsmom5-KENqWRwCvqgSfFk0sc3xMt6-Eh0MVHqQRfzkXLKpWz2xYfAuLa4fFlKAct-5JUQsHiet7W7OWwH5fLS7j_xCcnzwnFk5-cNNjM1H7150rtFBEc_WLSsr-cyGxjZn_bNU9KTUyvhJRxlgfYYxYh8dElj-Sb'
  },
  {
    rank: 4,
    name: 'Nhóm Ôn Thi Hóa 10',
    subjectBadge: '4 Học sinh',
    sessionsText: '6/6 buổi hoàn thành',
    amount: 2100000,
    statusText: 'Còn 1 bạn',
    initials: 'N3'
  }
];
