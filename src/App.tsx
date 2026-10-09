/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, ScreenType, Invoice, Student, ClassSession, TutorProfile } from './types';
import { TUTOR_PROFILE, INITIAL_SESSIONS, INITIAL_STUDENTS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ScheduleView } from './components/ScheduleView';
import { ClassesView } from './components/ClassesView';
import { TuitionView } from './components/TuitionView';
import { ReportsView } from './components/ReportsView';
import { VietQRModal } from './components/VietQRModal';
import { PoliteReminderModal } from './components/PoliteReminderModal';
import { CreateClassView } from './components/CreateClassView';
import { RescheduleView } from './components/RescheduleView';
import { AttendanceView } from './components/AttendanceView';
import { GoogleAppsScriptModal } from './components/GoogleAppsScriptModal';
import { TutorProfileModal } from './components/TutorProfileModal';
import { AddSessionModal } from './components/AddSessionModal';
import { EditStudentModal } from './components/EditStudentModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('lich-day');
  const [activeScreen, setActiveScreen] = useState<ScreenType>('main');

  // Central State with LocalStorage Persistence
  const [tutorProfile, setTutorProfile] = useState<TutorProfile>(() => {
    try {
      const saved = localStorage.getItem('giasu_profile');
      return saved ? JSON.parse(saved) : TUTOR_PROFILE;
    } catch {
      return TUTOR_PROFILE;
    }
  });

  const [sessions, setSessions] = useState<ClassSession[]>(() => {
    try {
      const saved = localStorage.getItem('giasu_sessions');
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('giasu_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // Modal / Drawer States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedInvoiceForQR, setSelectedInvoiceForQR] = useState<Invoice | null>(null);
  const [selectedInvoiceForReminder, setSelectedInvoiceForReminder] = useState<Invoice | null>(null);
  const [showAppsScriptModal, setShowAppsScriptModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Profile save handler
  const handleSaveProfile = (updatedProfile: TutorProfile) => {
    setTutorProfile(updatedProfile);
    try {
      localStorage.setItem('giasu_profile', JSON.stringify(updatedProfile));
    } catch {
      // ignore
    }
  };

  // Add session handler (ca dạy bù hoặc ca dạy mới)
  const handleSaveSession = (newSession: ClassSession) => {
    setSessions((prev) => {
      const updated = [newSession, ...prev];
      try {
        localStorage.setItem('giasu_sessions', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Update existing student/class
  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents((prev) => {
      const updated = prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
      try {
        localStorage.setItem('giasu_students', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Delete student/class
  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== studentId);
      try {
        localStorage.setItem('giasu_students', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Reset to initial mock students if user wants to restore
  const handleResetMockStudents = () => {
    setStudents(INITIAL_STUDENTS);
    try {
      localStorage.setItem('giasu_students', JSON.stringify(INITIAL_STUDENTS));
    } catch {
      // ignore
    }
    showToast('Đã khôi phục danh sách lớp mẫu ban đầu!');
  };

  // Create new class callback
  const handleCreateClassSuccess = (newStudentData: Partial<Student>) => {
    const studentName = newStudentData.name || 'Học sinh mới';
    const initials =
      studentName
        .split(' ')
        .filter(Boolean)
        .slice(-2)
        .map((w) => w[0].toUpperCase())
        .join('') || 'HS';

    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      name: studentName,
      initials,
      subject: newStudentData.subject || 'Toán học',
      gradeBadge: newStudentData.gradeBadge || 'Lớp 10',
      classType: newStudentData.classType || '1-kèm-1',
      categoryKey: newStudentData.categoryKey || '1-on-1',
      feePerSession: newStudentData.feePerSession || 300000,
      completedSessions: 0,
      totalSessions: newStudentData.totalSessions || 8,
      statusBadge: 'Mới tạo',
      statusType: 'neutral',
      parentName: newStudentData.parentName || 'Phụ huynh',
      parentPhone: newStudentData.parentPhone || '0901 234 567',
      goal: newStudentData.goal || '',
      note: newStudentData.note || '',
    };

    setStudents((prev) => {
      const updated = [newStudent, ...prev];
      try {
        localStorage.setItem('giasu_students', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    showToast(`Đã thêm lớp ${newStudent.subject} cho học sinh ${newStudent.name} thành công!`);
    setActiveScreen('main');
    setCurrentTab('lop-hoc');
  };

  const handleOpenAttendance = (studentId: string, sessionId: string) => {
    setActiveScreen('attendance-feedback');
  };

  const handleOpenReschedule = (sessionId?: string) => {
    setActiveScreen('reschedule-session');
  };

  const handleOpenCreateClass = () => {
    setActiveScreen('create-class');
  };

  const handleOpenStudentDetail = (student: Student) => {
    setEditingStudent(student);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-on-surface flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Toast Alert Notification */}
      <Toast
        isVisible={!!toastMessage}
        message={toastMessage || ''}
        onClose={() => setToastMessage(null)}
      />

      {/* RENDER DEDICATED STACK SCREENS */}
      {activeScreen === 'create-class' ? (
        <CreateClassView
          onBack={() => setActiveScreen('main')}
          onShowToast={showToast}
          onSuccess={handleCreateClassSuccess}
        />
      ) : activeScreen === 'reschedule-session' ? (
        <RescheduleView
          onBack={() => setActiveScreen('main')}
          onShowToast={showToast}
        />
      ) : activeScreen === 'attendance-feedback' ? (
        <AttendanceView
          onBack={() => setActiveScreen('main')}
          onShowToast={showToast}
        />
      ) : (
        /* MAIN 4-TAB DASHBOARD SCREEN */
        <>
          <Header
            currentTab={currentTab}
            tutorProfile={tutorProfile}
            onOpenEditProfile={() => setIsProfileModalOpen(true)}
            onOpenAppsScript={() => setShowAppsScriptModal(true)}
            onOpenCreateClass={handleOpenCreateClass}
            onShowToast={showToast}
          />

          <main className="flex-1 flex flex-col relative w-full">
            {currentTab === 'lich-day' && (
              <ScheduleView
                tutorProfile={tutorProfile}
                sessions={sessions}
                onOpenAttendance={handleOpenAttendance}
                onOpenCreateClass={handleOpenCreateClass}
                onOpenReschedule={handleOpenReschedule}
                onOpenAddSession={() => setIsAddSessionModalOpen(true)}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'lop-hoc' && (
              <ClassesView
                students={students}
                onOpenCreateClass={handleOpenCreateClass}
                onOpenStudentDetail={handleOpenStudentDetail}
                onEditStudent={(stu) => setEditingStudent(stu)}
                onDeleteStudent={handleDeleteStudent}
                onResetMockStudents={handleResetMockStudents}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'hoc-phi' && (
              <TuitionView
                onOpenPoliteReminder={(inv) => setSelectedInvoiceForReminder(inv)}
                onOpenVietQR={(inv) => setSelectedInvoiceForQR(inv)}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'bao-cao' && (
              <ReportsView
                onOpenAppsScript={() => setShowAppsScriptModal(true)}
                onShowToast={showToast}
              />
            )}
          </main>

          <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />

          {/* Modal Cài đặt Hồ sơ & QR Ngân hàng (Đổi tên, chọn Bank, đổi STK, tải QR) */}
          <TutorProfileModal
            isOpen={isProfileModalOpen}
            profile={tutorProfile}
            onClose={() => setIsProfileModalOpen(false)}
            onSave={handleSaveProfile}
            onShowToast={showToast}
          />

          {/* Modal Thêm Ca Dạy Bù / Mới */}
          <AddSessionModal
            isOpen={isAddSessionModalOpen}
            students={students}
            onClose={() => setIsAddSessionModalOpen(false)}
            onSave={handleSaveSession}
            onShowToast={showToast}
          />

          {/* Modal Chỉnh Sửa Thông Tin Lớp & Học Sinh */}
          <EditStudentModal
            isOpen={!!editingStudent}
            student={editingStudent}
            onClose={() => setEditingStudent(null)}
            onSave={handleSaveStudent}
            onDelete={handleDeleteStudent}
            onShowToast={showToast}
          />

          {/* Google Apps Script & Sheets Modal */}
          <GoogleAppsScriptModal
            isOpen={showAppsScriptModal}
            onClose={() => setShowAppsScriptModal(false)}
            onShowToast={showToast}
          />

          {/* VietQR Bill Modal / Drawer */}
          <VietQRModal
            invoice={selectedInvoiceForQR}
            tutorProfile={tutorProfile}
            onClose={() => setSelectedInvoiceForQR(null)}
            onShowToast={showToast}
          />

          {/* Polite Reminder Message Drawer */}
          <PoliteReminderModal
            invoice={selectedInvoiceForReminder}
            onClose={() => setSelectedInvoiceForReminder(null)}
            onShowToast={showToast}
          />
        </>
      )}
    </div>
  );
}
