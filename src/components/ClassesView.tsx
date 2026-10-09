import React, { useState } from 'react';
import { Student } from '../types';

interface ClassesViewProps {
  students: Student[];
  onOpenStudentDetail: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
  onResetMockStudents?: () => void;
  onOpenCreateClass: () => void;
  onShowToast: (msg: string) => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  students,
  onOpenStudentDetail,
  onEditStudent,
  onDeleteStudent,
  onResetMockStudents,
  onOpenCreateClass,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | '1-on-1' | 'group' | 'urgent'>('all');
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

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
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
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

          {/* Quick Add Student Button in Header */}
          <button
            type="button"
            className="h-12 px-3.5 rounded-2xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm active:scale-95 transition-all hover:bg-primary-container"
            onClick={onOpenCreateClass}
            title="Thêm học sinh mới"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="hidden sm:inline">Thêm lớp</span>
          </button>
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
            Tất cả ({students.length})
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
            1-kèm-1
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
            Nhóm nhỏ
          </button>
          <button
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all ${
              activeFilter === 'urgent'
                ? 'bg-error-container text-on-error-container shadow-sm font-bold'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container-high/50'
            }`}
            type="button"
            onClick={() => setActiveFilter('urgent')}
          >
            Cần lưu ý
          </button>
        </div>
      </section>

      {/* Overview Metrics Banner */}
      {students.length > 0 && (
        <section className="bg-gradient-to-br from-primary-container to-primary text-on-primary rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between pb-3 border-b border-white/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <span className="font-label-md text-label-md font-semibold tracking-wide">
                Kỳ giảng dạy: Tháng 10/2024
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-label-sm text-label-sm font-bold backdrop-blur-xs">
              {students.length} Lớp đang phụ trách
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm opacity-80">Tổng học sinh</span>
              <span className="font-headline-sm text-headline-sm font-extrabold mt-0.5">
                {students.length} em
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm opacity-80">Buổi hoàn thành</span>
              <span className="font-headline-sm text-headline-sm font-extrabold mt-0.5">
                {students.reduce((acc, cur) => acc + cur.completedSessions, 0)} buổi
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm opacity-80">Tiến độ chung</span>
              <span className="font-headline-sm text-headline-sm font-extrabold mt-0.5 text-secondary-container">
                {Math.round(
                  (students.reduce((acc, cur) => acc + cur.completedSessions, 0) /
                    Math.max(1, students.reduce((acc, cur) => acc + cur.totalSessions, 0))) *
                    100
                )}
                %
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Student List Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">school</span>
            Danh sách lớp học ({filteredStudents.length})
          </h2>
          {students.length > 0 && onResetMockStudents && (
            <button
              type="button"
              className="text-outline hover:text-primary text-xs font-semibold hover:underline flex items-center gap-0.5"
              onClick={onResetMockStudents}
              title="Đặt lại danh sách lớp mẫu ban đầu"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Đặt lại mẫu
            </button>
          )}
        </div>

        {/* Student Cards Grid */}
        <div className="flex flex-col gap-3">
          {filteredStudents.map((student) => {
            const percentage = Math.round((student.completedSessions / student.totalSessions) * 100);

            return (
              <article
                key={student.id}
                className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/60 flex flex-col gap-3 transition-all hover:border-primary/40 group relative"
              >
                {/* Card Header: Avatar, Name, Badges & Action Buttons */}
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                    onClick={() => onEditStudent(student)}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-[16px] shrink-0 relative shadow-sm">
                      {student.initials}
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
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

                  {/* Actions: Edit, Delete & Call */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Nút sửa thông tin */}
                    <button
                      aria-label="Chỉnh sửa thông tin lớp"
                      className="w-9 h-9 rounded-full bg-surface-container text-primary flex items-center justify-center hover:bg-surface-container-high transition-colors shadow-xs active:scale-95"
                      type="button"
                      onClick={() => onEditStudent(student)}
                      title="Chỉnh sửa thông tin lớp học"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>

                    {/* Nút xóa lớp trực tiếp */}
                    {onDeleteStudent && (
                      <button
                        aria-label="Xóa lớp học"
                        className="w-9 h-9 rounded-full bg-surface-container text-error flex items-center justify-center hover:bg-error-container hover:text-on-error-container transition-colors shadow-xs active:scale-95"
                        type="button"
                        onClick={() => setStudentToDelete(student)}
                        title="Xóa lớp học này"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}

                    {/* Nút gọi phụ huynh */}
                    <a
                      aria-label={`Gọi phụ huynh ${student.parentName}`}
                      className="w-9 h-9 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center hover:bg-secondary-container transition-colors shadow-xs active:scale-95"
                      href={`tel:${student.parentPhone.replace(/[^0-9]/g, '')}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowToast(`Đang gọi phụ huynh: ${student.parentName} (${student.parentPhone})`);
                      }}
                      title="Gọi điện phụ huynh"
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        call
                      </span>
                    </a>
                  </div>
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
                      <span
                        className={`font-headline-sm text-headline-sm font-bold ${
                          percentage === 100 ? 'text-secondary' : 'text-primary'
                        }`}
                      >
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
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          percentage === 100 ? 'text-secondary' : 'text-primary'
                        }`}
                      >
                        {percentage === 100 ? 'check_circle' : 'verified'}
                      </span>
                      {percentage === 100 ? 'Hoàn thành 100% kế hoạch tháng' : `Hoàn tất ${percentage}% số buổi`}
                    </span>
                    <span className="font-semibold text-primary">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage === 100 ? 'bg-secondary' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    />
                  </div>
                </div>

                {/* Card Footer Info: Contact & Action Links */}
                <div className="flex items-center justify-between pt-2 border-t border-surface-container text-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-1 truncate text-xs">
                    <span className="material-symbols-outlined text-[15px] text-outline">person</span>
                    <span>PH: {student.parentName}</span>
                    <span className="text-outline">•</span>
                    <span className="font-mono">{student.parentPhone}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      className="text-primary font-label-md text-label-md flex items-center gap-0.5 hover:underline font-bold text-xs"
                      type="button"
                      onClick={() => onEditStudent(student)}
                    >
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                      Sửa
                    </button>
                    <button
                      className="text-primary font-label-md text-label-md flex items-center gap-0.5 hover:underline font-bold text-xs"
                      type="button"
                      onClick={() => onOpenStudentDetail(student)}
                    >
                      Chi tiết
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty State when no results */}
        {filteredStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-surface-container-lowest border border-surface-container-high/50 shadow-sm space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-1">
              <span className="material-symbols-outlined text-[32px]">school</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {students.length === 0 ? 'Chưa có lớp học nào' : 'Không tìm thấy lớp phù hợp'}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs text-xs">
              {students.length === 0
                ? 'Bạn đã xóa hết các lớp cũ. Hãy thêm lớp mới để bắt đầu quản lý lịch dạy và học phí!'
                : 'Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc chuyển sang bộ lọc khác.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-all font-bold shadow-md active:scale-95 flex items-center gap-1.5"
                type="button"
                onClick={onOpenCreateClass}
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Thêm lớp mới ngay</span>
              </button>

              {students.length === 0 && onResetMockStudents && (
                <button
                  className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors font-bold text-xs"
                  type="button"
                  onClick={onResetMockStudents}
                >
                  Khôi phục lớp mẫu
                </button>
              )}

              {students.length > 0 && (
                <button
                  className="px-4 py-2.5 rounded-xl bg-surface-container text-primary font-label-lg text-label-lg hover:bg-surface-container-high transition-colors font-bold text-xs"
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                >
                  Đặt lại bộ lọc
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          aria-label="Thêm học sinh mới"
          className="flex items-center gap-2 h-14 pl-4 pr-5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-2xl shadow-primary-container/40 hover:bg-primary active:scale-95 transition-all ring-4 ring-white/70"
          type="button"
          onClick={onOpenCreateClass}
        >
          <span className="material-symbols-outlined text-[24px]">person_add</span>
          <span className="tracking-wide font-bold">Thêm học sinh</span>
        </button>
      </div>

      {/* IN-VIEW DELETE CONFIRMATION DIALOG (No window.confirm!) */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-surface p-5 rounded-3xl shadow-2xl border border-surface-container space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[30px]">delete_forever</span>
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Xóa lớp {studentToDelete.subject}?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Bạn có chắc chắn muốn xóa lớp của em <strong>{studentToDelete.name}</strong> không? Sau khi xóa, bạn có thể tự tạo lại lớp mới bất cứ lúc nào.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-colors"
                onClick={() => setStudentToDelete(null)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="flex-1 h-12 rounded-xl bg-error text-on-error font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all hover:opacity-90"
                onClick={() => {
                  if (onDeleteStudent) onDeleteStudent(studentToDelete.id);
                  onShowToast(`Đã xóa vĩnh viễn lớp của em ${studentToDelete.name}!`);
                  setStudentToDelete(null);
                }}
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>Xóa ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
