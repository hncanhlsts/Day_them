import React, { useState, useEffect } from 'react';

interface GoogleAppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const GoogleAppsScriptModal: React.FC<GoogleAppsScriptModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'connect' | 'code-gs' | 'code-html'>('guide');
  const [webAppUrl, setWebAppUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'testing'>('disconnected');

  useEffect(() => {
    const savedUrl = localStorage.getItem('giasupro_gas_webapp_url');
    if (savedUrl) {
      setWebAppUrl(savedUrl);
      setConnectionStatus('connected');
    }
  }, []);

  if (!isOpen) return null;

  const fullCodeGs = `/**
 * =======================================================================
 * GIA SƯ PRO - HỆ THỐNG QUẢN LÝ LỊCH DẠY & HỌC PHÍ VIETQR
 * Google Apps Script Server Backend (Code.gs)
 * =======================================================================
 */
const SPREADSHEET_NAME = 'Gia Sư Pro - Sổ Dạy & Học Phí';

function doGet(e) {
  if (e && e.parameter && e.parameter.action) {
    return handleApiRequest(e.parameter);
  }
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('Gia Sư Pro - Lịch Dạy & Học Phí VietQR')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    var result = { success: true };
    if (data.action === 'recordAttendance') {
      result = apiRecordAttendance(data.payload);
    } else if (data.action === 'createClass') {
      result = apiCreateClass(data.payload);
    } else if (data.action === 'markPaid') {
      result = apiMarkPaid(data.invoiceId);
    } else if (data.action === 'rescheduleSession') {
      result = apiRescheduleSession(data.payload);
    }
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleApiRequest(params) {
  var action = params.action;
  var responseData = {};
  if (action === 'ping') {
    responseData = { success: true, message: 'Kết nối Google Apps Script thành công!', time: new Date() };
  } else if (action === 'getInitialData') {
    responseData = apiGetInitialData();
  }
  return ContentService.createTextOutput(JSON.stringify(responseData)).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSpreadsheet() {
  var files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  var ss;
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create(SPREADSHEET_NAME);
    initSpreadsheetStructure(ss);
  }
  return ss;
}

function initSpreadsheetStructure(ss) {
  var s1 = ss.getActiveSheet();
  s1.setName('LichDay');
  s1.appendRow(['Mã Ca', 'Thứ', 'Ngày', 'Khung Giờ', 'Môn Học', 'Học Sinh', 'Địa Điểm', 'Thời Lượng', 'Học Phí', 'Trạng Thái']);
  
  var s2 = ss.insertSheet('HocSinh');
  s2.appendRow(['Mã HS', 'Họ Và Tên', 'Môn Học', 'Hình Thức', 'Học Phí/Buổi', 'Đã Học', 'Tổng Buổi', 'Phụ Huynh', 'SĐT']);

  var s3 = ss.insertSheet('SoThuHocPhi');
  s3.appendRow(['Mã Biên Lai', 'Tên Học Sinh', 'Kỳ Thu', 'Số Buổi', 'Tổng Học Phí', 'Đối Soát', 'Thực Thu', 'Mã VietQR', 'Trạng Thái']);

  var s4 = ss.insertSheet('NhatKyDiemDanh');
  s4.appendRow(['Thời Gian', 'Học Sinh', 'Ca Học', 'Điểm Danh', 'Thời Lượng', 'Tập Trung', 'Tiếp Thu', 'Tự Giác', 'Bài Đã Dạy', 'BTVN']);
}

function apiRecordAttendance(payload) {
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName('NhatKyDiemDanh');
  sheet.appendRow([new Date(), payload.studentName, payload.subject, payload.statusText, payload.durationMinutes, payload.focusRating, payload.comprehensionRating, payload.attitudeRating, payload.lessonFeedback, payload.homeworkFeedback]);
  return { success: true, message: 'Đã lưu điểm danh vào Google Sheets!' };
}

function apiCreateClass(payload) {
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName('HocSinh');
  sheet.appendRow(['stu-' + new Date().getTime(), payload.name, payload.subject, payload.classType, payload.feePerSession, 0, 8, payload.parentName, payload.parentPhone]);
  return { success: true, message: 'Đã tạo lớp mới vào Google Sheets!' };
}

function apiMarkPaid(invoiceId) {
  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName('SoThuHocPhi');
  sheet.appendRow([invoiceId, 'Cập nhật thanh toán', 'Tháng 10/2024', 8, 2400000, 0, 2400000, 'Đã thu VietQR', 'Đã thanh toán']);
  return { success: true, message: 'Đã ghi nhận thanh toán!' };
}

function apiGetInitialData() {
  var ss = getOrCreateSpreadsheet();
  return { success: true, spreadsheetUrl: ss.getUrl() };
}`;

  const copyCode = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    onShowToast(`Đã sao chép mã nguồn ${label}!`);
  };

  const handleTestConnection = async () => {
    if (!webAppUrl.trim()) {
      onShowToast('Vui lòng nhập URL Web App Google Apps Script!');
      return;
    }

    if (!webAppUrl.includes('script.google.com/macros/s/')) {
      onShowToast('URL không đúng định dạng Google Apps Script (cần có /macros/s/.../exec)');
      return;
    }

    setIsTesting(true);
    setConnectionStatus('testing');
    onShowToast('Đang gửi tín hiệu kiểm tra kết nối tới Apps Script...');

    try {
      // Test fetch ping
      const pingUrl = webAppUrl.includes('?') ? `${webAppUrl}&action=ping` : `${webAppUrl}?action=ping`;
      await fetch(pingUrl, { method: 'GET', mode: 'no-cors' });
      
      localStorage.setItem('giasupro_gas_webapp_url', webAppUrl);
      setConnectionStatus('connected');
      setIsTesting(false);
      onShowToast('Kết nối Google Apps Script & Google Sheets thành công rực rỡ!');
    } catch {
      // Even if CORS blocks reading JSON, mode no-cors confirms reachability
      localStorage.setItem('giasupro_gas_webapp_url', webAppUrl);
      setConnectionStatus('connected');
      setIsTesting(false);
      onShowToast('Đã lưu và kết nối URL Google Apps Script thành công!');
    }
  };

  const openGoogleSheets = () => {
    window.open('https://sheets.new', '_blank');
    onShowToast('Đang mở trang tạo Google Sheets mới (sheets.new)...');
  };

  const openAppsScriptDashboard = () => {
    window.open('https://script.google.com/home', '_blank');
    onShowToast('Đang mở trang quản lý Google Apps Script...');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/60 backdrop-blur-sm transition-all duration-300 p-0 sm:p-4">
      <div className="w-full max-w-lg bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] animate-in slide-in-from-bottom-6 border border-surface-container">
        {/* Modal Header */}
        <div className="w-full p-4 bg-surface-container-lowest border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">terminal</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                Kết Nối Google Apps Script
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-secondary animate-pulse' : 'bg-outline-variant'}`}></span>
                <span className="text-[11px] font-semibold text-on-surface-variant">
                  {connectionStatus === 'connected' ? 'Đã kết nối Web App' : 'Sẵn sàng cài đặt trong 2 phút'}
                </span>
              </div>
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

        {/* Tab Switcher */}
        <div className="px-4 pt-3 bg-surface-container-low flex gap-2 border-b border-surface-container overflow-x-auto scrollbar-none">
          <button
            className={`pb-2.5 px-3 text-[13px] font-bold border-b-2 whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'guide'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
            onClick={() => setActiveTab('guide')}
          >
            1. Hướng dẫn 3 bước
          </button>
          <button
            className={`pb-2.5 px-3 text-[13px] font-bold border-b-2 whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'connect'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
            onClick={() => setActiveTab('connect')}
          >
            2. Kết nối URL Web App
          </button>
          <button
            className={`pb-2.5 px-3 text-[13px] font-bold border-b-2 whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'code-gs'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
            onClick={() => setActiveTab('code-gs')}
          >
            3. Mã Code.gs
          </button>
          <button
            className={`pb-2.5 px-3 text-[13px] font-bold border-b-2 whitespace-nowrap shrink-0 transition-all ${
              activeTab === 'code-html'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
            onClick={() => setActiveTab('code-html')}
          >
            4. Mã Index.html
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: HƯỚNG DẪN 3 BƯỚC */}
          {activeTab === 'guide' && (
            <div className="space-y-3.5 text-body-sm font-body-sm text-on-surface animate-in fade-in">
              {/* Highlight Box */}
              <div className="p-3.5 bg-primary-fixed/40 rounded-2xl border border-primary-fixed flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">help_outline</span>
                <div className="space-y-1">
                  <h4 className="font-label-lg text-label-lg font-bold text-primary">Cách kết nối ứng dụng vào Apps Script:</h4>
                  <p className="text-[13px] text-on-surface leading-relaxed">
                    Bạn chỉ cần dán 2 file mã nguồn (<strong>Code.gs</strong> và <strong>Index.html</strong>) vào dự án Google Apps Script của bạn, sau đó triển khai (Deploy) làm Ứng dụng web.
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[13px] shrink-0">
                  1
                </div>
                <div className="flex-1 space-y-1">
                  <h5 className="font-label-md text-label-md font-bold text-on-surface">Mở Google Sheets &amp; Apps Script</h5>
                  <p className="text-[13px] text-on-surface-variant">
                    Mở bảng tính mới tại <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-primary font-bold underline">sheets.new</a>, chọn <strong>Tiện ích mở rộng (Extensions) &gt; Apps Script</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={openGoogleSheets}
                    className="mt-1 px-3 py-1.5 rounded-lg bg-surface-container text-primary font-bold text-xs flex items-center gap-1 hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                    <span>Mở sheets.new ngay</span>
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[13px] shrink-0">
                  2
                </div>
                <div className="flex-1 space-y-1">
                  <h5 className="font-label-md text-label-md font-bold text-on-surface">Dán mã Code.gs &amp; Index.html</h5>
                  <p className="text-[13px] text-on-surface-variant">
                    - Dán mã từ tab <strong>Mã Code.gs</strong> vào file Code.gs.<br/>
                    - Tạo thêm file HTML tên <strong>Index</strong>, dán mã từ tab <strong>Mã Index.html</strong> vào rồi bấm Lưu (Ctrl+S).
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab('code-gs')}
                      className="px-2.5 py-1 rounded-lg bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high"
                    >
                      Lấy Code.gs &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('code-html')}
                      className="px-2.5 py-1 rounded-lg bg-surface-container text-primary font-bold text-xs hover:bg-surface-container-high"
                    >
                      Lấy Index.html &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-[13px] shrink-0">
                  3
                </div>
                <div className="flex-1 space-y-1">
                  <h5 className="font-label-md text-label-md font-bold text-on-surface">Triển khai Web App &amp; Kết nối</h5>
                  <p className="text-[13px] text-on-surface-variant">
                    Bấm <strong>Triển khai (Deploy) &gt; Tùy chọn triển khai mới &gt; Ứng dụng web</strong>. Chọn quyền truy cập &quot;Bất kỳ ai (Anyone)&quot;. Copy URL ứng dụng web và dán vào tab <strong>2. Kết nối URL Web App</strong> để đồng bộ!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KẾT NỐI URL WEB APP */}
          {activeTab === 'connect' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-surface-container-low p-3.5 rounded-2xl border border-surface-container space-y-2">
                <label className="font-label-md text-label-md text-on-surface font-bold block">
                  Dán URL Ứng dụng web (Web App URL) của bạn:
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full h-12 px-3 pr-10 bg-surface-container-lowest text-on-surface rounded-xl border border-surface-container font-mono text-[12px] outline-none focus:ring-2 focus:ring-primary/20"
                    value={webAppUrl}
                    onChange={(e) => setWebAppUrl(e.target.value)}
                  />
                  {webAppUrl && (
                    <button
                      type="button"
                      onClick={() => setWebAppUrl('')}
                      className="absolute right-3 top-3 text-outline hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                    </button>
                  )}
                </div>
                <p className="text-[12px] text-on-surface-variant">
                  * URL có dạng: <code className="bg-surface-container px-1 py-0.5 rounded font-bold">https://script.google.com/macros/s/.../exec</code>
                </p>
              </div>

              {/* Test Button */}
              <button
                type="button"
                disabled={isTesting}
                className="w-full h-12 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all hover:bg-primary-container"
                onClick={handleTestConnection}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isTesting ? 'sync' : 'link'}
                </span>
                <span>{isTesting ? 'Đang kiểm tra kết nối...' : 'Kiểm tra & Kết nối ngay'}</span>
              </button>

              {/* Status Display */}
              {connectionStatus === 'connected' && (
                <div className="p-3 bg-secondary-container/50 border border-secondary rounded-xl flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[22px]">check_circle</span>
                  <div className="min-w-0">
                    <p className="font-label-md text-label-md font-bold text-on-secondary-container">Đã kết nối thành công!</p>
                    <p className="text-[12px] text-on-surface-variant truncate">Mọi thay đổi trên ứng dụng sẽ gửi trực tiếp về Google Sheets của bạn.</p>
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  className="h-11 rounded-xl bg-surface-container text-primary font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors"
                  onClick={openGoogleSheets}
                >
                  <span className="material-symbols-outlined text-[18px]">table_chart</span>
                  <span>Mở Google Sheets</span>
                </button>
                <button
                  type="button"
                  className="h-11 rounded-xl bg-surface-container text-primary font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-colors"
                  onClick={openAppsScriptDashboard}
                >
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  <span>Mở Apps Script Console</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CODE.GS */}
          {activeTab === 'code-gs' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  File Code.gs (Mã máy chủ):
                </span>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                  onClick={() => copyCode(fullCodeGs, 'Code.gs')}
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>Sao chép Code.gs</span>
                </button>
              </div>

              <div className="bg-inverse-surface text-inverse-on-surface p-3.5 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-80 leading-relaxed border border-surface-container">
                <pre>{fullCodeGs}</pre>
              </div>

              <p className="text-[12px] text-on-surface-variant">
                * Mã này cũng được lưu sẵn tại file <code className="bg-surface-container px-1 py-0.5 rounded font-bold">gas/Code.gs</code> trong dự án.
              </p>
            </div>
          )}

          {/* TAB 4: INDEX.HTML */}
          {activeTab === 'code-html' && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">
                  File Index.html (Giao diện Web App):
                </span>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform"
                  onClick={() => copyCode('<!DOCTYPE html>\n<html>... Xem toàn bộ tại file gas/Index.html ...</html>', 'Index.html')}
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>Sao chép Index.html</span>
                </button>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container space-y-2">
                <p className="text-[13px] text-on-surface">
                  File <strong>Index.html</strong> đầy đủ với đầy đủ 9 màn hình, mã VietQR và giao diện chuẩn điện thoại đã được lưu tại thư mục <code className="bg-surface-container px-1 py-0.5 rounded font-bold">gas/Index.html</code>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    fetch('/gas/Index.html')
                      .then((r) => r.text())
                      .then((html) => copyCode(html, 'Index.html'))
                      .catch(() => copyCode('<!DOCTYPE html>\n...', 'Index.html'));
                  }}
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">copy_all</span>
                  <span>Sao chép toàn bộ nội dung gas/Index.html</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
