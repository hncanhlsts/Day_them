import React, { useState } from 'react';
import { Student } from '../types';

interface EditStudentModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void;
  onDelete: (studentId: string) => void;
  onShowToast: (msg: string) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  student,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onShowToast,
}) => {
  if (!isOpen || !student) return null;

  const [name, setName] = useState(student.name);
  const [subject, setSubject] = useState(student.subject);
  const [gradeBadge, setGradeBadge] = useState(student.gradeBadge);
  const [classType, setClassType] = useState<Student['classType']>(student.classType);
  const [feePerSession, setFeePerSession] = useState(student.feePerSession.toString());
  const [completedSessions, setCompletedSessions] = useState(student.completedSessions.toString());
  const [totalSessions, setTotalSessions] = useState(student.totalSessions.toString());
  const [parentName, setParentName] = useState(student.parentName);
  const [parentPhone, setParentPhone] = useState(student.parentPhone);
  const [goal, setGoal] = useState(student.goal || '');
  const [note, setNote] = useState(student.note || '');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleSave = () => {
    if (!name.trim() || !subject.trim()) {
      onShowToast('Vui lòng điền đủ Tên học sinh và Môn học!');
      return;
    }

    const cleanFee = parseInt(feePerSession.replace(/\D/g, ''), 10) || student.feePerSession;
    const cleanCompleted = parseInt(completedSessions, 10) || 0;
    const cleanTotal = parseInt(totalSessions, 10) || 8;

    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(-2)
      .map((w) => w[0].toUpperCase())
      .join('');

    const updated: Student = {
      ...student,
      name: name.trim(),
      initials: initials || student.initials,
      subject: subject.trim(),
      gradeBadge: gradeBadge.trim() || student.gradeBadge,
      classType,
      categoryKey: classType === 'Nhóm nhỏ' ? 'group' : '1-on-1',
      feePerSession: cleanFee,
      completedSessions: cleanCompleted,
      totalSessions: cleanTotal,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      goal: goal.trim(),
      note: note.trim(),
    };

    onSave(updated);
    onShowToast(`Đã cập nhật thông tin lớp của em ${updated.name} thành công!`);
    onClose();
  };

  const handleExecuteDelete = () => {
    onDelete(student.id);
    onShowToast(`Đã xóa vĩnh viễn lớp học của em ${student.name}!`);
    setShowConfirmDelete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/60 backdrop-blur-sm transition-all duration-300 p-0 sm:p-4">
      <div className="w-full max-w-lg bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom-6 border border-surface-container">
        {/* Header */}
        <div className="w-full p-4 bg-surface-container-lowest border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">edit_note</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                Chỉnh Sửa Lớp &amp; Học Sinh
              </h2>
              <span className="font-label-sm text-label-sm text-primary font-semibold truncate">
                {student.name} • {student.subject}
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

        {/* In-Modal Delete Confirmation Banner */}
        {showConfirmDelete && (
          <div className="p-4 bg-error-container/40 border-b border-error/30 animate-in slide-in-from-top-2">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-error text-[24px] shrink-0 mt-0.5">warning</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
                  Xác nhận xóa lớp học này?
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Bạn có chắc muốn xóa lớp môn <strong>{student.subject}</strong> của em <strong>{student.name}</strong> không? Toàn bộ lịch dạy và thông tin liên quan đến lớp sẽ bị gỡ bỏ.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-colors"
                    onClick={() => setShowConfirmDelete(false)}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-error text-on-error font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all hover:opacity-95"
                    onClick={handleExecuteDelete}
                  >
                    <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                    <span>Xác nhận xóa ngay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Body Form */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Thông tin học sinh & môn học */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container space-y-3">
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Tên học sinh <span className="text-error">*</span>
              </label>
              <input
                type="text"
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-headline-sm text-headline-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  Môn học <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  Khối / Phân loại
                </label>
                <input
                  type="text"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                  value={gradeBadge}
                  onChange={(e) => setGradeBadge(e.target.value)}
                />
              </div>
            </div>

            {/* Hình thức */}
            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Hình thức lớp
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['1-kèm-1', 'Nhóm nhỏ', 'Lớp Online'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`py-2 px-2 rounded-xl text-[12px] font-bold border transition-all ${
                      classType === mode
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                    }`}
                    onClick={() => setClassType(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Học phí & Số buổi */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container space-y-3">
            <h3 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">payments</span>
              Học phí &amp; Tiến độ buổi học
            </h3>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Học phí / Buổi (VNĐ) <span className="text-error">*</span>
              </label>
              <input
                type="text"
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-amount-display text-headline-sm text-primary font-bold outline-none focus:ring-2 focus:ring-primary/20"
                value={feePerSession}
                onChange={(e) => setFeePerSession(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  Số buổi đã học
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-headline-sm text-headline-sm text-on-surface font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  value={completedSessions}
                  onChange={(e) => setCompletedSessions(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  Tổng buổi tháng này
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-headline-sm text-headline-sm text-on-surface font-bold outline-none focus:ring-2 focus:ring-primary/20"
                  value={totalSessions}
                  onChange={(e) => setTotalSessions(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Phụ huynh & Ghi chú */}
          <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container space-y-3">
            <h3 className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">contacts</span>
              Thông tin liên hệ &amp; Mục tiêu
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  Tên phụ huynh
                </label>
                <input
                  type="text"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  SĐT Phụ huynh
                </label>
                <input
                  type="text"
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Mục tiêu học tập
              </label>
              <input
                type="text"
                className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ôn thi vào 10, ĐGNL, thi giữa kỳ..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                Ghi chú riêng
              </label>
              <textarea
                rows={2}
                className="w-full p-2.5 bg-surface-container-low rounded-xl border border-surface-container font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Cần nhắc làm bài tập, tính cách học sinh..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-container-lowest border-t border-surface-container flex items-center justify-between gap-2">
          {!showConfirmDelete ? (
            <button
              type="button"
              className="h-12 px-4 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md font-bold flex items-center gap-1.5 hover:bg-error hover:text-on-error transition-all active:scale-95 shadow-xs"
              onClick={() => setShowConfirmDelete(true)}
              title="Xóa lớp học này"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              <span>Xóa lớp</span>
            </button>
          ) : (
            <button
              type="button"
              className="h-12 px-4 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold"
              onClick={() => setShowConfirmDelete(false)}
            >
              Hủy xóa
            </button>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              className="h-12 px-4 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container-high transition-colors"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              type="button"
              className="h-12 px-5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all hover:bg-primary-container"
              onClick={handleSave}
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
