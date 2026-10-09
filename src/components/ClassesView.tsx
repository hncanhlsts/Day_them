import React, { useState } from 'react';
import { INITIAL_STUDENTS } from '../data/mockData';
import { Student } from '../types';

interface ClassesViewProps {
  onOpenStudentDetail: (student: Student) => void;
  onOpenCreateClass: () => void;
  onShowToast: (msg: string) => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  onOpenStudentDetail,
  onOpenCreateClass,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | '1-on-1' | 'group' | 'urgent'>('all');
  const [students] = useState<Student[]>(INITIAL_STUDENTS);

  const filteredStudents = students.filter((s) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === '1-on-1' && s.categoryKey === '1-on-1') ||
      (activeFilter === 'group' && s.categoryKey === 'group') ||
      (activeFilter === 'urgent' && (s.statusType === 'urgent' || s.categoryKey === 'urgent'));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.subject.toLowerCase().includes(q) ||
      s.classType.toLowerCase().includes(q) ||
      s.parentName.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 pt-20 gap-4">
      {/* Top Search & Filter Module */}
      <section className="flex flex-col gap-3">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            className="w-full h-12 pl-11 pr-10 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 shadow-sm text-body-md font-body-md text-on-surface placeholder:text-outline focus:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Tìm học sinh, lớp học, môn học..."
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              aria-label="Xóa tìm kiếm"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface"
              type="button"
              onClick={() => setSearchQuery('')}
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Filter Pills Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none" role="tablist">
          <button
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all ${
              activeFilter === 'all'
                ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high/50'
            }`}
            type="button"
            onClick={() => setActiveFilter('all')}
          >
            Tất cả (8)
          </button>
          <button
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all ${
              activeFilter === '1-on-1'
                ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high/50'
            }`}
            type="button"
            onClick={() => setActiveFilter('1-on-1')}
          >
            Lớp 1-kèm-1 (5)
          </button>
          <button
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all ${
              activeFilter === 'group'
                ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high/50'
            }`}
            type="button"
            onClick={() => setActiveFilter('group')}
          >
            Nhóm nhỏ (2)
          </button>
          <button
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all ${
              activeFilter === 'urgent'
                ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high/50'
            }`}
            type="button"
            onClick={() => setActiveFilter('urgent')}
          >
            Luyện thi cấp tốc (1)
          </button>
        </div>
      </section>

      {/* Overview Metrics Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container p-4 text-on-primary shadow-md">
        <div className="absolute -right-6 -bottom-8 w-32 h-32 rounded-full bg-on-primary/10 blur-xl pointer-events-none"></div>
        <div className="absolute right-4 top-2 w-16 h-16 rounded-full bg-secondary-container/20 blur-md pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex p-1 rounded-lg bg-on-primary/15 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[18px] text-primary-fixed">school</span>
              </span>
              <span className="font-label-md text-label-md text-primary-fixed tracking-wide uppercase">Tháng 10 / 2024</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm shadow-sm animate-pulse">
              <span className="material-symbols-outlined text-[14px]">notification_important</span>
              <span>3 sắp thi giữa kỳ</span>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="font-headline-lg text-headline-lg leading-tight font-extrabold tracking-tight">8 lớp đang dạy</div>
              <p className="font-body-sm text-body-sm text-primary-fixed-dim mt-0.5">Quy mô 12 học sinh hoạt động đều</p>
            </div>
            <div className="text-right">
              <div className="font-amount-display text-amount-display leading-none text-secondary-container">26/32</div>
              <span className="font-label-sm text-label-sm text-primary-fixed block mt-1">Buổi đã hoàn thành</span>
            </div>
          </div>

          {/* Monthly Aggregate Progress */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="w-full h-2 rounded-full bg-on-primary/20 overflow-hidden">
              <div className="h-full rounded-full bg-secondary-container transition-all duration-700" style={{ width: '81.25%' }}></div>
            </div>
            <div className="flex justify-between items-center text-primary-fixed-dim font-label-sm text-label-sm">
              <span>Tiến độ giảng dạy toàn studio</span>
              <span className="font-semibold text-secondary-container">81% chỉ tiêu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Students Roster Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
            Danh sách học sinh
          </h2>
          <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-3 py-0.5 rounded-full font-semibold">
            Hiển thị {filteredStudents.length}/{students.length}
          </span>
        </div>

        {/* Student Cards Stack */}
        <div className="flex flex-col gap-3">
          {filteredStudents.map((student) => {
            const percentage = Math.round((student.completedSessions / student.totalSessions) * 100);
            const remainingSessions = student.totalSessions - student.completedSessions;

            return (
              <article
                key={student.id}
                className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high/50 hover:shadow-md transition-all flex flex-col gap-3"
              >
                {/* Header row: Avatar, Subject & Quick Call */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0 w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary font-headline-md text-headline-md font-bold shadow-inner">
                      {student.initials}
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
                          {student.name}
                        </h3>
                        {student.statusType === 'urgent' && (
                          <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                            {student.statusBadge}
                          </span>
                        )}
                        {student.statusType === 'success' && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                            {student.statusBadge}
                          </span>
                        )}
                        {student.statusType === 'warning' && (
                          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-bold">
                            {student.statusBadge}
                          </span>
                        )}
                        {student.statusType === 'neutral' && (
                          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
                            {student.statusBadge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="font-label-md text-label-md text-primary font-semibold">
                          {student.subject}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant">
                          {student.classType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Call action trigger */}
                  <a
                    aria-label={`Gọi phụ huynh ${student.parentName}`}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center hover:bg-secondary-container transition-colors shadow-sm active:scale-95"
                    href={`tel:${student.parentPhone.replace(/[^0-9]/g, '')}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowToast(`Đang gọi phụ huynh: ${student.parentName} (${student.parentPhone})`);
                    }}
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      call
                    </span>
                  </a>
                </div>

                {/* Metric Details Grid */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-surface-container-low">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Học phí / Buổi</span>
                    <span className="font-headline-sm text-headline-sm font-extrabold text-on-surface tracking-tight mt-0.5">
                      {student.feePerSession.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Đã học tháng này</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`font-headline-sm text-headline-sm font-bold ${percentage === 100 ? 'text-secondary' : 'text-primary'}`}>
                        {student.completedSessions}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        / {student.totalSessions} buổi
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attendance Progress Visualizer */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center font-label-sm text-label-sm">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className={`material-symbols-outlined text-[14px] ${percentage === 100 ? 'text-secondary' : 'text-primary'}`}>
                        {percentage === 100 ? 'check_circle' : 'verified'}
                      </span>
                      {percentage === 100 ? 'Hoàn thành 100% kế hoạch tháng' : `Hoàn tất ${percentage}% số buổi`}
                    </span>
                    <span className="font-semibold text-primary">
                      {remainingSessions === 0 ? 'Sẵn sàng xuất hóa đơn' : `Còn ${remainingSessions} buổi`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage === 100 ? 'bg-secondary' : 'bg-primary'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Specific Notes & Highlights */}
                {student.note && (
                  <div className="p-2.5 rounded-xl bg-tertiary-fixed/40 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-tertiary flex-shrink-0 mt-0.5">sticky_note_2</span>
                    <p className="font-body-sm text-body-sm text-on-tertiary-fixed leading-snug">
                      <strong>Ghi chú:</strong> {student.note}
                    </p>
                  </div>
                )}

                {student.goal && (
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[16px] text-tertiary flex-shrink-0">flag</span>
                    <span className="text-on-surface truncate">Mục tiêu: {student.goal}</span>
                  </div>
                )}

                {/* Footer and Parent Meta */}
                <div className="pt-1 flex items-center justify-between gap-2 border-t border-surface-container/50 text-on-surface-variant font-body-sm text-body-sm">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="material-symbols-outlined text-[16px] text-outline flex-shrink-0">contacts</span>
                    <span className="truncate">PH: <strong className="text-on-surface font-semibold">{student.parentName}</strong> ({student.parentPhone})</span>
                  </div>
                  <button
                    className="text-primary font-label-md text-label-md flex items-center gap-0.5 hover:underline flex-shrink-0 active:scale-95"
                    type="button"
                    onClick={() => onOpenStudentDetail(student)}
                  >
                    Chi tiết
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty State when no results */}
        {filteredStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-surface-container-lowest border border-surface-container-high/50 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-3">
              <span className="material-symbols-outlined text-[32px]">person_search</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Không tìm thấy học sinh</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-xs">
              Vui lòng kiểm tra lại từ khóa hoặc chuyển sang tab bộ lọc khác.
            </p>
            <button
              className="mt-4 px-4 py-2.5 rounded-xl bg-surface-container text-primary font-label-lg text-label-lg hover:bg-surface-container-high transition-colors font-bold"
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </section>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-20 right-4 z-40 max-w-xl mx-auto">
        <button
          aria-label="Thêm học sinh mới"
          className="flex items-center gap-2 h-14 pl-4 pr-5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-xl shadow-primary-container/30 hover:bg-primary active:scale-95 transition-all ring-4 ring-white/50"
          type="button"
          onClick={onOpenCreateClass}
        >
          <span className="material-symbols-outlined text-[24px]">person_add</span>
          <span className="tracking-wide font-bold">Thêm học sinh</span>
        </button>
      </div>
    </div>
  );
};
