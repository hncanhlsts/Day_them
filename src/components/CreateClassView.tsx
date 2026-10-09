import React, { useState } from 'react';
import { Student } from '../types';

interface CreateClassViewProps {
  onBack: () => void;
  onSuccess: (newStudent: Partial<Student>) => void;
  onShowToast: (msg: string) => void;
}

export const CreateClassView: React.FC<CreateClassViewProps> = ({
  onBack,
  onSuccess,
  onShowToast,
}) => {
  const [className, setClassName] = useState('Toán 10 - Ôn thi vào chuyên & Oxyz');
  const [learningMode, setLearningMode] = useState<'solo' | 'group' | 'online'>('solo');
  const [studentName, setStudentName] = useState('Hoàng Gia Bảo');
  const [school, setSchool] = useState('THPT Chuyên Sư Phạm');
  const [parentPhone, setParentPhone] = useState('0982 456 789');
  const [rate, setRate] = useState('350.000');
  const [billingCycle, setBillingCycle] = useState<'per-session' | 'monthly'>('per-session');
  const [hasMaterialFee, setHasMaterialFee] = useState(false);
  const [materialFee, setMaterialFee] = useState('150.000');
  const [selectedDays, setSelectedDays] = useState<string[]>(['T3', 'T6']);
  const [startTime, setStartTime] = useState('18:30');
  const [endTime, setEndTime] = useState('20:00');
  const [locationType, setLocationType] = useState<'home' | 'studio' | 'online-link'>('home');
  const [startScore, setStartScore] = useState('6.5');
  const [targetScore, setTargetScore] = useState('8.5+');
  const [notes, setNotes] = useState(
    'Em Bảo phản xạ đại số khá, cần củng cố hình học không gian Oxyz và phương pháp tọa độ hóa. Bố mẹ mong muốn cập nhật tiến độ sau mỗi 4 buổi.'
  );

  const daysList = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSaveDraft = () => {
    onShowToast('Đã lưu bản nháp lớp dạy vào bộ nhớ tạm!');
  };

  const handleSubmit = () => {
    if (!className.trim() || !studentName.trim()) {
      onShowToast('Vui lòng điền tên môn học và tên học viên!');
      return;
    }

    const cleanRate = parseInt(rate.replace(/\./g, ''), 10) || 300000;
    const initials = studentName
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map((w) => w[0].toUpperCase())
      .join('');

    const newStudent: Partial<Student> = {
      id: `stu-${Date.now()}`,
      name: studentName,
      initials: initials || 'HS',
      subject: className.split('-')[0].trim(),
      gradeBadge: className.includes('10') ? 'Lớp 10' : className.includes('12') ? 'Lớp 12' : 'Lớp 11',
      classType: learningMode === 'solo' ? '1-kèm-1' : learningMode === 'group' ? 'Nhóm nhỏ' : 'Lớp Online',
      categoryKey: learningMode === 'solo' ? '1-on-1' : 'group',
      feePerSession: cleanRate,
      completedSessions: 0,
      totalSessions: 8,
      statusBadge: 'Mới tạo',
      statusType: 'neutral',
      parentName: 'Phụ huynh ' + studentName.split(' ').slice(-1)[0],
      parentPhone: parentPhone || '0988.xxx.xxx',
      goal: `Mục tiêu: ${targetScore}`,
      note: notes,
    };

    onSuccess(newStudent);
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
                Thêm Lớp Mới
              </h1>
              <span className="font-label-sm text-label-sm text-primary truncate">Gia Sư Pro</span>
            </div>
          </div>
          <button
            aria-label="Trợ giúp"
            className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
            type="button"
            onClick={() => onShowToast('Hướng dẫn: Hoàn thiện 4 bước để tạo hồ sơ lớp học')}
          >
            <span className="material-symbols-outlined text-[22px]">help_outline</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col px-4 pt-3 pb-32 gap-4">
        {/* Progress & Motivational Sub-banner */}
        <div className="bg-surface-container-low p-3.5 rounded-2xl shadow-sm border border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[22px]">auto_stories</span>
            </div>
            <div>
              <p className="font-label-lg text-label-lg text-on-surface font-bold">Khởi tạo hành trình tri thức</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Điền thông tin để quản lý lịch và học phí tự động</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-bold">
            4 Bước
          </span>
        </div>

        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          {/* SECTION 1: Thông tin môn học */}
          <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">school</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">1. Thông tin môn học</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Chi tiết phân loại và học viên theo học</p>
              </div>
            </div>

            {/* Tên lớp & Gợi ý nhanh */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface flex items-center justify-between font-semibold" htmlFor="class-name-input">
                <span>Tên lớp / Môn học <span className="text-error">*</span></span>
                <span className="font-label-sm text-label-sm text-primary flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">bolt</span> Gợi ý nhanh
                </span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-outline absolute left-3 text-[20px] pointer-events-none">
                  edit_note
                </span>
                <input
                  className="w-full h-12 pl-10 pr-4 bg-surface-container-low text-on-surface rounded-xl font-body-md text-body-md placeholder:text-outline outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all border border-surface-container"
                  id="class-name-input"
                  placeholder="Ví dụ: Toán 10 - Nâng cao chuyên đề Oxyz"
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>

              {/* Preset pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none -mx-1 px-1">
                <button
                  className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shrink-0 hover:bg-surface-container-high transition-colors"
                  type="button"
                  onClick={() => setClassName('Toán 12 - Luyện thi THPTQG')}
                >
                  + Toán 12 THPTQG
                </button>
                <button
                  className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shrink-0 hover:bg-surface-container-high transition-colors"
                  type="button"
                  onClick={() => setClassName('Tiếng Anh IELTS 6.5+ Academic')}
                >
                  + IELTS 6.5+ Target
                </button>
                <button
                  className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm shrink-0 hover:bg-surface-container-high transition-colors"
                  type="button"
                  onClick={() => setClassName('Vật lý 11 - Cơ bản & Bài tập')}
                >
                  + Vật lý 11
                </button>
              </div>
            </div>

            {/* Hình thức tổ chức lớp */}
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Hình thức lớp học</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    learningMode === 'solo'
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  type="button"
                  onClick={() => setLearningMode('solo')}
                >
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  <span className="font-label-sm text-label-sm font-bold">1-kèm-1</span>
                  <span className="text-[10px] opacity-80">Cá nhân</span>
                </button>

                <button
                  className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    learningMode === 'group'
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  type="button"
                  onClick={() => setLearningMode('group')}
                >
                  <span className="material-symbols-outlined text-[20px]">groups</span>
                  <span className="font-label-sm text-label-sm font-bold">Nhóm nhỏ</span>
                  <span className="text-[10px] opacity-80">2 - 5 học sinh</span>
                </button>

                <button
                  className={`p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    learningMode === 'online'
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  type="button"
                  onClick={() => setLearningMode('online')}
                >
                  <span className="material-symbols-outlined text-[20px]">devices</span>
                  <span className="font-label-sm text-label-sm font-bold">Lớp Online</span>
                  <span className="text-[10px] opacity-80">Google Meet</span>
                </button>
              </div>
            </div>

            {/* Học sinh & Phụ huynh */}
            <div className="bg-surface-container-low p-3.5 rounded-2xl flex flex-col gap-2.5 border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
                  Thông tin học viên đại diện
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                  Đang theo học
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-outline absolute left-3 text-[18px]">face</span>
                  <input
                    className="w-full h-11 pl-10 pr-3 bg-surface-container-lowest text-on-surface rounded-xl font-body-md text-body-md outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-surface-container"
                    placeholder="Tên học sinh (vd: Hoàng Gia Bảo)"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-outline absolute left-2.5 text-[18px]">account_balance</span>
                    <input
                      className="w-full h-11 pl-9 pr-2 bg-surface-container-lowest text-on-surface rounded-xl font-body-sm text-body-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-surface-container"
                      placeholder="Trường học"
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    />
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-outline absolute left-2.5 text-[18px]">call</span>
                    <input
                      className="w-full h-11 pl-9 pr-2 bg-surface-container-lowest text-on-surface rounded-xl font-body-sm text-body-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-surface-container"
                      placeholder="SĐT Phụ huynh"
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Học phí & Thanh toán */}
          <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">2. Học phí &amp; Thanh toán</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Tự động chốt đối soát vào cuối kỳ</p>
              </div>
            </div>

            {/* Đơn giá học phí */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Đơn giá học phí</label>
              <div className="flex items-center bg-surface-container-low rounded-xl px-3 py-1 border border-surface-container focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="font-headline-md text-headline-md text-primary font-bold">₫</span>
                <input
                  className="w-full h-12 px-2 bg-transparent text-on-surface font-amount-display text-amount-display outline-none"
                  placeholder="0"
                  type="text"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
                <div className="shrink-0 flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-lg">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">/ buổi</span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
                </div>
              </div>
            </div>

            {/* Chu kỳ & Hình thức thu phí */}
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`p-3 rounded-xl flex flex-col items-start gap-1 text-left transition-all border ${
                  billingCycle === 'per-session'
                    ? 'bg-surface-container-high text-primary border-primary/20 font-bold'
                    : 'bg-surface-container-low text-on-surface border-surface-container'
                }`}
                type="button"
                onClick={() => setBillingCycle('per-session')}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="material-symbols-outlined text-[20px]">event_available</span>
                  {billingCycle === 'per-session' && (
                    <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                  )}
                </div>
                <span className="font-label-md text-label-md">Theo buổi dạy</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">Điểm danh xong tính phí</span>
              </button>

              <button
                className={`p-3 rounded-xl flex flex-col items-start gap-1 text-left transition-all border ${
                  billingCycle === 'monthly'
                    ? 'bg-surface-container-high text-primary border-primary/20 font-bold'
                    : 'bg-surface-container-low text-on-surface border-surface-container'
                }`}
                type="button"
                onClick={() => setBillingCycle('monthly')}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="material-symbols-outlined text-[20px] text-outline">calendar_month</span>
                  {billingCycle === 'monthly' && (
                    <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                  )}
                </div>
                <span className="font-label-md text-label-md">Trọn gói tháng</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">Đầu tháng xuất hóa đơn</span>
              </button>
            </div>

            {/* Phụ thu in ấn & Giáo trình Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-semibold">Phụ thu in ấn &amp; Giáo trình</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Miễn phí đề thi &amp; tài liệu chuyên sâu</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  checked={hasMaterialFee}
                  className="sr-only peer"
                  type="checkbox"
                  onChange={(e) => setHasMaterialFee(e.target.checked)}
                />
                <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {hasMaterialFee && (
              <div className="flex items-center bg-surface-container rounded-xl px-3 py-1.5 animate-in fade-in">
                <span className="font-label-md text-label-md text-on-surface-variant">Mức phụ thu:</span>
                <input
                  className="w-full h-10 px-2 bg-transparent text-on-surface font-label-lg text-label-lg outline-none font-bold"
                  type="text"
                  value={materialFee}
                  onChange={(e) => setMaterialFee(e.target.value)}
                />
                <span className="font-label-sm text-label-sm text-on-surface-variant">₫ / kỳ</span>
              </div>
            )}
          </section>

          {/* SECTION 3: Lịch học định kỳ & Địa điểm */}
          <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">3. Lịch học &amp; Địa điểm</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Lên khung thời gian định kỳ mỗi tuần</p>
              </div>
            </div>

            {/* Chọn thứ trong tuần */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface font-semibold">Chọn ngày học trong tuần</label>
                <span className="font-label-sm text-label-sm text-primary font-bold">
                  {selectedDays.length} buổi / tuần
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {daysList.map((d) => {
                  const isSelected = selectedDays.includes(d);
                  return (
                    <button
                      key={d}
                      className={`h-11 rounded-xl flex items-center justify-center font-label-md text-label-md transition-all ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-sm font-bold'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                      type="button"
                      onClick={() => toggleDay(d)}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Khung giờ học */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Bắt đầu</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-outline absolute left-3 text-[18px]">schedule</span>
                  <input
                    className="w-full h-11 pl-10 pr-2 bg-surface-container-low text-on-surface font-label-lg text-label-lg rounded-xl outline-none border border-surface-container focus:ring-2 focus:ring-primary/20"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Kết thúc (90 phút)</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-outline absolute left-3 text-[18px]">timelapse</span>
                  <input
                    className="w-full h-11 pl-10 pr-2 bg-surface-container-low text-on-surface font-label-lg text-label-lg rounded-xl outline-none border border-surface-container focus:ring-2 focus:ring-primary/20"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Địa điểm học */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Địa điểm học tập</label>
              <div className="flex flex-col gap-2">
                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    locationType === 'home'
                      ? 'bg-primary-fixed/30 border-primary text-on-surface font-semibold'
                      : 'bg-surface-container-low border-surface-container text-on-surface'
                  }`}
                >
                  <input
                    checked={locationType === 'home'}
                    className="w-4 h-4 text-primary accent-primary"
                    name="location-type"
                    type="radio"
                    value="home"
                    onChange={() => setLocationType('home')}
                  />
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">home_pin</span>
                    <span className="font-body-md text-body-md">Tại nhà học viên (Số 42 Ngõ 12 Đào Tấn)</span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    locationType === 'studio'
                      ? 'bg-primary-fixed/30 border-primary text-on-surface font-semibold'
                      : 'bg-surface-container-low border-surface-container text-on-surface'
                  }`}
                >
                  <input
                    checked={locationType === 'studio'}
                    className="w-4 h-4 text-primary accent-primary"
                    name="location-type"
                    type="radio"
                    value="studio"
                    onChange={() => setLocationType('studio')}
                  />
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-outline">apartment</span>
                    <span className="font-body-md text-body-md">Tại studio / Phòng học gia sư</span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    locationType === 'online-link'
                      ? 'bg-primary-fixed/30 border-primary text-on-surface font-semibold'
                      : 'bg-surface-container-low border-surface-container text-on-surface'
                  }`}
                >
                  <input
                    checked={locationType === 'online-link'}
                    className="w-4 h-4 text-primary accent-primary"
                    name="location-type"
                    type="radio"
                    value="online-link"
                    onChange={() => setLocationType('online-link')}
                  />
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-outline">video_call</span>
                    <span className="font-body-md text-body-md">Phòng học trực tuyến Google Meet</span>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* SECTION 4: Mục tiêu học tập & Ghi chú */}
          <section className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">track_changes</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">4. Mục tiêu &amp; Lộ trình</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Định hướng kết quả học tập cho học viên</p>
              </div>
            </div>

            {/* Điểm xuất phát & mục tiêu */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Điểm xuất phát</span>
                <div className="flex items-baseline gap-1">
                  <input
                    className="w-12 text-on-surface font-headline-md text-headline-md bg-transparent outline-none font-bold"
                    type="text"
                    value={startScore}
                    onChange={(e) => setStartScore(e.target.value)}
                  />
                  <span className="font-body-sm text-body-sm text-outline">/ 10.0</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-high flex flex-col gap-1 border border-primary/20">
                <span className="font-label-sm text-label-sm text-primary font-bold">Mục tiêu kỳ vọng</span>
                <div className="flex items-baseline gap-1">
                  <input
                    className="w-14 text-primary font-headline-md text-headline-md bg-transparent outline-none font-bold"
                    type="text"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                  />
                  <span className="font-body-sm text-body-sm text-primary font-semibold">/ Chuyên</span>
                </div>
              </div>
            </div>

            {/* Ghi chú riêng tư */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface flex items-center gap-1 font-semibold" htmlFor="class-notes">
                <span>Ghi chú riêng tư gia sư</span>
                <span className="material-symbols-outlined text-[16px] text-outline">lock</span>
              </label>
              <textarea
                className="w-full p-3 bg-surface-container-low text-on-surface rounded-xl font-body-md text-body-md placeholder:text-outline outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all border border-surface-container"
                id="class-notes"
                placeholder="Ví dụ: Em hơi yếu phần hình không gian. Cần củng cố trước khi vào bài tập 8+..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </section>

          {/* Visual Banner: Cam kết chất lượng */}
          <div className="bg-surface-container-low rounded-2xl p-3.5 flex items-center gap-3 border border-surface-container">
            <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-bold">Đồng bộ lịch dạy thông minh</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Lớp sau khi tạo sẽ tự sinh lịch điểm danh và mẫu hóa đơn VietQR tương ứng.
              </span>
            </div>
          </div>
        </form>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-3 pb-safe z-40 border-t border-surface-container shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <button
            className="h-12 px-4 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-transform font-bold"
            type="button"
            onClick={handleSaveDraft}
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            <span>Lưu nháp</span>
          </button>
          <button
            className="h-12 flex-1 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-98 transition-all hover:bg-primary-container font-bold"
            type="button"
            onClick={handleSubmit}
          >
            <span className="material-symbols-outlined text-[22px]">add_task</span>
            <span>Tạo lớp học ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
