import React, { useState } from 'react';

interface RescheduleViewProps {
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const RescheduleView: React.FC<RescheduleViewProps> = ({
  onBack,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'action' | 'history'>('action');
  const [reason, setReason] = useState<string>('student_excused');
  const [policy, setPolicy] = useState<string>('reschedule_free');
  const [rescheduleDate, setRescheduleDate] = useState('28/10/2024');
  const [rescheduleTime, setRescheduleTime] = useState('09:00 - 10:30');
  const [isSlotApplied, setIsSlotApplied] = useState(false);

  const getReasonText = () => {
    switch (reason) {
      case 'tutor_emergency': return 'thầy/cô bận việc gia đình đột xuất';
      case 'school_exam': return 'trùng lịch thi cử ngoại khóa tại trường';
      case 'student_unexcused': return 'học sinh vắng không báo trước';
      default: return 'gia đình học sinh có việc bận đột xuất';
    }
  };

  const getPolicyText = () => {
    if (policy === 'charge_anyway') {
      return 'Do báo hủy sát giờ (< 2h), ca học này vẫn được tính theo quy ước giảng dạy.';
    }
    if (policy === 'deduct_month') {
      return 'Buổi học này sẽ được trừ trực tiếp (-300.000đ) khỏi kỳ thu học phí tháng 10.';
    }
    return `Ca này thầy/cô đã xếp dạy bù vào ${rescheduleDate} lúc ${rescheduleTime}. Học phí không phát sinh thêm.`;
  };

  const previewMessage = `"Dạ em chào anh/chị, ca Hóa học 11 hôm nay (Thứ Tư 24/10 lúc 18:30) xin phép được tạm hoãn vì lý do ${getReasonText()}. ${getPolicyText()} Nhờ gia đình xem qua và phản hồi xác nhận giúp em nhé!"`;

  const copyMessage = () => {
    navigator.clipboard?.writeText(previewMessage);
    onShowToast('Đã sao chép tin nhắn thông báo vào bộ nhớ đệm!');
  };

  const applyAISuggestion = () => {
    setRescheduleDate('28/10/2024');
    setRescheduleTime('09:00 - 10:30');
    setIsSlotApplied(true);
    onShowToast('Đã áp dụng lịch bù AI gợi ý: CN 28/10 lúc 09:00 - 10:30');
    setTimeout(() => setIsSlotApplied(false), 2000);
  };

  const handleConfirm = () => {
    onShowToast('Đã báo nghỉ & tự động đồng bộ lịch bù thành công!');
    setTimeout(() => {
      setActiveTab('history');
    }, 600);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-surface-container-lowest/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container">
        <div className="h-16 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              aria-label="Quay lại"
              className="w-11 h-11 -ml-2 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container transition-colors"
              type="button"
              onClick={onBack}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="flex flex-col min-w-0">
              <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight truncate font-bold">
                Báo Nghỉ &amp; Đổi Lịch Ca Dạy
              </h1>
              <span className="font-label-sm text-label-sm text-primary truncate">Gia Sư Pro</span>
            </div>
          </div>
          <button
            aria-label="Trợ giúp"
            className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
            type="button"
            onClick={() => onShowToast('Chính sách: Báo nghỉ trước 6 tiếng để được bảo lưu ca học')}
          >
            <span className="material-symbols-outlined text-[22px]">help_outline</span>
          </button>
        </div>
      </header>

      {/* Main Tab Controls */}
      <main className="flex-1 flex flex-col px-4 pt-3 pb-32 gap-4">
        {/* Top Segmented Tabs */}
        <div className="bg-surface-container-high p-1 rounded-2xl flex items-center shadow-sm">
          <button
            className={`flex-1 py-2.5 px-2 rounded-xl font-label-md text-label-md text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'action'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
            onClick={() => setActiveTab('action')}
          >
            <span className="material-symbols-outlined text-[18px]">event_busy</span>
            <span>Báo nghỉ / Hủy ca</span>
          </button>
          <button
            className={`flex-1 py-2.5 px-2 rounded-xl font-label-md text-label-md text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
            onClick={() => setActiveTab('history')}
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Lịch sử đối soát</span>
            <span className="w-2 h-2 rounded-full bg-tertiary-container inline-block"></span>
          </button>
        </div>

        {/* TAB CONTENT 1: FORM BÁO NGHỈ */}
        {activeTab === 'action' && (
          <div className="flex flex-col gap-4 animate-in fade-in">
            {/* Session Info Card */}
            <div className="relative overflow-hidden bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-error-container text-on-error-container flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                    Hôm nay
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant font-semibold">
                    Nhóm 3 học sinh
                  </span>
                </div>
                <button
                  className="text-primary hover:text-primary-container p-1 rounded-lg hover:bg-surface-container-low transition-colors"
                  title="Đổi ca học"
                  type="button"
                  onClick={() => onShowToast('Đang chọn ca: Hóa học 11 hôm nay')}
                >
                  <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                </button>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-variant flex items-center justify-center text-primary shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-[26px]">science</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                    Hóa học 11 – Ôn thi Giữa kỳ
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    18:30 – 20:00 • Thứ Tư, 24/10/2024
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between border border-surface-container">
                <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                  <span>Đơn giá ca dạy:</span>
                </div>
                <span className="font-label-lg text-label-lg text-on-surface font-bold">300.000 đ</span>
              </div>
            </div>

            {/* Phân loại lý do nghỉ */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">help_center</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Lý do báo hoãn / hủy ca
                  </h3>
                </div>
                <span className="font-label-sm text-label-sm text-error font-bold">* Bắt buộc</span>
              </div>

              <div className="flex flex-col gap-2">
                {/* Option 1 */}
                <label
                  className={`cursor-pointer flex items-center gap-3 p-3 rounded-2xl transition-all border ${
                    reason === 'student_excused'
                      ? 'bg-primary-fixed text-on-primary-fixed border-primary'
                      : 'bg-surface-container-low border-surface-container text-on-surface'
                  }`}
                >
                  <input
                    checked={reason === 'student_excused'}
                    className="w-4 h-4 text-primary accent-primary"
                    name="reason"
                    type="radio"
                    value="student_excused"
                    onChange={() => setReason('student_excused')}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg font-bold">Học sinh báo bận có phép</p>
                    <p className="font-body-sm text-body-sm opacity-80 truncate">Báo trước &gt; 6 giờ theo cam kết lớp</p>
                  </div>
                  <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
                </label>

                {/* Option 2 */}
                <label
                  className={`cursor-pointer flex items-center gap-3 p-3 rounded-2xl transition-all border ${
                    reason === 'tutor_emergency'
                      ? 'bg-primary-fixed text-on-primary-fixed border-primary'
                      : 'bg-surface-container-low border-surface-container text-on-surface'
                  }`}
                >
                  <input
                    checked={reason === 'tutor_emergency'}
                    className="w-4 h-4 text-primary accent-primary"
                    name="reason"
                    type="radio"
                    value="tutor_emergency"
                    onChange={() => setReason('tutor_emergency')}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg font-bold">Gia sư bận đột xuất / ốm</p>
                    <p className="font-body-sm text-body-sm opacity-80 truncate">Gia sư chủ động xin hẹn dạy bù</p>
                  </div>
                  <span className="material-symbols-outlined text-[20px] text-tertiary">healing</span>
                </label>

                {/* Option 3 */}
                <label
                  className={`cursor-pointer flex items-center gap-3 p-3 rounded-2xl transition-all border ${
                    reason === 'school_exam'
                      ? 'bg-primary-fixed text-on-primary-fixed border-primary'
                      : 'bg-surface-container-low border-surface-container text-on-surface'
                  }`}
                >
                  <input
                    checked={reason === 'school_exam'}
                    className="w-4 h-4 text-primary accent-primary"
                    name="reason"
                    type="radio"
                    value="school_exam"
                    onChange={() => setReason('school_exam')}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg font-bold">Lớp nghỉ lễ / Thi cử tại trường</p>
                    <p className="font-body-sm text-body-sm opacity-80 truncate">Trường trùng lịch hoạt động ngoại khóa</p>
                  </div>
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">school</span>
                </label>

                {/* Option 4 */}
                <label
                  className={`cursor-pointer flex items-center gap-3 p-3 rounded-2xl transition-all border ${
                    reason === 'student_unexcused'
                      ? 'bg-primary-fixed text-on-primary-fixed border-primary'
                      : 'bg-surface-container-low border-surface-container text-on-surface'
                  }`}
                >
                  <input
                    checked={reason === 'student_unexcused'}
                    className="w-4 h-4 text-primary accent-primary"
                    name="reason"
                    type="radio"
                    value="student_unexcused"
                    onChange={() => setReason('student_unexcused')}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-label-lg text-label-lg font-bold">Học sinh vắng không báo trước</p>
                    <p className="font-body-sm text-body-sm opacity-80 truncate">Sát giờ học hoặc không phản hồi</p>
                  </div>
                  <span className="material-symbols-outlined text-[20px] text-error">priority_high</span>
                </label>
              </div>
            </div>

            {/* Chính sách tính học phí */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">account_balance_wallet</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Chính sách tính học phí ca này
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                {/* Policy 1 */}
                <label
                  className={`cursor-pointer block p-3 rounded-2xl transition-all border ${
                    policy === 'reschedule_free'
                      ? 'bg-secondary-container/40 border-secondary'
                      : 'bg-surface-container-low border-surface-container'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      checked={policy === 'reschedule_free'}
                      className="mt-1 w-4 h-4 accent-secondary text-secondary"
                      name="billing_policy"
                      type="radio"
                      value="reschedule_free"
                      onChange={() => setPolicy('reschedule_free')}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-lg text-label-lg text-on-surface font-bold">
                          Không tính tiền &amp; Sắp xếp học bù
                        </span>
                        <span className="px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-bold">
                          Khuyên dùng
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Giữ nguyên số buổi trong tháng, học sinh không phát sinh chi phí bù.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Policy 2 */}
                <label
                  className={`cursor-pointer block p-3 rounded-2xl transition-all border ${
                    policy === 'charge_anyway'
                      ? 'bg-tertiary-fixed/40 border-tertiary'
                      : 'bg-surface-container-low border-surface-container'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      checked={policy === 'charge_anyway'}
                      className="mt-1 w-4 h-4 accent-tertiary text-tertiary"
                      name="billing_policy"
                      type="radio"
                      value="charge_anyway"
                      onChange={() => setPolicy('charge_anyway')}
                    />
                    <div className="flex-1">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">
                        Vẫn tính phí theo quy ước (Hủy &lt; 2h)
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Gia sư đã chuẩn bị giáo án và có mặt tại phòng học/nhà học sinh.
                      </p>
                    </div>
                  </div>
                </label>

                {/* Policy 3 */}
                <label
                  className={`cursor-pointer block p-3 rounded-2xl transition-all border ${
                    policy === 'deduct_month'
                      ? 'bg-surface-container border-primary'
                      : 'bg-surface-container-low border-surface-container'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      checked={policy === 'deduct_month'}
                      className="mt-1 w-4 h-4 accent-primary text-primary"
                      name="billing_policy"
                      type="radio"
                      value="deduct_month"
                      onChange={() => setPolicy('deduct_month')}
                    />
                    <div className="flex-1">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">
                        Trừ hẳn buổi này khỏi kỳ thu phí tháng
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Tổng học phí tháng 10 sẽ tự động giảm trừ 1 buổi (-300.000 đ).
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Chọn lịch học bù dự kiến */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Đề xuất lịch dạy bù
                  </h3>
                </div>
                <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  AI gợi ý trống
                </span>
              </div>

              {/* Quick Suggestion Box */}
              <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-2 border border-surface-container">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-variant flex items-center justify-center text-primary shrink-0 shadow-inner">
                    <span className="material-symbols-outlined text-[20px]">event_available</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-lg text-label-lg text-on-surface font-bold truncate">Chủ nhật, 28/10/2024</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">09:00 – 10:30 (Trống lịch cá nhân)</p>
                  </div>
                </div>
                <button
                  className={`px-3 py-1.5 rounded-xl font-label-md text-label-md font-bold active:scale-95 transition-all shrink-0 shadow-sm ${
                    isSlotApplied ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary'
                  }`}
                  type="button"
                  onClick={applyAISuggestion}
                >
                  {isSlotApplied ? 'Đã chọn' : 'Áp dụng'}
                </button>
              </div>

              {/* Custom Date/Time Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col border border-surface-container">
                  <label className="font-label-sm text-label-sm text-on-surface-variant mb-1">Ngày bù đã chọn</label>
                  <div className="flex items-center gap-1.5 text-on-surface font-label-lg text-label-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary">edit_calendar</span>
                    <input
                      className="w-full bg-transparent focus:outline-none font-bold text-on-surface"
                      type="text"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col border border-surface-container">
                  <label className="font-label-sm text-label-sm text-on-surface-variant mb-1">Khung giờ bù</label>
                  <div className="flex items-center gap-1.5 text-on-surface font-label-lg text-label-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                    <input
                      className="w-full bg-transparent focus:outline-none font-bold text-on-surface"
                      type="text"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Message Zalo */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">sms</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Tin nhắn tự động gửi Zalo
                  </h3>
                </div>
                <button
                  className="font-label-sm text-label-sm text-primary flex items-center gap-1 hover:underline font-bold"
                  type="button"
                  onClick={copyMessage}
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  Sao chép
                </button>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm leading-relaxed border border-surface-container">
                {previewMessage}
              </div>

              <div className="flex items-center gap-2 pt-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-secondary">mark_chat_read</span>
                <span className="font-body-sm text-body-sm">
                  Tự động đẩy thông báo vào nhóm Zalo lớp sau khi bấm xác nhận.
                </span>
              </div>
            </div>

            {/* Confirm CTA Button */}
            <div className="pt-1">
              <button
                className="w-full h-12 rounded-xl bg-primary-container text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-container/30 hover:bg-primary active:scale-[0.99] transition-all font-bold"
                type="button"
                onClick={handleConfirm}
              >
                <span className="material-symbols-outlined text-[22px]">send</span>
                <span>Xác nhận báo nghỉ &amp; Gửi thông báo</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: DANH SÁCH CA ĐÃ HỦY & CHỜ BÙ (LỊCH SỬ THÁNG 10) */}
        {activeTab === 'history' && (
          <div className="flex flex-col gap-3 animate-in fade-in">
            {/* Mini KPI Stat Bar */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-sm text-center border border-surface-container-high/50">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Tổng hủy</span>
                <p className="font-amount-display text-amount-display text-on-surface mt-0.5 font-bold">3</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-sm text-center border border-surface-container-high/50">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Đã bù/trừ</span>
                <p className="font-amount-display text-amount-display text-secondary mt-0.5 font-bold">2</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-sm text-center border border-surface-container-high/50">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Chờ xếp bù</span>
                <p className="font-amount-display text-amount-display text-tertiary-container mt-0.5 font-bold">1</p>
              </div>
            </div>

            {/* Item 1: Trần Hải Đăng */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary font-headline-sm text-headline-sm font-bold shadow-inner">
                    Đ
                  </div>
                  <div>
                    <h3 className="font-label-lg text-label-lg text-on-surface font-bold">Trần Hải Đăng</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Vật lý 10 • Hủy ngày 18/10</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-bold shrink-0 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">task_alt</span>
                  Đã xếp bù CN 21/10
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-body-sm font-body-sm border border-surface-container">
                <span className="text-on-surface-variant">Lý do: Học sinh thi Học kỳ ở trường</span>
                <span className="text-secondary font-bold">Đã hoàn thành</span>
              </div>
            </div>

            {/* Item 2: Lê Bảo Châu */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary font-headline-sm text-headline-sm font-bold shadow-inner">
                    C
                  </div>
                  <div>
                    <h3 className="font-label-lg text-label-lg text-on-surface font-bold">Lê Bảo Châu</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">IELTS Intensive • Hủy 12/10</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed font-bold shrink-0 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">remove_circle</span>
                  Đã trừ học phí T10 (-250k)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-body-sm font-body-sm border border-surface-container">
                <span className="text-on-surface-variant">Lý do: Gia sư bị sốt siêu vi</span>
                <span className="text-on-surface font-semibold">Tự động quyết toán</span>
              </div>
            </div>

            {/* Item 3: Minh Khang */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary font-headline-sm text-headline-sm font-bold shadow-inner">
                    K
                  </div>
                  <div>
                    <h3 className="font-label-lg text-label-lg text-on-surface font-bold">Minh Khang</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Toán 12 • Nghỉ ngày 05/10</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed font-bold shrink-0 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">pending_actions</span>
                  Chờ chốt ngày dạy bù
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-body-sm font-body-sm border border-surface-container">
                <span className="text-on-surface-variant">Lý do: Phụ huynh xin nghỉ có phép</span>
                <button
                  className="text-primary font-bold hover:underline flex items-center gap-0.5 font-label-sm text-label-sm"
                  type="button"
                  onClick={() => {
                    setActiveTab('action');
                    onShowToast('Đang mở màn hình xếp lịch bù cho Minh Khang');
                  }}
                >
                  <span>Xếp lịch ngay</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Helper Note Banner */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center gap-3 border border-surface-container">
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Mọi ca báo nghỉ đã xác nhận đều được tự động lưu dấu vết để tính bảng kê sao kê học phí cuối tháng minh bạch.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
