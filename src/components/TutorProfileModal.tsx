import React, { useState } from 'react';
import { TutorProfile } from '../types';

interface TutorProfileModalProps {
  isOpen: boolean;
  profile: TutorProfile;
  onClose: () => void;
  onSave: (updatedProfile: TutorProfile) => void;
  onShowToast: (msg: string) => void;
}

export const POPULAR_BANKS = [
  { code: 'MB', name: 'MB Bank (Quân Đội)', short: 'MBBank' },
  { code: 'VCB', name: 'Vietcombank (Ngoại Thương)', short: 'Vietcombank' },
  { code: 'TCB', name: 'Techcombank (Kỹ Thương)', short: 'Techcombank' },
  { code: 'ACB', name: 'ACB (Á Châu)', short: 'ACB' },
  { code: 'VPB', name: 'VPBank (Việt Nam Thịnh Vượng)', short: 'VPBank' },
  { code: 'TPB', name: 'TPBank (Tiên Phong)', short: 'TPBank' },
  { code: 'BIDV', name: 'BIDV (Đầu Tư & Phát Triển)', short: 'BIDV' },
  { code: 'ICB', name: 'VietinBank (Công Thương)', short: 'VietinBank' },
  { code: 'VBA', name: 'Agribank (Nông Nghiệp)', short: 'Agribank' },
  { code: 'STB', name: 'Sacombank (Sài Gòn Thương Tín)', short: 'Sacombank' },
  { code: 'HDB', name: 'HDBank (Phát Triển TP.HCM)', short: 'HDBank' },
  { code: 'VIB', name: 'VIB (Quốc Tế)', short: 'VIB' },
  { code: 'SHB', name: 'SHB (Sài Gòn - Hà Nội)', short: 'SHB' },
  { code: 'MSB', name: 'MSB (Hàng Hải)', short: 'MSB' },
  { code: 'OCB', name: 'OCB (Phương Đông)', short: 'OCB' },
];

