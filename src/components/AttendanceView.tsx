import React, { useState } from 'react';

interface AttendanceViewProps {
  studentId?: string;
  sessionId?: string;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  onBack,
  onShowToast,
}) => {
  const [attendanceStatus, setAttendanceStatus] = useState<'on-time' | 'late' | 'excused' | 'unexcused'>('on-time');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [focusRating, setFocusRating] = useState(4);
  const [comprehensionRating, setComprehensionRating] = useState(5);
  const [attitudeRating, setAttitudeRating] = useState(5);

  const [lessonFeedback, setLessonFeedback] = useState(
    'Ôn tập chuyên đề Khái niệm lũy thừa & Đạo hàm cấp 1. Khang nắm chắc công thức cơ bản, xử lý tốt bài tập mức độ thông hiểu.'
  );
  const [homeworkFeedback, setHomeworkFeedback] = useState(
    'Làm đề luyện tập số 3 (câu 1 – 25) trong tập tài liệu phát đầu tháng. Nộp trước 20h Thứ 6.'
  );

  const [attachedPhotos, setAttachedPhotos] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB_JLktj4Qj37FfTLLwKFnJxpTXqIfAWZj2_tQ__2Isz2N7WP92iY_Wr2Typ2aIoHVUZBvyRe9UVLyqzVo4ixBpBFwtod_x0EfVEMqr86Ab0emosVH39LYCrykvqzOJTdmGnWeJ_jT4ZMNMuAKISekEJwMH4zhcHCtBm6NQLRqqaJBXbontK5sekYDJ7VJelPeHBh-SgU0gT9fxdD4RPuS8Phk7d49mOLLpmoD8viQ0k7Q32g_QVxRg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCW8qJtI7Yv2XyQVpgr3MPYBWDbUEF8ES81e1rl4ZUVa3cyFOPsgwg1HfFXbLHXs3ilITNclvbY46WZ5LOwEjpdwCY7QvDRCCvT8FlXDvGPXmsHp57zhRO_uOjYEghyMgDfqMUViHwpPxMkm8I81kXEJ-60BG4CoilMFQ7PmwjTh9F2EHR8oEqfCA6HXyF-MU94xi5Zetkd1FCNKDYgXFT92KadOX4EP5QglN974g-MU2PzXsTjsrXW',
  ]);

  const [sendZalo, setSendZalo] = useState(true);

  const getAttendanceLabel = () => {
    switch (attendanceStatus) {
      case 'late': return 'Đi trễ 15p';
      case 'excused': return 'Vắng có phép';
      case 'unexcused': return 'Vắng không phép';
      default: return 'Đúng giờ (18:30 – 20:00)';
    }
  };

  const previewZaloText = `Kính gửi Chị Mai, em xin gửi nhận xét buổi học ngày 24/10 của Khang:
• Điểm danh: ${getAttendanceLabel()} (thời lượng ${durationMinutes}p).
• Đánh giá chung: Tập trung: ${focusRating}/5★ | Tiếp thu: ${comprehensionRating}/5★ | Tự giác: ${attitudeRating}/5★.
• Nội dung: ${lessonFeedback}
• BTVN: ${homeworkFeedback}
Gia Sư Pro đồng hành cùng gia đình & em Khang.`;

  const copyZaloText = () => {
    navigator.clipboard?.writeText(previewZaloText);
    onShowToast('Đã sao chép tin nhắn Zalo gửi phụ huynh!');
  };

  const removePhoto = (index: number) => {
    setAttachedPhotos(attachedPhotos.filter((_, i) => i !== index));
    onShowToast('Đã xóa 1 ảnh đính kèm.');
  };

  const addPhoto = () => {
    onShowToast('Đã chọn thêm ảnh bài làm từ camera / thư viện ảnh.');
  };

  const handleSubmitAll = () => {
    if (sendZalo) {
      onShowToast('Đã lưu ca học và gửi tin nhắn Zalo tới phụ huynh Chị Mai thành công!');
    } else {
      onShowToast('Đã lưu nhật ký ca học thành công!');
    }
    setTimeout(() => {
      onBack();
    }, 700);
  };

  const handleSaveInternal = () => {
    onShowToast('Đã lưu nội bộ sổ tay gia sư (không gửi thông báo)!');
    setTimeout(() => {
      onBack();
    }, 700);
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
                Điểm Danh &amp; Nhận Xét Ca Học
              </h1>
              <span className="font-label-sm text-label-sm text-primary truncate">Gia Sư Pro</span>
            </div>
          </div>
          <button
            aria-label="Trợ giúp"
            className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
            type="button"
            onClick={() => onShowToast('Hướng dẫn: Nhận xét khách quan giúp phụ huynh an tâm')}
          >
            <span className="material-symbols-outlined text-[22px]">help_outline</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col px-4 pt-3 pb-32 gap-4">
        {/* Student Header Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 shadow-sm ring-2 ring-primary/20">
                <img
                  alt="Student"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT379ihS2hPmm207bU9lqEogXiUrclBhj3i9Kqnu4jNHOx7h0ZTDtAymoT8V88oJt8LcnbPi_ayt7VuiQ4i3r1Yr4UmXq2i76LMVsYBR-yizpzxdHaV--CJjZffbbNUzpnWc_ifrsrlyikwgQXx1BByn93JlVF8yJ33yjfVNURu4AEmhWvhB9i2bPCBeJhotC3Rt7C9iA4hgCCwnfuM5ZEB8BqYQMhIrVW4z2uA2F4v-PbUJMBifB3"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                    Nguyễn Minh Khang
                  </span>
                  <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Toán 12 Cơ bản &amp; Luyện thi ĐGNL
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-bold shrink-0">
              Buổi 7/8
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-2.5 rounded-xl border border-surface-container">
            <div className="flex items-center gap-1.5 text-on-surface-variant min-w-0">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0">calendar_today</span>
              <span className="font-body-sm text-body-sm truncate font-medium">Thứ Tư, 24/10/2024</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant min-w-0">
              <span className="material-symbols-outlined text-[18px] text-primary shrink-0">schedule</span>
              <span className="font-body-sm text-body-sm truncate font-medium">18:30 – 20:00 (90p)</span>
            </div>
          </div>
        </div>

        {/* Section 1: Điểm danh & Thời lượng */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">how_to_reg</span>
              <h2 className="font-label-lg text-label-lg text-on-surface font-bold">Điểm danh &amp; Thời lượng</h2>
            </div>
            <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/60 px-2.5 py-0.5 rounded-full font-bold">
              Đã xác nhận
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-label-md text-label-md transition-all font-bold ${
                attendanceStatus === 'on-time'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
              type="button"
              onClick={() => setAttendanceStatus('on-time')}
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Đúng giờ</span>
            </button>

            <button
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-label-md text-label-md transition-all font-bold ${
                attendanceStatus === 'late'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
              type="button"
              onClick={() => setAttendanceStatus('late')}
            >
              <span className="material-symbols-outlined text-[18px]">pace</span>
              <span>Đi trễ 15p</span>
            </button>

            <button
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-label-md text-label-md transition-all font-bold ${
                attendanceStatus === 'excused'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
              type="button"
              onClick={() => setAttendanceStatus('excused')}
            >
              <span className="material-symbols-outlined text-[18px]">event_busy</span>
              <span>Vắng có phép</span>
            </button>

            <button
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-label-md text-label-md transition-all font-bold ${
                attendanceStatus === 'unexcused'
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
              type="button"
              onClick={() => setAttendanceStatus('unexcused')}
            >
              <span className="material-symbols-outlined text-[18px]">person_cancel</span>
              <span>Vắng không phép</span>
            </button>
          </div>

          {/* Stepper for duration */}
          <div className="flex items-center justify-between bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">timer</span>
              <span className="font-body-md text-body-md text-on-surface font-semibold">Thời lượng thực tế</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Giảm 15 phút"
                className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface active:scale-90 transition-transform shadow-sm"
                type="button"
                onClick={() => setDurationMinutes(Math.max(30, durationMinutes - 15))}
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="font-label-lg text-label-lg text-primary w-16 text-center font-bold">
                {durationMinutes} phút
              </span>
              <button
                aria-label="Tăng 15 phút"
                className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface active:scale-90 transition-transform shadow-sm"
                type="button"
                onClick={() => setDurationMinutes(Math.min(240, durationMinutes + 15))}
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Đánh giá & Nhận xét sư phạm */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary-container text-[22px]">auto_stories</span>
              <h2 className="font-label-lg text-label-lg text-on-surface font-bold">Đánh giá &amp; Nhận xét sư phạm</h2>
            </div>
            <span className="text-tertiary font-label-sm text-label-sm bg-tertiary-fixed px-2.5 py-0.5 rounded-full font-bold">
              Tháng 10
            </span>
          </div>

          {/* Star rating criteria */}
          <div className="flex flex-col gap-3 bg-surface-container-low p-3.5 rounded-xl border border-surface-container">
            {/* Criteria 1 */}
            <div className="flex items-center justify-between">
              <span className="font-body-md text-body-md text-on-surface font-medium">Mức độ tập trung</span>
              <div className="flex items-center gap-1 text-tertiary-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFocusRating(star)}
                    className="p-0.5 active:scale-110 transition-transform"
                  >
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={star <= focusRating ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Criteria 2 */}
            <div className="flex items-center justify-between">
              <span className="font-body-md text-body-md text-on-surface font-medium">Tiếp thu kiến thức</span>
              <div className="flex items-center gap-1 text-tertiary-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setComprehensionRating(star)}
                    className="p-0.5 active:scale-110 transition-transform"
                  >
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={star <= comprehensionRating ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Criteria 3 */}
            <div className="flex items-center justify-between">
              <span className="font-body-md text-body-md text-on-surface font-medium">Thái độ &amp; Tự giác</span>
              <div className="flex items-center gap-1 text-tertiary-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setAttitudeRating(star)}
                    className="p-0.5 active:scale-110 transition-transform"
                  >
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={star <= attitudeRating ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bài học đã dạy hôm nay */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface flex items-center justify-between font-semibold" htmlFor="lessonFeedback">
              <span>Bài học đã dạy hôm nay</span>
              <span className="font-label-sm text-label-sm text-primary font-normal">Gợi ý AI có sẵn</span>
            </label>
            <textarea
              className="w-full bg-surface-container-low rounded-xl p-3 text-body-md font-body-md text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all resize-none border border-surface-container"
              id="lessonFeedback"
              rows={3}
              value={lessonFeedback}
              onChange={(e) => setLessonFeedback(e.target.value)}
            />
          </div>

          {/* Bài tập về nhà giao */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface font-semibold" htmlFor="homeworkFeedback">
              Bài tập về nhà giao (BTVN)
            </label>
            <textarea
              className="w-full bg-surface-container-low rounded-xl p-3 text-body-md font-body-md text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all resize-none border border-surface-container"
              id="homeworkFeedback"
              rows={2}
              value={homeworkFeedback}
              onChange={(e) => setHomeworkFeedback(e.target.value)}
            />
          </div>

          {/* Đính kèm ảnh */}
          <div className="flex flex-col gap-1.5">
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              Đính kèm ảnh bài làm / Bảng viết ({attachedPhotos.length})
            </span>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {attachedPhotos.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-sm bg-surface-container group">
                  <img alt={`Attachment ${i + 1}`} className="w-full h-full object-cover" src={url} />
                  <button
                    aria-label="Xóa ảnh"
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-inverse-surface/80 text-inverse-on-surface flex items-center justify-center hover:bg-black transition-colors"
                    type="button"
                    onClick={() => removePhoto(i)}
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ))}

              <button
                className="aspect-square rounded-xl bg-surface-container-low border border-dashed border-outline-variant flex flex-col items-center justify-center gap-1 text-primary hover:bg-surface-container transition-colors"
                type="button"
                onClick={addPhoto}
              >
                <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                <span className="font-label-sm text-label-sm font-semibold">Thêm ảnh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Gửi báo cáo qua Zalo */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">Gửi báo cáo qua Zalo</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Phụ huynh: Chị Mai (Mẹ Khang)</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                checked={sendZalo}
                className="sr-only peer"
                type="checkbox"
                onChange={(e) => setSendZalo(e.target.checked)}
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
            </label>
          </div>

          {sendZalo && (
            <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-surface-container animate-in fade-in">
              <div className="flex items-center justify-between text-on-surface-variant pb-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">mark_chat_read</span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                    Xem trước tin nhắn Zalo
                  </span>
                </div>
                <button
                  className="flex items-center gap-1 text-primary font-label-sm text-label-sm font-bold hover:underline"
                  type="button"
                  onClick={copyZaloText}
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span>
                  <span>Sao chép</span>
                </button>
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-xl text-body-sm font-body-sm text-on-surface flex flex-col gap-1.5 shadow-sm border border-surface-container">
                <p className="font-bold text-primary">Kính gửi Chị Mai, em xin gửi nhận xét buổi học ngày 24/10 của Khang:</p>
                <p>• <strong>Điểm danh:</strong> {getAttendanceLabel()}.</p>
                <p>• <strong>Đánh giá chung:</strong> Tập trung: {focusRating}/5★ | Tiếp thu: {comprehensionRating}/5★ | Tự giác: {attitudeRating}/5★.</p>
                <p>• <strong>Nội dung:</strong> {lessonFeedback}</p>
                <p>• <strong>BTVN:</strong> {homeworkFeedback}</p>
                <p className="text-on-surface-variant font-label-sm text-label-sm italic pt-1 border-t border-surface-container/50">
                  Gia Sư Pro đồng hành cùng gia đình &amp; em Khang.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            className="w-full h-12 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-transform hover:bg-primary"
            type="button"
            onClick={handleSubmitAll}
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
            <span>Lưu &amp; Gửi nhận xét cho Phụ huynh</span>
          </button>
          <button
            className="w-full h-11 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-container transition-colors border border-surface-container"
            type="button"
            onClick={handleSaveInternal}
          >
            <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
            <span>Chỉ lưu nội bộ (Không gửi phụ huynh)</span>
          </button>
        </div>
      </main>
    </div>
  );
};
