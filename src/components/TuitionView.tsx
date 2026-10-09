import React, { useState } from 'react';
import { INITIAL_INVOICES, INITIAL_RECEIPTS } from '../data/mockData';
import { Invoice, PaymentReceipt } from '../types';

interface TuitionViewProps {
  onOpenVietQR: (invoice: Invoice) => void;
  onOpenPoliteReminder: (invoice: Invoice) => void;
  onShowToast: (msg: string) => void;
}

export const TuitionView: React.FC<TuitionViewProps> = ({
  onOpenVietQR,
  onOpenPoliteReminder,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'settled' | 'all'>('pending');
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(INITIAL_RECEIPTS);

  const collectedAmount = 14200000;
  const pendingAmount = invoices.reduce((sum, inv) => sum + (inv.status !== 'settled' ? inv.totalAmount : 0), 0);
  const totalAmount = collectedAmount + pendingAmount;

  const handleMarkAsPaid = (inv: Invoice) => {
    setInvoices((prev) =>
      prev.map((item) => (item.id === inv.id ? { ...item, status: 'settled' } : item))
    );
    const newReceipt: PaymentReceipt = {
      id: `rec-${Date.now()}`,
      studentName: inv.studentName,
      subject: inv.subject.split('•')[0].trim(),
      method: 'VietQR MBBank',
      timeText: 'Vừa xong',
      amount: inv.totalAmount,
    };
    setReceipts((prev) => [newReceipt, ...prev]);
    onShowToast(`Đã ghi nhận thanh toán ${inv.totalAmount.toLocaleString('vi-VN')} đ cho ${inv.studentName}!`);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab === 'pending') return inv.status === 'pending' || inv.status === 'overdue';
    if (activeTab === 'settled') return inv.status === 'settled';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 pt-20 gap-4">
      {/* Header Notification & Warm Greeting */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
            Kỳ thu phí Tháng 10/2024
          </span>
          <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
            Sổ thu học phí
          </h1>
        </div>
        <div className="flex items-center gap-1.5 bg-secondary-container px-3 py-1.5 rounded-full shadow-sm">
          <span className="material-symbols-outlined text-[18px] text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
          <span className="font-label-md text-label-md text-on-secondary-container font-bold">VietQR Pro</span>
        </div>
      </div>

      {/* Financial Overview Card */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface-variant">Tổng dự kiến thu</span>
            <span className="font-display-hero text-display-hero text-primary font-extrabold tracking-tight">
              {totalAmount.toLocaleString('vi-VN')} <span className="font-headline-sm text-headline-sm">đ</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
          </div>
        </div>

        {/* Progress Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-label-sm text-label-sm">
            <span className="text-secondary font-bold">Đã thu: 14.200.000 đ (66%)</span>
            <span className="text-tertiary font-bold">Chờ: {pendingAmount.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden flex">
            <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '66%' }}></div>
            <div className="bg-tertiary-fixed-dim h-full rounded-full transition-all duration-500" style={{ width: '34%' }}></div>
          </div>
        </div>

        {/* Quick Stat Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-sm text-label-sm text-on-surface-variant truncate">Đã thanh toán</p>
              <p className="font-headline-sm text-headline-sm text-secondary font-bold truncate">8 em</p>
            </div>
          </div>

          <div className="bg-surface-container-low p-3 rounded-xl flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
            </div>
            <div className="min-w-0">
              <p className="font-label-sm text-label-sm text-on-surface-variant truncate">Cần nhắc phí</p>
              <p className="font-headline-sm text-headline-sm text-tertiary font-bold truncate">4 em</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Segmented Filter Control */}
      <div className="flex p-1 bg-surface-container rounded-xl font-label-md text-label-md">
        <button
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'pending'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
          onClick={() => setActiveTab('pending')}
        >
          Chờ thu (4)
        </button>
        <button
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'settled'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
          onClick={() => setActiveTab('settled')}
        >
          Đã xong (8)
        </button>
        <button
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'all'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          type="button"
          onClick={() => setActiveTab('all')}
        >
          Tất cả (12)
        </button>
      </div>

      {/* Empathy Micro-Helper */}
      <div className="bg-surface-container-high/60 p-3 rounded-2xl flex items-start gap-2.5 shadow-sm border border-surface-container">
        <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">sentiment_satisfied</span>
        <div className="space-y-0.5">
          <p className="font-label-md text-label-md text-primary font-bold">Thu học phí tế nhị &amp; chu đáo</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Báo cáo buổi học rõ ràng kèm mã VietQR tự động điền tiền và nội dung giúp phụ huynh chuyển khoản tiện lợi ngay lập tức.
          </p>
        </div>
      </div>

      {/* Invoice List Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Cần thu trong đợt này</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Sắp xếp theo hạn đóng</span>
        </div>

        {filteredInvoices.map((inv) => {
          if (inv.status === 'settled') {
            return (
              <div
                key={inv.id}
                className="bg-secondary-container/20 p-4 rounded-2xl shadow-sm border border-secondary-container flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                  </div>
                  <div>
                    <h3 className="font-label-lg text-label-lg font-bold text-on-surface">{inv.studentName}</h3>
                    <p className="font-body-sm text-body-sm text-secondary font-medium">Đã thanh toán hoàn tất</p>
                  </div>
                </div>
                <span className="font-headline-sm text-headline-sm font-extrabold text-secondary">
                  {inv.totalAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
            );
          }

          return (
            <div
              key={inv.id}
              className={`bg-surface-container-lowest p-4 rounded-2xl shadow-sm border flex flex-col gap-3 ${
                inv.status === 'overdue' ? 'border-error/30' : 'border-surface-container-high/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-headline-sm shrink-0 shadow-inner ${
                      inv.status === 'overdue'
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-primary-fixed text-primary'
                    }`}
                  >
                    {inv.initials}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                      {inv.studentName}
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {inv.subject}
                    </p>
                  </div>
                </div>
                {inv.status === 'overdue' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold shrink-0">
                    <span className="material-symbols-outlined text-[14px]">warning</span> Quá hạn {inv.overdueDays} ngày
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold shrink-0">
                    Hạn {inv.dueDate}
                  </span>
                )}
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Kỳ học tháng 10</span>
                  <span className="font-body-md text-body-md text-on-surface font-semibold">
                    {inv.sessionCount} buổi × {inv.ratePerSession.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Tổng số tiền</span>
                  <span
                    className={`font-amount-display text-amount-display font-bold ${
                      inv.status === 'overdue' ? 'text-error' : 'text-primary'
                    }`}
                  >
                    {inv.totalAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                {inv.id === 'inv-1' ? (
                  <>
                    <button
                      className="w-full h-12 bg-primary text-on-primary rounded-xl font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                      type="button"
                      onClick={() => onOpenVietQR(inv)}
                    >
                      <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                      <span>Tạo mã VietQR &amp; Gửi Zalo</span>
                    </button>
                    <button
                      className="w-full h-10 bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      type="button"
                      onClick={() => onOpenPoliteReminder(inv)}
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      <span>Mẫu tin nhắn nhắc lịch sự</span>
                    </button>
                  </>
                ) : inv.id === 'inv-2' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="h-11 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      type="button"
                      onClick={() => onOpenPoliteReminder(inv)}
                    >
                      <span className="material-symbols-outlined text-[18px] text-tertiary">sentiment_satisfied</span>
                      <span>Nhắc nợ lịch sự</span>
                    </button>
                    <button
                      className="h-11 bg-primary-container text-on-primary rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      type="button"
                      onClick={() => onOpenVietQR(inv)}
                    >
                      <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                      <span>Mở VietQR</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="flex-1 h-11 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                      type="button"
                      onClick={() => onOpenVietQR(inv)}
                    >
                      <span className="material-symbols-outlined text-[18px]">send_to_mobile</span>
                      <span>Báo học phí Zalo</span>
                    </button>
                    <button
                      className="h-11 px-4 bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                      type="button"
                      onClick={() => handleMarkAsPaid(inv)}
                    >
                      <span className="material-symbols-outlined text-[18px]">check</span>
                      <span>Đã nhận</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Payment Receipts */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-secondary">verified</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Đã thu gần đây</h2>
          </div>
          <span className="font-label-md text-label-md text-primary font-bold">
            Xem tất cả ({receipts.length})
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {receipts.map((rec) => (
            <div
              key={rec.id}
              className="bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-surface-container-high/50 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    done_all
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-label-lg text-label-lg text-on-surface truncate font-bold">{rec.studentName}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {rec.subject} • {rec.method} • {rec.timeText}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-label-lg text-label-lg text-secondary font-bold block">
                  +{rec.amount.toLocaleString('vi-VN')} đ
                </span>
                <span className="font-label-sm text-label-sm text-on-secondary-container bg-secondary-container px-2 py-0.5 rounded-full inline-block font-semibold">
                  Thành công
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
