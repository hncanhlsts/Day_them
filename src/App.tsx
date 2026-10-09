/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, ScreenType, Invoice, Student } from './types';
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
import { Toast } from './components/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('lich-day');
  const [activeScreen, setActiveScreen] = useState<ScreenType>('main');
  const [selectedInvoiceForQR, setSelectedInvoiceForQR] = useState<Invoice | null>(null);
  const [selectedInvoiceForReminder, setSelectedInvoiceForReminder] = useState<Invoice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
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
    setActiveScreen('attendance-feedback');
  };

  const handleCreateClassSuccess = (newStudent: Partial<Student>) => {
    showToast(`Đã thêm lớp môn ${newStudent.subject} cho học sinh ${newStudent.name} thành công!`);
    setActiveScreen('main');
    setCurrentTab('lop-hoc');
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
            onOpenCreateClass={handleOpenCreateClass}
            onShowToast={showToast}
          />

          <main className="flex-1 flex flex-col relative w-full">
            {currentTab === 'lich-day' && (
              <ScheduleView
                onOpenAttendance={handleOpenAttendance}
                onOpenCreateClass={handleOpenCreateClass}
                onOpenReschedule={handleOpenReschedule}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'lop-hoc' && (
              <ClassesView
                onOpenCreateClass={handleOpenCreateClass}
                onOpenStudentDetail={handleOpenStudentDetail}
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
              <ReportsView onShowToast={showToast} />
            )}
          </main>

          <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />

          {/* VietQR Bill Modal / Drawer */}
          <VietQRModal
            invoice={selectedInvoiceForQR}
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
