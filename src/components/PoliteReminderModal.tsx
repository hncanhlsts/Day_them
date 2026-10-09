import React from 'react';
import { Invoice } from '../types';

interface PoliteReminderModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const PoliteReminderModal: React.FC<PoliteReminderModalProps> = ({
  invoice,
  onClose,
  onShowToast,
}) => {
  if (!invoice) return null;

  const reminderText = `Dạ em chào ${invoice.parentName}, em gửi gia đình bảng theo dõi số buổi học tháng 10 của em ${invoice.studentName} ạ. Tháng này em làm bài tập rất đầy đủ, thái độ học tập rất tốt và tiến bộ rõ rệt! Em xin gửi kèm phiếu học phí tháng (${invoice.totalAmount.toLocaleString('vi-VN')} đ) qua mã VietQR chuyển khoản nhanh này nhé: gia-su.pro/pay/${invoice.studentName.toLowerCase().replace(/\s+/g, '')}. Em cảm ơn gia đình nhiều ạ!`;

  const copyText = () => {
    navigator.clipboard?.writeText(reminderText);
    onShowToast('Đã sao chép mẫu lời nhắn gửi phụ huynh!');
  };

  const sendZalo = () => {
    navigator.clipboard?.writeText(reminderText);
    onShowToast(`Đang kết nối Zalo tới ${invoice.parentName}...`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-inverse-surface/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom-8">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">chat_bubble_outline</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Mẫu tin nhắn nhắc lịch sự
            </h3>
          </div>
          <button
            aria-label="Đóng"
            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
            type="button"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="bg-surface-container-low p-3.5 rounded-2xl space-y-2 border border-surface-container">
          <span className="font-label-sm text-label-sm text-primary font-bold block uppercase tracking-wider">
            Lời nhắn gửi phụ huynh (Đã cá nhân hóa):
          </span>
          <p className="font-body-md text-body-md text-on-surface leading-relaxed">
            {reminderText}
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            className="flex-1 h-12 bg-surface-container hover:bg-surface-container-high text-primary rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            type="button"
            onClick={copyText}
          >
            <span className="material-symbols-outlined text-[20px]">content_copy</span>
            <span>Sao chép tin nhắn</span>
          </button>
          <button
            className="flex-1 h-12 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            type="button"
            onClick={sendZalo}
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
            <span>Mở Zalo gửi ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
