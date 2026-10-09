import React, { useState } from 'react';
import { ClassSession, TutorProfile } from '../types';

interface ScheduleViewProps {
  tutorProfile: TutorProfile;
  sessions: ClassSession[];
  onOpenAttendance: (studentId: string, sessionId: string) => void;
  onOpenReschedule: (sessionId?: string) => void;
  onOpenAddSession: () => void;
  onOpenCreateClass: () => void;
  onOpenProfile: () => void;
  onShowToast: (msg: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  tutorProfile,
  sessions,
  onOpenAttendance,
  onOpenReschedule,
  onOpenAddSession,
  onOpenCreateClass,
  onOpenProfile,
  onShowToast,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(24);

  const daysOfWeek = [
    { label: 'T2', date: 22, hasDot: true, dotColor: 'bg-outline-variant' },
    { label: 'T3', date: 23, hasDot: true, dotColor: 'bg-outline-variant' },
    { label: 'T4', date: 24, isToday: true, hasDoubleDot: true },
    { label: 'T5', date: 25, hasDot: true, dotColor: 'bg-primary-fixed-dim' },
    { label: 'T6', date: 26, hasDot: true, dotColor: 'bg-primary-fixed-dim' },
    { label: 'T7', date: 27, hasDot: true, dotColor: 'bg-tertiary-fixed-dim' },
    { label: 'CN', date: 28, hasDot: false },
  ];

  const handleEnterOnlineRoom = (session: ClassSession) => {
    if (session.onlineLink) {
      onShowToast(`Đang kết nối phòng học trực tuyến của em ${session.studentName}...`);
      window.open(session.onlineLink, '_blank', 'noopener,noreferrer');
    } else {
      onShowToast(`Mở phòng học trực tuyến cho ${session.studentName}`);
    }
  };

  const pendingSessionsCount = sessions.filter((s) => s.status !== 'completed').length;
  const completedSessionsCount = sessions.filter((s) => s.status === 'completed').length;

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-32 pt-20 gap-4">
      {/* Header / Greeting Section */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] text-primary">calendar_month</span>
            <span>Thứ Tư, 24 Tháng 10</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5 group cursor-pointer" onClick={onOpenProfile}>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight group-hover:text-primary transition-colors">
              Chào buổi chiều, {tutorProfile.name} <span className="inline-block animate-pulse">👋</span>
            </h1>
            <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]" title="Chỉnh sửa hồ sơ & tên">
              edit
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Bạn có <span className="font-bold text-primary">{pendingSessionsCount} ca dạy</span> đang chờ hôm nay. Cố lên nhé!
          </p>
        </div>

        {/* Profile Avatar trigger */}
        <div className="relative shrink-0 cursor-pointer active:scale-95 transition-transform" onClick={onOpenProfile} title="Cài đặt tên & mã QR Bank">
          <div className="w-13 h-13 rounded-full overflow-hidden shadow-sm bg-surface-container-high p-0.5 ring-2 ring-primary/30">
            <img 
              alt="Portrait photo of tutor" 
              className="w-full h-full rounded-full object-cover" 
              src={tutorProfile.heroAvatarUrl || tutorProfile.avatarUrl}
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-secondary rounded-full ring-2 ring-surface-container-lowest"></span>
        </div>
      </div>

      {/* QUICK INLINE ACTION STRIP (Always visible and unmissable) */}
      <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2 rounded-2xl border border-surface-container">
        <button
          type="button"
          onClick={onOpenAddSession}
          className="h-11 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Thêm ca dạy bù / mới</span>
        </button>

        <button
          type="button"
          onClick={onOpenProfile}
          className="h-11 px-3 rounded-xl bg-surface-container-lowest text-primary font-bold text-xs flex items-center justify-center gap-1.5 border border-surface-container-high hover:bg-surface-container transition-all active:scale-95 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">qr_code</span>
          <span>Cài đặt QR Bank &amp; Tên</span>
        </button>
      </div>

