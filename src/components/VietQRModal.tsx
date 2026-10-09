import React, { useState } from 'react';
import { TUTOR_PROFILE } from '../data/mockData';
import { Invoice, TutorProfile } from '../types';

interface VietQRModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onMarkPaid?: (invoice: Invoice) => void;
  tutorProfile?: TutorProfile;
}

export const VietQRModal: React.FC<VietQRModalProps> = ({
  invoice,
  onClose,
  onShowToast,
  onMarkPaid,
  tutorProfile,
}) => {
  if (!invoice) return null;

  const tutor = tutorProfile || TUTOR_PROFILE;
  const [balanceScenario, setBalanceScenario] = useState<'surplus' | 'deficit' | 'exact'>('surplus');
  const [isEditingZalo, setIsEditingZalo] = useState(false);

  const baseTuition = invoice.totalAmount;
  let adjustment = 0;
  if (balanceScenario === 'surplus') adjustment = -300000;
  if (balanceScenario === 'deficit') adjustment = 300000;

  const finalDueAmount = baseTuition + adjustment;

  const defaultZaloText = balanceScenario === 'surplus'
    ? `"Dạ em chào ${invoice.parentName} ạ! Em xin phép gửi gia đình bảng kê số buổi học tháng 10 của em ${invoice.studentName} (gồm ${invoice.sessionCount} buổi, học phí ${baseTuition.toLocaleString('vi-VN')}đ). Do tháng trước phụ huynh có chuyển dư 300.000đ, em đã khấu trừ trực tiếp vào kỳ này nên tổng học phí cần thanh toán là ${finalDueAmount.toLocaleString('vi-VN')}đ ạ. Kèm mã VietQR để quét thanh toán nhanh tiện lợi. Tháng vừa rồi em học rất tiến bộ và chăm chỉ! Em cảm ơn gia đình nhiều ạ!"`
    : balanceScenario === 'deficit'
    ? `"Dạ em chào ${invoice.parentName} ạ! Em xin phép gửi gia đình bảng kê số buổi học tháng 10 của em ${invoice.studentName} (gồm ${invoice.sessionCount} buổi, học phí ${baseTuition.toLocaleString('vi-VN')}đ). Kèm số dư kỳ trước chưa quyết toán (+300.000đ), tổng học phí kỳ này là ${finalDueAmount.toLocaleString('vi-VN')}đ ạ. Em xin gửi kèm mã VietQR tiện lợi. Em cảm ơn gia đình nhiều ạ!"`
    : `"Dạ em chào ${invoice.parentName} ạ! Em xin phép gửi gia đình bảng kê số buổi học tháng 10 của em ${invoice.studentName} (gồm ${invoice.sessionCount} buổi, tổng ${finalDueAmount.toLocaleString('vi-VN')}đ) kèm mã VietQR chuyển khoản nhanh 24/7. Tháng qua em học rất chăm chỉ và có nhiều tiến bộ rõ nét ạ. Em cảm ơn gia đình nhiều ạ!"`;

  const [zaloMessage, setZaloMessage] = useState(defaultZaloText);

  // When scenario changes, update default text if not actively custom edited
  const handleScenarioChange = (scenario: 'surplus' | 'deficit' | 'exact') => {
    setBalanceScenario(scenario);
    let adj = 0;
    if (scenario === 'surplus') adj = -300000;
    if (scenario === 'deficit') adj = 300000;
    const finalAmt = baseTuition + adj;

    if (scenario === 'surplus') {
      setZaloMessage(
        `"Dạ em chào ${invoice.parentName} ạ! Em xin phép gửi gia đình bảng kê số buổi học tháng 10 của em ${invoice.studentName} (gồm ${invoice.sessionCount} buổi, học phí ${baseTuition.toLocaleString('vi-VN')}đ). Do tháng trước phụ huynh có chuyển dư 300.000đ, em đã khấu trừ trực tiếp vào kỳ này nên tổng học phí cần thanh toán là ${finalAmt.toLocaleString('vi-VN')}đ ạ. Kèm mã VietQR để quét thanh toán nhanh tiện lợi. Tháng vừa rồi em học rất tiến bộ và chăm chỉ! Em cảm ơn gia đình nhiều ạ!"`
      );
    } else if (scenario === 'deficit') {
      setZaloMessage(
        `"Dạ em chào ${invoice.parentName} ạ! Em xin phép gửi gia đình bảng kê số buổi học tháng 10 của em ${invoice.studentName} (gồm ${invoice.sessionCount} buổi, học phí ${baseTuition.toLocaleString('vi-VN')}đ). Kèm số dư kỳ trước chưa quyết toán (+300.000đ), tổng học phí kỳ này là ${finalAmt.toLocaleString('vi-VN')}đ ạ. Em xin gửi kèm mã VietQR tiện lợi. Em cảm ơn gia đình nhiều ạ!"`
      );
    } else {
      setZaloMessage(
        `"Dạ em chào ${invoice.parentName} ạ! Em xin phép gửi gia đình bảng kê số buổi học tháng 10 của em ${invoice.studentName} (gồm ${invoice.sessionCount} buổi, tổng ${finalAmt.toLocaleString('vi-VN')}đ) kèm mã VietQR chuyển khoản nhanh 24/7. Tháng qua em học rất chăm chỉ và có nhiều tiến bộ rõ nét ạ. Em cảm ơn gia đình nhiều ạ!"`
      );
    }
  };

  const cleanAccount = tutor.accountNumberRaw || tutor.accountNumber.replace(/\s+/g, '');
  const vietQrApiUrl = `https://img.vietqr.io/image/${tutor.bankCode || 'MB'}-${cleanAccount}-compact2.png?amount=${finalDueAmount}&addInfo=${encodeURIComponent(
    invoice.bankMemo
  )}&accountName=${encodeURIComponent(tutor.accountHolder)}`;
  const displayQrUrl = tutor.qrCodeUrl || vietQrApiUrl;

  const copyAccountNumber = () => {
    navigator.clipboard?.writeText(cleanAccount);
    onShowToast(`Đã sao chép số tài khoản: ${cleanAccount}`);
  };

  const copyMemo = () => {
    navigator.clipboard?.writeText(invoice.bankMemo);
    onShowToast(`Đã sao chép nội dung chuyển khoản: ${invoice.bankMemo}`);
  };

  const copyFullInfo = () => {
    const fullText = `Ngân hàng: ${TUTOR_PROFILE.bankName} - Số TK: ${TUTOR_PROFILE.accountNumberRaw} - Chủ TK: ${TUTOR_PROFILE.accountHolder} - Số tiền: ${finalDueAmount.toLocaleString('vi-VN')}đ - Nội dung: ${invoice.bankMemo}`;
    navigator.clipboard?.writeText(fullText);
    onShowToast('Đã sao chép toàn bộ thông tin thanh toán VietQR!');
  };

  const sendZalo = () => {
    navigator.clipboard?.writeText(zaloMessage);
    onShowToast(`Đang kết nối Zalo để gửi bảng kê cho ${invoice.parentName}...`);
  };

  const downloadQR = () => {
    onShowToast('Đã lưu ảnh mã VietQR Pro vào thư viện máy!');
  };

  const downloadPNGInvoice = () => {
    onShowToast(`Đã xuất ảnh hóa đơn PNG bảng kê cho ${invoice.studentName}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-lg bg-surface rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom-8">
        {/* Top Drag Handle & Dismiss Header */}
        <div className="w-full pt-3 pb-2 flex flex-col items-center justify-center bg-surface-container-lowest border-b border-surface-container-high/60">
          <div className="w-12 h-1 bg-outline-variant/60 rounded-full mb-2"></div>
          <div className="w-full px-4 flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                  Phiếu Báo Học Phí &amp; VietQR
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold">
                    Kỳ học Tháng 10/2024
                  </span>
                </div>
              </div>
            </div>
            <button
              aria-label="Đóng cửa sổ"
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors shrink-0"
              type="button"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex flex-col px-4 py-4 gap-4 overflow-y-auto pb-36">
          {/* Section 1: Thông tin học sinh & Phụ huynh Card */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-primary-container font-headline-sm text-headline-sm font-bold shadow-inner">
                  {invoice.initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                    {invoice.studentName}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {invoice.subject}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                {invoice.sessionCount}/{invoice.sessionCount} Buổi
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex flex-col bg-surface-container-low p-2.5 rounded-xl">
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  Phụ huynh đại diện
                </span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold mt-0.5 truncate">
                  {invoice.parentName} • {invoice.parentPhone}
                </span>
              </div>
              <div className="flex flex-col bg-surface-container-low p-2.5 rounded-xl">
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  Lịch cố định
                </span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold mt-0.5 truncate">
                  Thứ 3, 6 (18:30 – 20:00)
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Chi tiết 8 buổi học */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[20px]">fact_check</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Chi tiết {invoice.sessions.length} buổi học
                </h2>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                {invoice.ratePerSession.toLocaleString('vi-VN')} đ/buổi
              </span>
            </div>

            {/* Session List */}
            <div className="flex flex-col gap-1.5">
              {invoice.sessions.map((ses) => (
                <div
                  key={ses.number}
                  className="flex items-center justify-between py-2 px-2.5 rounded-xl bg-surface-container-low"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center font-label-sm text-label-sm text-primary font-bold shrink-0">
                      {ses.number}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
                        {ses.date}: {ses.topic}
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary flex items-center gap-0.5">
                        {ses.isMakeup ? 'Đã bù đủ' : `Đã học (${ses.duration})`}
                        {ses.scoreNote && ` • ${ses.scoreNote}`}
                      </span>
                    </div>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface font-bold shrink-0 ml-2">
                    {ses.price.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ))}
            </div>

            {/* Đối soát số dư kỳ trước & calculation breakdown */}
            <div className="flex flex-col gap-2 pt-1 bg-surface-container-low p-3 rounded-xl border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[15px] text-primary">account_balance_wallet</span>
                  Đối soát số dư kỳ trước:
                </span>
                <div className="inline-flex p-0.5 bg-surface-container rounded-lg">
                  <button
                    className={`px-2 py-0.5 rounded text-label-sm font-label-sm transition-all ${
                      balanceScenario === 'surplus'
                        ? 'bg-surface-container-lowest text-secondary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                    onClick={() => handleScenarioChange('surplus')}
                  >
                    Chuyển dư (-300k)
                  </button>
                  <button
                    className={`px-2 py-0.5 rounded text-label-sm font-label-sm transition-all ${
                      balanceScenario === 'deficit'
                        ? 'bg-surface-container-lowest text-error shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                    onClick={() => handleScenarioChange('deficit')}
                  >
                    Chuyển thiếu (+300k)
                  </button>
                  <button
                    className={`px-2 py-0.5 rounded text-label-sm font-label-sm transition-all ${
                      balanceScenario === 'exact'
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    type="button"
                    onClick={() => handleScenarioChange('exact')}
                  >
                    Đủ (0đ)
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-1 border-t border-outline-variant/20">
                <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
                  <span>Học phí phát sinh Tháng 10 ({invoice.sessionCount} buổi):</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    {baseTuition.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
                  <span>Tài liệu &amp; đề thi bổ trợ:</span>
                  <span className="font-label-md text-label-md text-secondary font-bold">Miễn phí (0 đ)</span>
                </div>
                {balanceScenario !== 'exact' && (
                  <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[11px] font-bold ${
                          balanceScenario === 'surplus'
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-error-container text-on-error-container'
                        }`}
                      >
                        {balanceScenario === 'surplus' ? 'PH chuyển dư tháng 9' : 'Chưa quyết toán tháng 9'}
                      </span>
                      <span>Khấu trừ số dư cũ:</span>
                    </span>
                    <span
                      className={`font-label-md text-label-md font-bold ${
                        balanceScenario === 'surplus' ? 'text-secondary' : 'text-error'
                      }`}
                    >
                      {adjustment > 0 ? `+${adjustment.toLocaleString('vi-VN')} đ` : `${adjustment.toLocaleString('vi-VN')} đ`}
                    </span>
                  </div>
                )}
                <div className="w-full h-[1px] bg-outline-variant/30 my-1"></div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Tổng học phí cần thu:</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {baseTuition.toLocaleString('vi-VN')}đ {adjustment < 0 ? `- 300.000đ (dư T9)` : adjustment > 0 ? `+ 300.000đ (thiếu T9)` : ''}
                    </span>
                  </div>
                  <span className="font-amount-display text-amount-display text-primary font-extrabold">
                    {finalDueAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Thẻ mã VietQR Chuẩn Ngân Hàng (Card VIP) */}
          <div className="w-full bg-gradient-to-br from-primary-container via-primary to-primary-container text-on-primary rounded-2xl p-4 shadow-xl relative overflow-hidden flex flex-col items-center">
            {/* Decorative Ambient Rings */}
            <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-white/5 pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-white/5 pointer-events-none"></div>

            {/* Card Header with Bank Logos */}
            <div className="w-full flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-surface-container-lowest px-2.5 py-1 rounded-md shadow-sm flex items-center">
                  <span className="font-headline-sm text-headline-sm font-extrabold tracking-wider text-primary">
                    Viet<span className="text-error">QR</span>
                  </span>
                </div>
                <div className="bg-surface-container-lowest/20 backdrop-blur-sm px-2 py-1 rounded-md text-surface-bright font-label-md text-label-md font-bold">
                  {tutor.bankCode || 'MBBank'}
                </div>
              </div>
              <div className="flex items-center gap-1 text-on-primary-container font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Chuyển khoản 24/7</span>
              </div>
            </div>

            {/* Sharp Centered QR Code Box */}
            <div className="relative bg-surface-container-lowest p-3 rounded-2xl shadow-lg flex flex-col items-center justify-center my-1 w-52 min-h-52 overflow-hidden">
              <img
                src={displayQrUrl}
                alt="VietQR Mã Thanh Toán"
                className="w-44 h-44 object-contain rounded-lg"
                onError={(e) => {
                  // If image fails, fallback to vector QR
                  (e.target as HTMLElement).style.display = 'none';
                  const fb = document.getElementById('vector-qr-fallback');
                  if (fb) fb.style.display = 'block';
                }}
              />
              <div id="vector-qr-fallback" style={{ display: 'none' }}>
                <svg className="w-44 h-44 text-on-surface" fill="currentColor" viewBox="0 0 160 160">
                  <rect fill="#131b2e" height="40" rx="6" width="40" x="10" y="10"></rect>
                  <rect fill="#ffffff" height="28" rx="3" width="28" x="16" y="16"></rect>
                  <rect fill="#2a14b4" height="16" rx="2" width="16" x="22" y="22"></rect>
                  <rect fill="#131b2e" height="40" rx="6" width="40" x="110" y="10"></rect>
                  <rect fill="#ffffff" height="28" rx="3" width="28" x="116" y="16"></rect>
                  <rect fill="#2a14b4" height="16" rx="2" width="16" x="122" y="22"></rect>
                  <rect fill="#131b2e" height="40" rx="6" width="40" x="10" y="110"></rect>
                  <rect fill="#ffffff" height="28" rx="3" width="28" x="16" y="116"></rect>
                  <rect fill="#2a14b4" height="16" rx="2" width="16" x="22" y="122"></rect>
                  <rect height="8" rx="1.5" width="8" x="60" y="14"></rect>
                  <rect height="8" rx="1.5" width="8" x="74" y="14"></rect>
                  <rect height="8" rx="1.5" width="8" x="88" y="14"></rect>
                  <rect height="6" rx="1" width="14" x="60" y="28"></rect>
                  <rect height="6" rx="1" width="18" x="80" y="28"></rect>
                  <rect height="8" rx="1.5" width="8" x="60" y="40"></rect>
                  <rect height="8" rx="1.5" width="22" x="74" y="40"></rect>
                  <rect height="14" rx="1" width="8" x="14" y="60"></rect>
                  <rect height="8" rx="1" width="14" x="28" y="60"></rect>
                  <rect height="8" rx="1" width="8" x="48" y="60"></rect>
                  <rect height="8" rx="1" width="14" x="114" y="60"></rect>
                  <rect height="8" rx="1" width="14" x="134" y="60"></rect>
                  <rect fill="#2a14b4" height="28" rx="6" width="28" x="66" y="66"></rect>
                  <circle cx="80" cy="80" fill="#ffffff" r="10"></circle>
                  <path d="M76 83L80 75L84 83H81.5L80 79.5L78.5 83H76Z" fill="#2a14b4"></path>
                </svg>
              </div>
              <div className="text-on-surface-variant font-label-sm text-label-sm mt-2 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                Tự động điền tiền &amp; lời nhắn
              </div>
            </div>

            {/* Bank details within VIP Card */}
            <div className="w-full bg-surface-container-lowest/15 backdrop-blur-md rounded-xl p-3 mt-3 flex flex-col gap-2 text-surface-bright">
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-on-primary-container">Chủ tài khoản:</span>
                <span className="font-label-lg text-label-lg tracking-wide uppercase font-bold">
                  {tutor.accountHolder}
                </span>
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-on-primary-container">Số tài khoản:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-sm text-headline-sm font-mono tracking-wider font-bold">
                    {tutor.accountNumber}
                  </span>
                  <button
                    className="p-1 rounded bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 transition-colors"
                    type="button"
                    onClick={copyAccountNumber}
                    title="Sao chép số TK"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-on-primary-container">Ngân hàng:</span>
                <span className="font-label-md text-label-md font-semibold">{tutor.bankName}</span>
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-on-primary-container">Số tiền:</span>
                <span className="font-headline-sm text-headline-sm text-secondary-container font-extrabold">
                  {finalDueAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm">
                <span className="text-on-primary-container">Nội dung CK:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-label-md text-label-md font-mono bg-surface-container-lowest/20 px-2 py-0.5 rounded text-white font-bold">
                    {invoice.bankMemo}
                  </span>
                  <button
                    className="p-1 rounded bg-surface-container-lowest/20 hover:bg-surface-container-lowest/30 transition-colors"
                    type="button"
                    onClick={copyMemo}
                    title="Sao chép nội dung"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Utility Buttons Row */}
            <div className="w-full grid grid-cols-2 gap-2 mt-3">
              <button
                className="w-full py-2.5 px-2 bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 rounded-xl flex items-center justify-center gap-1.5 text-on-primary font-label-md text-label-md font-bold transition-colors active:scale-95"
                type="button"
                onClick={downloadQR}
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Lưu ảnh QR
              </button>
              <button
                className="w-full py-2.5 px-2 bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 rounded-xl flex items-center justify-center gap-1.5 text-on-primary font-label-md text-label-md font-bold transition-colors active:scale-95"
                type="button"
                onClick={copyFullInfo}
              >
                <span className="material-symbols-outlined text-[18px]">copy_all</span>
                Sao chép thông tin
              </button>
            </div>
          </div>

          {/* Section 4: Zalo Message Preview & Customization */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0068FF] text-white flex items-center justify-center font-bold text-[10px] tracking-tighter">
                  Zalo
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Lời nhắn gửi phụ huynh</h3>
              </div>
              <button
                className="text-primary hover:text-primary-container font-label-md text-label-md flex items-center gap-0.5 font-bold"
                type="button"
                onClick={() => setIsEditingZalo(!isEditingZalo)}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isEditingZalo ? 'check' : 'edit'}
                </span>
                {isEditingZalo ? 'Lưu lời nhắn' : 'Tùy chỉnh'}
              </button>
            </div>

            <div className="relative bg-surface-container-low rounded-xl p-3">
              {isEditingZalo ? (
                <textarea
                  className="w-full bg-surface-container-lowest p-2 rounded-lg text-body-md font-body-md text-on-surface outline-none border border-primary resize-none"
                  rows={4}
                  value={zaloMessage}
                  onChange={(e) => setZaloMessage(e.target.value)}
                />
              ) : (
                <p className="font-body-md text-body-md text-on-surface leading-relaxed select-text">
                  {zaloMessage}
                </p>
              )}
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-surface-container text-on-surface-variant font-label-sm text-label-sm">
                <span className="flex items-center gap-1 text-secondary font-bold">
                  <span className="material-symbols-outlined text-[15px]">sentiment_satisfied</span>
                  Giọng văn lịch sự, tích cực
                </span>
                <span>{zaloMessage.length} ký tự</span>
              </div>
            </div>
          </div>

          {/* Trust Transparency Banner */}
          <div className="w-full flex items-center gap-2.5 bg-surface-container-low px-3 py-2.5 rounded-xl text-on-surface-variant border border-surface-container">
            <span className="material-symbols-outlined text-[20px] text-primary shrink-0">security</span>
            <p className="font-body-sm text-body-sm leading-tight">
              Học phí chuyển khoản trực tiếp vào tài khoản gia sư. Gia Sư Pro không thu bất kỳ phí trung gian nào.
            </p>
          </div>
        </div>

        {/* Sticky Bottom CTA Action Bar */}
        <div className="fixed bottom-0 inset-x-0 max-w-lg mx-auto bg-surface-container-lowest/95 backdrop-blur-xl p-4 shadow-[0_-8px_20px_rgba(0,0,0,0.08)] z-50 flex flex-col gap-2 border-t border-surface-container">
          <div className="flex items-center gap-2">
            {/* Main Primary Zalo Sharing Button */}
            <button
              className="flex-1 h-12 rounded-xl bg-[#0068FF] hover:bg-[#0055d4] active:scale-[0.98] text-white flex items-center justify-center gap-2 font-label-lg text-label-lg font-bold shadow-lg shadow-[#0068FF]/20 transition-all"
              type="button"
              onClick={sendZalo}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.141 2 11.25c0 2.923 1.48 5.534 3.792 7.195-.164.97-.665 2.656-1.528 3.766-.11.141-.018.344.156.344 1.83 0 3.722-.977 4.79-1.745.89.24 1.83.37 2.79.37 5.523 0 10-4.141 10-9.25S17.523 2 12 2zm-3.2 12.3c-.663 0-1.2-.537-1.2-1.2s.537-1.2 1.2-1.2 1.2.537 1.2 1.2-.537 1.2-1.2 1.2zm3.2 0c-.663 0-1.2-.537-1.2-1.2s.537-1.2 1.2-1.2 1.2.537 1.2 1.2-.537 1.2-1.2 1.2zm3.2 0c-.663 0-1.2-.537-1.2-1.2s.537-1.2 1.2-1.2 1.2.537 1.2 1.2-.537 1.2-1.2 1.2z"></path>
              </svg>
              <span>Gửi trực tiếp qua Zalo</span>
            </button>

            {/* Copy Payment Link Button */}
            <button
              aria-label="Sao chép link"
              className="w-12 h-12 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors shrink-0 active:scale-95"
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(`https://gia-su.pro/pay/${invoice.studentName.toLowerCase().replace(/\s+/g, '')}`);
                onShowToast('Đã sao chép liên kết thanh toán trực tuyến!');
              }}
              title="Sao chép link phiếu học phí"
            >
              <span className="material-symbols-outlined text-[22px]">share</span>
            </button>
          </div>

          {/* Quick Sub Action Row */}
          <div className="flex items-center justify-center gap-4 text-on-surface-variant font-label-sm text-label-sm">
            <button
              className="hover:text-primary transition-colors flex items-center gap-1 font-semibold"
              type="button"
              onClick={downloadPNGInvoice}
            >
              <span className="material-symbols-outlined text-[16px]">image</span>
              Xuất ảnh hóa đơn PNG
            </button>
            <span className="text-outline-variant">•</span>
            <button
              className="hover:text-secondary transition-colors flex items-center gap-1 font-bold text-secondary"
              type="button"
              onClick={() => {
                if (onMarkPaid) onMarkPaid(invoice);
                onClose();
              }}
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Đánh dấu đã thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
