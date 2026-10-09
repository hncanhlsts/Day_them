import React, { useState } from 'react';
import { ClassSession, Student } from '../types';

interface AddSessionModalProps {
  isOpen: boolean;
  students: Student[];
  onClose: () => void;
  onSave: (newSession: ClassSession) => void;
  onShowToast: (msg: string) => void;
}

export const AddSessionModal: React.FC<AddSessionModalProps> = ({
  isOpen,
  students,
  onClose,
  onSave,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'stu-1');
  const [sessionType, setSessionType] = useState<'regular' | 'makeup' | 'extra'>('makeup');
  const [date, setDate] = useState('25/10/2024');
  const [dayOfWeek, setDayOfWeek] = useState('T5');
  const [startTime, setStartTime] = useState('18:30');
  const [endTime, setEndTime] = useState('20:00');
  const [locationType, setLocationType] = useState<'home' | 'studio' | 'online'>('home');
  const [locationAddress, setLocationAddress] = useState('120 Hoàng Hoa Thám, Ba Đình');
  const [onlineLink, setOnlineLink] = useState('https://meet.google.com/xyz-tuand-edu');
  const [fee, setFee] = useState('300.000');
  const [note, setNote] = useState('Ca dạy bù do học sinh bận thi giữa kỳ tuần trước.');

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleStudentChange = (id: string) => {
    setSelectedStudentId(id);
    const found = students.find((s) => s.id === id);
    if (found) {
      setFee(found.feePerSession.toLocaleString('vi-VN'));
    }
  };

  const handleSave = () => {
    const cleanFee = parseInt(fee.replace(/\D/g, ''), 10) || 300000;
    const timeRange = `${startTime} – ${endTime}`;

    const newSession: ClassSession = {
      id: `ses-${Date.now()}`,
      timeRange,
      durationMinutes: 90,
      status: 'upcoming_later',
      statusText: sessionType === 'makeup' ? 'Ca dạy bù' : 'Ca mới',
      subject: selectedStudent ? selectedStudent.subject : 'Toán nâng cao',
      gradeBadge: selectedStudent ? selectedStudent.gradeBadge : 'Lớp 9',
      studentName: selectedStudent ? selectedStudent.name : 'Học sinh',
      location: locationType === 'online' ? `Google Meet: ${onlineLink}` : locationAddress,
      locationType,
      onlineLink: locationType === 'online' ? onlineLink : undefined,
      fee: cleanFee,
      feeNote: sessionType === 'makeup' ? 'Dạy bù không tính thêm phí' : 'Chờ điểm danh',
      dayOfWeek,
      date,
    };

    onSave(newSession);
    onShowToast(`Đã thêm ${sessionType === 'makeup' ? 'ca dạy bù' : 'ca mới'} cho em ${newSession.studentName} thành công!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/60 backdrop-blur-sm transition-all duration-300 p-0 sm:p-4">
      <div className="w-full max-w-lg bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom-6 border border-surface-container">
        {/* Header */}
        <div className="w-full p-4 bg-surface-container-lowest border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">more_time</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                Thêm Ca Dạy Bù / Mới
              </h2>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                Lên lịch ca dạy linh hoạt trong tuần
              </span>
            </div>
          </div>
          <button
            aria-label="Đóng"
            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors shrink-0"
            type="button"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Loại ca dạy */}
          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant font-bold block">
              Phân loại ca dạy:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                className={`py-2 px-2 rounded-xl text-[12px] font-bold border transition-all ${
                  sessionType === 'makeup'
                    ? 'bg-secondary-container text-on-secondary-container border-secondary shadow-sm'
                    : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                }`}
                onClick={() => setSessionType('makeup')}
              >
                Ca dạy bù
              </button>
              <button
                type="button"
                className={`py-2 px-2 rounded-xl text-[12px] font-bold border transition-all ${
                  sessionType === 'regular'
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                }`}
                onClick={() => setSessionType('regular')}
              >
                Ca chính khóa
              </button>
              <button
                type="button"
                className={`py-2 px-2 rounded-xl text-[12px] font-bold border transition-all ${
                  sessionType === 'extra'
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary shadow-sm'
                    : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                }`}
                onClick={() => setSessionType('extra')}
              >
                Ca phụ đạo thêm
              </button>
            </div>
          </div>

          {/* Chọn Học sinh / Lớp */}
          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container space-y-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant font-bold block">
              Chọn học sinh / lớp học <span className="text-error">*</span>
            </label>
            <select
              className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/20 font-bold"
              value={selectedStudentId}
              onChange={(e) => handleStudentChange(e.target.value)}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.subject} ({s.classType})
                </option>
              ))}
            </select>
          </div>

          {/* Ngày & Giờ học */}
          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container space-y-3">
            <h3 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">calendar_month</span>
              Thời gian ca dạy
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Thứ
                </label>
                <select
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                >
                  <option value="T2">Thứ Hai (T2)</option>
                  <option value="T3">Thứ Ba (T3)</option>
                  <option value="T4">Thứ Tư (T4)</option>
                  <option value="T5">Thứ Năm (T5)</option>
                  <option value="T6">Thứ Sáu (T6)</option>
                  <option value="T7">Thứ Bảy (T7)</option>
                  <option value="CN">Chủ Nhật (CN)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Ngày (dd/mm/yyyy)
                </label>
                <input
                  type="text"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Bắt đầu
                </label>
                <input
                  type="time"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Kết thúc
                </label>
                <input
                  type="time"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Địa điểm & Học phí */}
          <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container space-y-3">
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Hình thức &amp; Địa điểm
              </label>
              <div className="grid grid-cols-3 gap-1.5 pb-2">
                <button
                  type="button"
                  className={`py-2 px-2 rounded-xl text-[12px] font-bold border transition-all ${
                    locationType === 'home'
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                  }`}
                  onClick={() => setLocationType('home')}
                >
                  Tại nhà HS
                </button>
                <button
                  type="button"
                  className={`py-2 px-2 rounded-xl text-[12px] font-bold border transition-all ${
                    locationType === 'studio'
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                  }`}
                  onClick={() => setLocationType('studio')}
                >
                  Tại studio
                </button>
                <button
                  type="button"
                  className={`py-2 px-2 rounded-xl text-[12px] font-bold border transition-all ${
                    locationType === 'online'
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                  }`}
                  onClick={() => setLocationType('online')}
                >
                  Google Meet
                </button>
              </div>

              {locationType === 'online' ? (
                <input
                  type="url"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="https://meet.google.com/xyz"
                  value={onlineLink}
                  onChange={(e) => setOnlineLink(e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Địa chỉ học"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                />
              )}
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Học phí ca này (VNĐ)
              </label>
              <input
                type="text"
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-amount-display text-headline-sm text-primary font-bold outline-none focus:ring-2 focus:ring-primary/20"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Ghi chú ca dạy
              </label>
              <input
                type="text"
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Lý do bù hoặc lưu ý chuẩn bị..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-lowest border-t border-surface-container flex gap-2">
          <button
            type="button"
            className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="button"
            className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all hover:bg-primary-container"
            onClick={handleSave}
          >
            <span className="material-symbols-outlined text-[20px]">add_task</span>
            <span>Thêm ca ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