      {/* Weekly Calendar Strip */}
      <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-sm border border-surface-container-high/50">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-primary">event_upcoming</span>
            <span>Tuần này (22/10 - 28/10)</span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Tháng 10</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map((day) => {
            const isSelected = selectedDay === day.date;
            return (
              <button
                key={day.date}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-primary-container text-on-primary shadow-md font-bold'
                    : 'hover:bg-surface-container-high text-on-surface-variant'
                }`}
                type="button"
                onClick={() => {
                  setSelectedDay(day.date);
                  onShowToast(`Đã chuyển sang lịch ngày ${day.date}/10`);
                }}
              >
                <span className="font-label-sm text-label-sm opacity-90">{day.label}</span>
                <span className={`font-headline-sm text-headline-sm mt-0.5 ${isSelected ? 'font-bold' : ''}`}>
                  {day.date}
                </span>
                {day.hasDoubleDot ? (
                  <div className="flex items-center gap-0.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></span>
                  </div>
                ) : day.hasDot ? (
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 ${day.dotColor || 'bg-outline-variant'}`}></span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent mt-1"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Daily Classes Card */}
        <div className="col-span-2 bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-[18px] text-primary">auto_stories</span>
              <span>Ca dạy hôm nay</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-amount-display text-amount-display text-on-surface">
                {sessions.length} <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">ca</span>
              </span>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/60 px-2 py-0.5 rounded-full font-bold">
                {completedSessionsCount} xong • {pendingSessionsCount} chờ
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full mt-2.5 overflow-hidden flex">
              <div className="bg-secondary h-full rounded-full transition-all" style={{ width: `${(completedSessionsCount / Math.max(1, sessions.length)) * 100}%` }}></div>
              <div className="bg-tertiary-fixed-dim h-full" style={{ width: `${(pendingSessionsCount / Math.max(1, sessions.length)) * 100}%` }}></div>
            </div>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed ml-3 shadow-inner">
            <span className="material-symbols-outlined text-[26px]">school</span>
          </div>
        </div>

        {/* Hours this week */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm border border-surface-container-high/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Giờ tuần này</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">timelapse</span>
          </div>
          <div className="mt-2">
            <div className="font-headline-md text-headline-md text-on-surface">
              14 <span className="font-label-md text-label-md text-on-surface-variant font-normal">/ 18h</span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '77.7%' }}></div>
            </div>
          </div>
          <span className="font-label-sm text-label-sm text-secondary mt-2 font-bold">Đạt 78% mục tiêu</span>
        </div>

        {/* Expected Earnings */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm border border-surface-container-high/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Thu nhập dự kiến</span>
            <span className="material-symbols-outlined text-[18px] text-tertiary">payments</span>
          </div>
          <div className="mt-2">
            <div className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold truncate">
              18.500.000 <span className="font-label-sm text-label-sm">đ</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px] text-secondary">trending_up</span>
              <span className="text-secondary font-bold">+12%</span> vs tháng trước
            </div>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant mt-2 font-semibold">Tháng 10/2023</span>
        </div>
      </div>