export const TutorProfileModal: React.FC<TutorProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave,
  onShowToast,
}) => {
  const [displayName, setDisplayName] = useState(profile.name);
  const [fullName, setFullName] = useState(profile.fullName);
  const [title, setTitle] = useState(profile.title);
  const [bankCode, setBankCode] = useState(profile.bankCode || 'MB');
  const [accountNumber, setAccountNumber] = useState(profile.accountNumberRaw || '0988123456');
  const [accountHolder, setAccountHolder] = useState(profile.accountHolder || 'NGUYEN TUAN ANH');
  const [qrType, setQrType] = useState<'vietqr' | 'custom'>(profile.qrCodeUrl ? 'custom' : 'vietqr');
  const [customQrUrl, setCustomQrUrl] = useState(profile.qrCodeUrl || '');

  if (!isOpen) return null;

  const currentBank = POPULAR_BANKS.find((b) => b.code === bankCode) || POPULAR_BANKS[0];
  const cleanAccount = accountNumber.replace(/\s+/g, '');
  const autoVietQrUrl = `https://img.vietqr.io/image/${bankCode}-${cleanAccount}-compact2.png?accountName=${encodeURIComponent(
    accountHolder.toUpperCase().trim()
  )}`;

  const previewQrUrl = qrType === 'custom' && customQrUrl ? customQrUrl : autoVietQrUrl;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        onShowToast('Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setCustomQrUrl(base64);
        setQrType('custom');
        onShowToast('Đã tải ảnh mã QR cá nhân thành công!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!displayName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
      onShowToast('Vui lòng điền đủ Tên hiển thị, Số tài khoản và Tên chủ tài khoản!');
      return;
    }

    const formattedAccNum = cleanAccount.replace(/(\d{4})(\d{3})(\d{3,})/, '$1 $2 $3');

    const updated: TutorProfile = {
      ...profile,
      name: displayName.trim(),
      fullName: fullName.trim() || displayName.trim(),
      title: title.trim() || 'Gia sư chuyên nghiệp',
      bankCode: currentBank.code,
      bankName: currentBank.name,
      accountNumber: formattedAccNum,
      accountNumberRaw: cleanAccount,
      accountHolder: accountHolder.toUpperCase().trim(),
      qrCodeUrl: qrType === 'custom' && customQrUrl.trim() ? customQrUrl.trim() : undefined,
    };

    onSave(updated);
    onShowToast('Đã lưu thông tin gia sư & mã QR ngân hàng thành công!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/60 backdrop-blur-sm transition-all duration-300 p-0 sm:p-4">
      <div className="w-full max-w-lg bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom-6 border border-surface-container">
        {/* Modal Header */}
        <div className="w-full p-4 bg-surface-container-lowest border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">manage_accounts</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                Cài Đặt Hồ Sơ &amp; QR Bank
              </h2>
              <span className="font-label-sm text-label-sm text-primary font-semibold">
                Đổi tên hiển thị &amp; cập nhật mã VietQR nhận tiền
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

        {/* Form Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Section 1: Thông tin gia sư / Đổi tên */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">badge</span>
                Thông tin &amp; Đổi tên gia sư
              </h3>
              <span className="text-[11px] text-primary font-bold bg-primary-fixed px-2 py-0.5 rounded-full">
                Hiển thị trên app
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Tên hiển thị (Lời chào &amp; Dashboard) <span className="text-error">*</span>
              </label>
              <input
                type="text"
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-headline-sm text-headline-sm text-on-surface font-bold outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ví dụ: Thầy Tuấn Anh, Cô Mai Linh"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <span className="text-[11px] text-outline">
                Tên này xuất hiện ở lời chào "Chào buổi chiều, {displayName || '...'} 👋" và tiêu đề.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Họ và tên đầy đủ
                </label>
                <input
                  type="text"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ví dụ: Nguyễn Tuấn Anh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  Chức danh / Môn dạy
                </label>
                <input
                  type="text"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Gia sư Toán - Lý - Hóa"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tài khoản nhận học phí & VietQR */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">account_balance</span>
                Tài khoản nhận học phí VietQR
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                Napas 247 Chuẩn Quốc Gia
              </span>
            </div>

            {/* Chọn Ngân Hàng */}
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Ngân hàng thụ hưởng <span className="text-error">*</span>
              </label>
              <select
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-md text-on-surface font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
              >
                {POPULAR_BANKS.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name} ({b.short})
                  </option>
                ))}
              </select>
            </div>

            {/* Số tài khoản & Tên chủ thẻ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  Số tài khoản (STK) <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-mono font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20 text-base"
                  placeholder="0988123456"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  Tên chủ tài khoản (In hoa) <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-mono font-bold text-on-surface uppercase outline-none focus:ring-2 focus:ring-primary/20 text-base"
                  placeholder="NGUYEN TUAN ANH"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            {/* Chế độ mã QR: VietQR tự động hoặc ảnh riêng */}
            <div className="pt-2 border-t border-surface-container space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-bold block">
                Tùy chọn mã QR ngân hàng:
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`py-2 px-2.5 rounded-xl text-[12px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    qrType === 'vietqr'
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                  }`}
                  onClick={() => setQrType('vietqr')}
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                  <span>VietQR Tự Động</span>
                </button>

                <button
                  type="button"
                  className={`py-2 px-2.5 rounded-xl text-[12px] font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    qrType === 'custom'
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                  }`}
                  onClick={() => setQrType('custom')}
                >
                  <span className="material-symbols-outlined text-[16px]">image</span>
                  <span>Ảnh QR Riêng</span>
                </button>
              </div>

              {qrType === 'custom' && (
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container space-y-2 animate-in fade-in">
                  <div className="space-y-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                      Dán đường link ảnh QR ngân hàng của bạn:
                    </label>
                    <input
                      type="url"
                      className="w-full h-10 px-3 bg-surface-container-lowest rounded-lg border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                      placeholder="https://example.com/my-bank-qr.jpg"
                      value={customQrUrl}
                      onChange={(e) => setCustomQrUrl(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-on-surface-variant">Hoặc tải ảnh từ máy:</span>
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      <span>Chọn file ảnh</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* LIVE PREVIEW CỦA THẺ VIETQR */}
            <div className="bg-gradient-to-br from-primary-container via-primary to-primary-container p-4 rounded-2xl text-white mt-2 space-y-2 shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-center text-xs opacity-90 border-b border-white/20 pb-2">
                <span className="font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  Mã QR hiển thị trên phiếu thu học phí:
                </span>
                <span className="font-extrabold uppercase px-2 py-0.5 rounded bg-white/20">{currentBank.short}</span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                {/* QR preview box */}
                <div className="w-24 h-24 bg-white rounded-xl p-1 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={previewQrUrl}
                    alt="VietQR Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback if image blocked
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="flex flex-col min-w-0 text-left">
                  <span className="text-[11px] opacity-80 uppercase tracking-wider">Số tài khoản thụ hưởng</span>
                  <span className="font-mono text-base font-extrabold tracking-wider">{cleanAccount || '0000000000'}</span>

                  <span className="text-[11px] opacity-80 uppercase tracking-wider mt-1.5">Chủ tài khoản</span>
                  <span className="text-xs uppercase font-bold tracking-wide truncate">
                    {accountHolder || 'CHỦ TÀI KHOẢN'}
                  </span>

                  <span className="text-[11px] text-white/90 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    {currentBank.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-container-lowest border-t border-surface-container flex gap-2">
          <button
            type="button"
            className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors"
            onClick={onClose}
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all hover:bg-primary-container"
            onClick={handleSave}
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
