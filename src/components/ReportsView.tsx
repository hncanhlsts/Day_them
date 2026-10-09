import React, { useState } from 'react';
import { TOP_CONTRIBUTING_STUDENTS } from '../data/mockData';

interface ReportsViewProps {
  onShowToast: (msg: string) => void;
  onOpenAppsScript?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onShowToast, onOpenAppsScript }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Tháng 10/2023');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBar, setSelectedBar] = useState<string>('T10');

  const periods = [
    'Tháng 10/2023',
    'Tháng 09/2023',
    'Tháng 08/2023',
    'Quý 3/2023',
    'Cả năm 2023',
  ];

  const chartData = [
    { month: 'T5', value: 8.5, heightPct: '55%' },
    { month: 'T6', value: 9.8, heightPct: '65%' },
    { month: 'T7', value: 11.0, heightPct: '72%' },
    { month: 'T8', value: 10.2, heightPct: '68%' },
    { month: 'T9', value: 12.1, heightPct: '80%' },
    { month: 'T10', value: 14.2, heightPct: '95%', isPeak: true },
  ];

  const handleExportPDF = () => {
    onShowToast(`Đang kết xuất PDF Báo cáo tài chính ${selectedPeriod}...`);
    setTimeout(() => {
      onShowToast(`Đã tải xuống file: Bao_Cao_Hoc_Phi_${selectedPeriod.replace(/\//g, '_')}.pdf`);
    }, 1000);
  };

  const handleExportExcel = () => {
    onShowToast(`Đang tạo bảng kê chi tiết Excel...`);
    setTimeout(() => {
      onShowToast(`Đã xuất file: Bang_Ke_Gia_Su_${selectedPeriod.replace(/\//g, '_')}.xlsx`);
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 pt-20 gap-4">
      {/* Period Selector & Quick Filters */}
      <section className="relative">
        <div className="flex items-center justify-between gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-surface-container">
          <div className="relative flex-1">
            <button
              className="w-full flex items-center justify-between px-3 py-2 bg-surface-container-lowest rounded-xl shadow-sm text-left active:scale-[0.99] transition-transform border border-surface-container-high/50"
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">Kỳ báo cáo</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                    {selectedPeriod}
                  </span>
                </div>
              </div>
              <span className={`material-symbols-outlined text-outline text-[20px] transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-container-lowest rounded-2xl shadow-xl z-30 p-2 flex flex-col gap-1 border border-surface-container animate-in fade-in slide-in-from-top-2">
                {periods.map((p) => {
                  const isSelected = selectedPeriod === p;
                  return (
                    <button
                      key={p}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-surface-container text-primary font-bold'
                          : 'hover:bg-surface-container-low text-on-surface'
                      }`}
                      type="button"
                      onClick={() => {
                        setSelectedPeriod(p);
                        setShowDropdown(false);
                        onShowToast(`Đã tải dữ liệu báo cáo: ${p}`);
                      }}
                    >
                      <span>{p}</span>
                      {isSelected && <span className="material-symbols-outlined text-[18px]">check</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Export Trigger */}
          <button
            aria-label="Tải báo cáo nhanh"
            className="w-12 h-12 flex items-center justify-center bg-surface-container-lowest rounded-xl text-primary shadow-sm active:scale-95 transition-transform border border-surface-container-high/50"
            type="button"
            onClick={handleExportPDF}
          >
            <span className="material-symbols-outlined text-[22px]">download</span>
          </button>
        </div>
      </section>

      {/* Hero Income Summary Card */}
      <section className="relative overflow-hidden bg-primary text-on-primary rounded-2xl p-4 shadow-md">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-surface-tint/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-6 -top-6 w-28 h-28 bg-primary-fixed-dim/20 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary-fixed text-[18px]">account_balance_wallet</span>
              <span className="font-label-md text-label-md text-primary-fixed uppercase tracking-wider font-bold">Thực nhận sau đối soát</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +18%
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display-hero text-display-hero tracking-tight font-extrabold">14.200.000</span>
              <span className="font-headline-sm text-headline-sm text-primary-fixed font-bold">đ</span>
            </div>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim mt-0.5">Tăng 2.150.000 đ so với Tháng 09/2023</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-primary-container/60 backdrop-blur-md rounded-xl p-2.5 flex items-center gap-2.5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-surface-container-lowest/15 flex items-center justify-center text-primary-fixed">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-primary-fixed-dim truncate">Tổng giờ dạy</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-sm text-headline-sm text-on-primary font-bold">56h</span>
                  <span className="font-label-sm text-label-sm text-primary-fixed">~2.2h/d</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-container/60 backdrop-blur-md rounded-xl p-2.5 flex items-center gap-2.5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-surface-container-lowest/15 flex items-center justify-center text-primary-fixed">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-primary-fixed-dim truncate">Đơn giá TB / giờ</span>
                <span className="font-headline-sm text-headline-sm text-on-primary truncate font-bold">285.000đ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Month Revenue Visual Chart */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Xu hướng doanh thu</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">6 tháng gần nhất (Đơn vị: Triệu VNĐ)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container rounded-full text-primary font-label-sm text-label-sm font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Kỷ lục mới
          </div>
        </div>

        {/* Bar Graph Layout */}
        <div className="relative pt-8 pb-1">
          {/* Tooltip for Peak or Selected */}
          <div className="absolute top-0 right-3 bg-primary text-on-primary text-[11px] font-label-sm px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
            <span>T10: 14.2M</span>
            <span className="material-symbols-outlined text-[13px] text-secondary-container">star</span>
          </div>

          <div className="grid grid-cols-6 items-end gap-2 h-36 px-2">
            {chartData.map((b) => {
              const isSelected = selectedBar === b.month;
              return (
                <div
                  key={b.month}
                  className="flex flex-col items-center gap-2 h-full justify-end cursor-pointer group"
                  onClick={() => {
                    setSelectedBar(b.month);
                    onShowToast(`Doanh thu ${b.month}: ${b.value} Triệu VNĐ`);
                  }}
                >
                  <span className={`font-label-sm text-label-sm ${b.isPeak ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                    {b.value}
                  </span>
                  <div
                    className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                      b.isPeak
                        ? 'bg-primary shadow-md'
                        : isSelected
                        ? 'bg-primary-container'
                        : 'bg-surface-container-highest group-hover:bg-primary-fixed'
                    }`}
                    style={{ height: b.heightPct }}
                  ></div>
                  <span className={`font-label-md text-label-md ${b.isPeak ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                    {b.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth speed badge */}
        <div className="flex items-center justify-between pt-1 bg-surface-container-low p-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">insights</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Tốc độ tăng trưởng trung bình:</span>
          </div>
          <span className="font-label-md text-label-md text-secondary font-bold">+12.4% / tháng</span>
        </div>
      </section>

      {/* Income Structure: By Subject & Teaching Format */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Cơ cấu nguồn thu</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Phân tích theo môn học &amp; hình thức dạy</p>
          </div>
          <span className="material-symbols-outlined text-outline-variant">pie_chart</span>
        </div>

        {/* Subject Share Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-semibold">Tỷ lệ theo bộ môn</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Tổng 3 tổ hợp</span>
          </div>

          <div className="h-3 w-full rounded-full bg-surface-container flex overflow-hidden gap-0.5 p-0.5">
            <div className="h-full rounded-l-full bg-primary" style={{ width: '45%' }}></div>
            <div className="h-full bg-secondary" style={{ width: '30%' }}></div>
            <div className="h-full rounded-r-full bg-tertiary-container" style={{ width: '25%' }}></div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-primary shrink-0"></span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Môn Toán (THPT &amp; Luyện Thi)</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">45% tổng thu</span>
                </div>
              </div>
              <span className="font-label-lg text-label-lg text-on-surface font-bold">9.600.000 đ</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-secondary shrink-0"></span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Môn Tiếng Anh (IELTS &amp; Giao tiếp)</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">30% tổng thu</span>
                </div>
              </div>
              <span className="font-label-lg text-label-lg text-on-surface font-bold">6.400.000 đ</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-tertiary-container shrink-0"></span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Vật Lý &amp; Hóa Học Cơ bản</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">25% tổng thu</span>
                </div>
              </div>
              <span className="font-label-lg text-label-lg text-on-surface font-bold">5.400.000 đ</span>
            </div>
          </div>
        </div>

        {/* Format Breakdown */}
        <div className="flex flex-col gap-2 pt-1 bg-surface-container-low p-3 rounded-xl">
          <span className="font-label-md text-label-md text-on-surface font-semibold">Hình thức đào tạo</span>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-container-lowest p-2.5 rounded-xl flex flex-col items-center text-center shadow-xs">
              <span className="material-symbols-outlined text-primary text-[20px] mb-1">person</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">1-kèm-1</span>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">65%</span>
              <span className="text-[10px] text-on-surface-variant mt-0.5">36 giờ</span>
            </div>

            <div className="bg-surface-container-lowest p-2.5 rounded-xl flex flex-col items-center text-center shadow-xs">
              <span className="material-symbols-outlined text-secondary text-[20px] mb-1">group</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Nhóm 3–5 bạn</span>
              <span className="font-headline-sm text-headline-sm text-secondary font-bold">25%</span>
              <span className="text-[10px] text-on-surface-variant mt-0.5">14 giờ</span>
            </div>

            <div className="bg-surface-container-lowest p-2.5 rounded-xl flex flex-col items-center text-center shadow-xs">
              <span className="material-symbols-outlined text-tertiary-container text-[20px] mb-1">laptop_chromebook</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Online</span>
              <span className="font-headline-sm text-headline-sm text-tertiary-container font-bold">10%</span>
              <span className="text-[10px] text-on-surface-variant mt-0.5">6 giờ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Contributing Students */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">military_tech</span>
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Xếp hạng đóng góp học phí</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Các lớp &amp; học sinh có doanh thu cao nhất</p>
            </div>
          </div>
          <span className="font-label-sm text-label-sm text-primary font-bold bg-primary-fixed px-2 py-0.5 rounded-full">
            Top 4
          </span>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {TOP_CONTRIBUTING_STUDENTS.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between p-2.5 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  {item.avatarUrl ? (
                    <img
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover shadow-sm ring-1 ring-surface-container-highest"
                      src={item.avatarUrl}
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-headline-sm font-bold shadow-sm">
                      {item.initials}
                    </div>
                  )}
                  <span
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-white font-label-sm text-[10px] flex items-center justify-center font-bold ${
                      item.rank === 1 ? 'bg-primary' : 'bg-surface-container-highest text-on-surface'
                    }`}
                  >
                    {item.rank}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">{item.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-primary text-[10px] font-bold">
                      {item.subjectBadge}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{item.sessionsText}</span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className="font-headline-sm text-headline-sm text-primary font-bold">
                  {item.amount.toLocaleString('vi-VN')} đ
                </span>
                <span className="inline-flex items-center gap-0.5 text-secondary text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span> {item.statusText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reconciliation & Export Trigger */}
      <section className="bg-gradient-to-br from-surface-container-low via-surface-container-lowest to-surface-container p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Đối soát &amp; Lưu trữ</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Hỗ trợ xuất hóa đơn bảng kê gửi phụ huynh</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg active:scale-[0.98] transition-all shadow-sm font-bold"
            type="button"
            onClick={handleExportPDF}
          >
            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            <span>Xuất PDF</span>
          </button>
          <button
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-secondary-container text-on-secondary-container font-label-lg text-label-lg active:scale-[0.98] transition-all shadow-sm font-bold hover:bg-secondary-fixed-dim"
            type="button"
            onClick={handleExportExcel}
          >
            <span className="material-symbols-outlined text-[20px]">table_view</span>
            <span>Xuất Excel</span>
          </button>
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container text-primary font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors border border-surface-container-highest"
          type="button"
          onClick={onOpenAppsScript}
        >
          <span className="material-symbols-outlined text-[18px]">terminal</span>
          <span>Mở Trung Tâm Google Apps Script &amp; Sheets</span>
        </button>
      </section>
    </div>
  );
};