      {/* Timeline Section Title with Action Button */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[22px] text-primary">schedule</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Lịch dạy hôm nay</h2>
        </div>
        <button
          type="button"
          onClick={onOpenAddSession}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-bold shadow-sm active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Thêm ca dạy</span>
        </button>
      </div>

      {/* Timeline List */}
      <div className="flex flex-col gap-3 relative">
        {sessions.map((session, index) => {
          const isCompleted = session.status === 'completed';
          const isSoon = session.status === 'upcoming_soon';

          return (
            <div
              key={session.id}
              className={`bg-surface-container-lowest rounded-2xl p-4 shadow-sm border flex flex-col gap-3 relative overflow-hidden ${
                isSoon ? 'border-2 border-tertiary-fixed-dim/80' : 'border-surface-container-high/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isCompleted ? 'text-secondary' : isSoon ? 'text-tertiary animate-spin' : 'text-on-surface-variant'
                    }`}
                  >
                    {isCompleted ? 'check_circle' : isSoon ? 'alarm' : 'schedule'}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{session.timeRange}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-semibold">
                    {session.durationMinutes} phút
                  </span>
                </div>

                {isCompleted ? (
                  <span className="font-label-sm text-label-sm text-secondary bg-secondary-container px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                    Đã hoàn thành
                  </span>
                ) : isSoon ? (
                  <span className="font-label-sm text-label-sm text-tertiary-container bg-tertiary-fixed px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold animate-pulse">
                    {session.statusText}
                  </span>
                ) : (
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2.5 py-0.5 rounded-full font-bold">
                    {session.statusText}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3 bg-surface-container-low p-3 rounded-xl border border-surface-container">
                <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] text-primary">
                    {session.locationType === 'online' ? 'bolt' : session.subject.includes('Hóa') ? 'science' : 'functions'}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">{session.subject}</span>
                    <span className="font-label-sm text-label-sm text-on-primary-fixed-variant bg-primary-fixed px-1.5 py-0.5 rounded font-bold">
                      {session.gradeBadge}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
                    Học sinh: <span className="font-bold">{session.studentName}</span>
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5 truncate">
                    <span className="material-symbols-outlined text-[15px] text-error">
                      {session.locationType === 'online' ? 'videocam' : 'home_pin'}
                    </span>
                    {session.location}
                  </p>
                </div>
              </div>

              {/* Action Buttons based on status */}
              {isCompleted ? (
                <div className="flex items-center justify-between pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Học phí: <strong className="text-on-surface">{session.fee.toLocaleString('vi-VN')} đ</strong> ({session.feeNote})
                  </span>
                  <button 
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-high text-on-primary-fixed-variant hover:bg-surface-container-highest transition-colors font-label-md text-label-md font-semibold active:scale-95"
                    type="button"
                    onClick={() => onOpenAttendance('stu-1', session.id)}
                  >
                    <span className="material-symbols-outlined text-[16px]">rate_review</span>
                    <span>Xem đánh giá</span>
                  </button>
                </div>
              ) : isSoon ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button 
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md font-bold shadow-sm active:scale-95"
                    type="button"
                    onClick={() => handleEnterOnlineRoom(session)}
                  >
                    <span className="material-symbols-outlined text-[18px]">video_call</span>
                    <span>Vào phòng học</span>
                  </button>
                  <button 
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim transition-colors font-label-md text-label-md font-bold shadow-sm active:scale-95"
                    type="button"
                    onClick={() => onOpenAttendance('stu-3', session.id)}
                  >
                    <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                    <span>Điểm danh</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 font-label-md text-label-md text-primary font-bold">
                    <span className="material-symbols-outlined text-[18px]">sell</span>
                    <span>{session.fee.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-tertiary-fixed/40 text-on-tertiary-fixed-variant hover:bg-tertiary-fixed transition-colors font-label-md text-label-md font-semibold active:scale-95"
                      type="button"
                      onClick={() => onOpenReschedule(session.id)}
                    >
                      <span className="material-symbols-outlined text-[16px]">event_busy</span>
                      <span>Báo nghỉ / Đổi</span>
                    </button>
                    <button 
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors font-label-md text-label-md font-semibold active:scale-95"
                      type="button"
                      onClick={() => onOpenAttendance('stu-4', session.id)}
                    >
                      <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                      <span>Chi tiết</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Motivational Quote Banner */}
      <div className="bg-primary-fixed/40 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm border border-primary-fixed">
        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[20px]">lightbulb</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Mẹo dạy học hiệu quả</span>
          <p className="font-body-sm text-body-sm text-on-surface mt-0.5">
            "Dành 5 phút đầu buổi ôn tập nhanh bài cũ giúp học sinh nhớ lâu hơn 40%."
          </p>
        </div>
      </div>

      {/* Floating Action Button (FAB) - Clear, Elevated, Never Covered */}
      <div className="fixed bottom-24 right-4 z-40">
        <button 
          className="flex items-center gap-2 h-14 px-5 rounded-full bg-primary-container text-on-primary shadow-2xl hover:bg-primary transition-all active:scale-95 group ring-4 ring-white/80"
          type="button"
          onClick={onOpenAddSession}
          title="Thêm ca dạy bù hoặc ca mới"
        >
          <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform">add</span>
          <span className="font-label-lg text-label-lg font-bold pr-1">Thêm ca dạy bù / mới</span>
        </button>
      </div>
    </div>
  );
};
