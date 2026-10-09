import React, { useState } from 'react';
import { TUTOR_PROFILE } from '../data/mockData';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onShowToast: (msg: string) => void;
  onOpenCreateClass: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onShowToast, onOpenCreateClass }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'lich-day': return 'Lịch Dạy';
      case 'lop-hoc': return 'Lớp Học';
      case 'hoc-phi': return 'Học Phí';
      case 'bao-cao': return 'Báo Cáo';
      default: return 'Gia Sư Pro';
    }
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-surface-container-lowest/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/60">
        <div className="max-w-xl mx-auto h-16 px-4 flex items-center justify-between gap-3">
          {/* Logo & Tab Indicator */}
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              alt="Logo Gia Sư Pro" 
              className="h-8 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity" 
              src={TUTOR_PROFILE.logoUrl}
              onClick={() => onShowToast('Gia Sư Pro - Phiên bản 2024.10')}
            />
            <div className="flex flex-col min-w-0">
              <span className="font-headline-sm text-headline-sm text-primary tracking-tight truncate leading-tight">
                Gia Sư Pro
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
                {getTabLabel(currentTab)}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                aria-label="Thông báo ca dạy" 
                className="relative w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                    <span className="font-label-md text-label-md text-on-surface font-bold">Thông báo mới</span>
                    <button 
                      className="text-primary text-[12px] font-semibold hover:underline"
                      onClick={() => {
                        setShowNotifications(false);
                        onShowToast('Đã đánh dấu đã đọc tất cả!');
                      }}
                    >
                      Đã đọc hết
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 pt-2 max-h-64 overflow-y-auto">
                    <div className="p-2 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">alarm</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-label-md text-label-md text-on-surface font-semibold truncate">Ca Vật lý 10 sắp bắt đầu</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Lớp em Hải Đăng qua Google Meet lúc 15:00 hôm nay.</p>
                        <span className="text-[11px] text-outline mt-1 block">15 phút trước</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">payments</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-label-md text-label-md text-on-surface font-semibold truncate">Nhận học phí thành công</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Phụ huynh em Quốc Hưng đã chuyển 2.400.000đ qua VietQR MBBank.</p>
                        <span className="text-[11px] text-outline mt-1 block">Hôm nay 14:20</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">event_repeat</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-label-md text-label-md text-on-surface font-semibold truncate">Lịch bù Hóa học 11</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">Nhóm 3 bạn xin phép học bù vào sáng Chủ nhật 28/10.</p>
                        <span className="text-[11px] text-outline mt-1 block">Hôm qua</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button 
                aria-label="Hồ sơ gia sư" 
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
                type="button"
                onClick={() => setShowProfile(!showProfile)}
              >
                <img 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20" 
                  src={TUTOR_PROFILE.avatarUrl}
                />
              </button>

              {/* Profile Popover */}
              {showProfile && (
                <div className="absolute right-0 top-12 w-72 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-3 pb-3 border-b border-surface-container">
                    <img 
                      alt="Tutor" 
                      className="w-12 h-12 rounded-full object-cover shadow-sm" 
                      src={TUTOR_PROFILE.heroAvatarUrl}
                    />
                    <div className="min-w-0">
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">{TUTOR_PROFILE.fullName}</p>
                      <p className="font-body-sm text-body-sm text-primary truncate">{TUTOR_PROFILE.title}</p>
                    </div>
                  </div>

                  <div className="py-2.5 flex flex-col gap-2">
                    <div className="bg-surface-container-low p-2.5 rounded-xl">
                      <span className="font-label-sm text-label-sm text-on-surface-variant block">Tài khoản VietQR thụ hưởng:</span>
                      <p className="font-label-md text-label-md text-on-surface font-bold mt-0.5">{TUTOR_PROFILE.bankName}</p>
                      <div className="flex items-center justify-between mt-1 text-primary">
                        <span className="font-mono font-bold text-[14px]">{TUTOR_PROFILE.accountNumber}</span>
                        <button 
                          className="text-xs hover:underline"
                          onClick={() => {
                            navigator.clipboard?.writeText(TUTOR_PROFILE.accountNumberRaw);
                            onShowToast('Đã sao chép số tài khoản MBBank!');
                          }}
                        >
                          Sao chép
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-surface-container flex flex-col gap-1.5">
                    <button 
                      className="w-full text-left py-2 px-2.5 rounded-lg text-primary font-label-md text-label-md hover:bg-surface-container flex items-center gap-2"
                      onClick={() => {
                        setShowProfile(false);
                        onOpenCreateClass();
                      }}
                    >
                      <span className="material-symbols-outlined text-[18px]">add_circle</span>
                      <span>Thêm lớp / học sinh mới</span>
                    </button>
                    <button 
                      className="w-full text-left py-2 px-2.5 rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container flex items-center gap-2"
                      onClick={() => {
                        setShowProfile(false);
                        onShowToast('Đã lưu dữ liệu tự động vào thiết bị.');
                      }}
                    >
                      <span className="material-symbols-outlined text-[18px]">sync</span>
                      <span>Đồng bộ dữ liệu giảng dạy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop for popovers */}
      {(showNotifications || showProfile) && (
        <div 
          className="fixed inset-0 z-30 bg-black/10" 
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </>
  );
};
