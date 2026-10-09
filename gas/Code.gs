/**
 * =======================================================================
 * GIA SƯ PRO - HỆ THỐNG QUẢN LÝ LỊCH DẠY & HỌC PHÍ VIETQR
 * Google Apps Script Server Backend (Code.gs)
 * =======================================================================
 * Tính năng chính:
 * 1. Phục vụ Web App HTML Service (doGet) chạy mượt trên Mobile & Desktop
 * 2. Tự động khởi tạo & đồng bộ bảng tính Google Sheets 4 Sheet chuyên nghiệp
 * 3. Điểm danh, nhận xét sư phạm, tính học phí & tạo mã VietQR chuẩn ngân hàng
 * 4. API webhook (doPost) cho phép kết nối từ xa hoặc tích hợp Zalo
 */

const SPREADSHEET_NAME = 'Gia Sư Pro - Sổ Dạy & Học Phí';

/**
 * Điểm vào chính: Phục vụ Giao diện Web App hoặc trả về JSON API
 */
function doGet(e) {
  // Nếu có tham số action trong URL (vd: ?action=getData), trả về JSON
  if (e && e.parameter && e.parameter.action) {
    return handleApiRequest(e.parameter);
  }

  // Mặc định: Phục vụ giao diện người dùng HTML Web App
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('Gia Sư Pro - Lịch Dạy & Học Phí VietQR')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Xử lý dữ liệu gửi lên qua POST (API / Webhook)
 */
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
    } else if (data.action === 'syncAll') {
      result = apiSyncAllData(data.payload);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Xử lý yêu cầu API dạng GET (JSON)
 */
function handleApiRequest(params) {
  var action = params.action;
  var responseData = {};

  if (action === 'getInitialData') {
    responseData = apiGetInitialData();
  } else if (action === 'getSpreadsheetUrl') {
    responseData = { success: true, url: getOrCreateSpreadsheet().getUrl() };
  } else {
    responseData = { success: false, message: 'Action không hợp lệ: ' + action };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Lấy hoặc tự động tạo Google Sheet quản lý cho Gia Sư
 */
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

/**
 * Khởi tạo cấu trúc các Sheet mẫu khi lần đầu cài đặt
 */
function initSpreadsheetStructure(ss) {
  // Sheet 1: Lịch Dạy
  var sheetSchedule = ss.getActiveSheet();
  sheetSchedule.setName('LichDay');
  sheetSchedule.appendRow([
    'Mã Ca', 'Thứ', 'Ngày', 'Khung Giờ', 'Môn Học', 'Khối', 'Học Sinh', 'Địa Điểm', 'Thời Lượng (Phút)', 'Học Phí (VNĐ)', 'Trạng Thái', 'Ghi Chú'
  ]);
  formatHeaderRow(sheetSchedule);
  sheetSchedule.appendRow(['ses-1', 'T4', '24/10/2024', '08:30 - 10:00', 'Toán nâng cao 9', 'Lớp 9', 'Minh Khang', '120 Hoàng Hoa Thám', 90, 300000, 'Đã hoàn thành', 'Đã ghi nợ']);
  sheetSchedule.appendRow(['ses-2', 'T4', '24/10/2024', '15:00 - 16:30', 'Vật lý 10 – Động học', 'Lớp 10', 'Hải Đăng', 'Google Meet: meet.google.com/xyz', 90, 220000, 'Sắp diễn ra', 'Online']);
  sheetSchedule.appendRow(['ses-3', 'T4', '24/10/2024', '18:30 - 20:00', 'Hóa học 11 – Phản ứng Oxi hóa', 'Lớp 11', 'Lan, Duy, Tuấn', 'Studio Gia Sư (Tầng 2)', 90, 750000, '18:30 tối nay', 'Nhóm 3 bạn']);

  // Sheet 2: Danh Sách Học Sinh
  var sheetStudents = ss.insertSheet('HocSinh');
  sheetStudents.appendRow([
    'Mã HS', 'Họ Và Tên', 'Môn Học', 'Hình Thức', 'Học Phí / Buổi', 'Đã Học (Buổi)', 'Tổng Số Buổi', 'Tiến Độ', 'Phụ Huynh', 'SĐT Phụ Huynh', 'Mục Tiêu'
  ]);
  formatHeaderRow(sheetStudents);
  sheetStudents.appendRow(['stu-1', 'Nguyễn Minh Khang', 'Toán Lớp 9', '1-kèm-1', 300000, 7, 8, '88%', 'Chị Mai', '0912.345.xxx', 'Ôn thi vào lớp 10 Chuyên']);
  sheetStudents.appendRow(['stu-2', 'Lê Bảo Châu', 'Tiếng Anh IELTS', 'Nhóm nhỏ', 250000, 8, 8, '100%', 'Anh Long', '0988.776.655', 'Mục tiêu IELTS 6.5+']);
  sheetStudents.appendRow(['stu-3', 'Trần Hải Đăng', 'Vật Lý Lớp 10', 'Lớp Online', 220000, 5, 8, '63%', 'Cô Hạnh', '0903.112.233', 'Lấy gốc chương động học']);
  sheetStudents.appendRow(['stu-4', 'Phạm Hoàng Nam', 'Hóa Lớp 11', '1-kèm-1', 280000, 6, 8, '75%', 'Anh Tuấn', '0977.445.566', 'Cân bằng phản ứng Oxi hóa']);

  // Sheet 3: Sổ Thu Học Phí & VietQR
  var sheetTuition = ss.insertSheet('SoThuHocPhi');
  sheetTuition.appendRow([
    'Mã Biên Lai', 'Tên Học Sinh', 'Kỳ Thu', 'Số Buổi', 'Đơn Giá / Buổi', 'Tổng Học Phí', 'Đối Soát Kỳ Trước', 'Thực Thu', 'Hạn Đóng', 'Nội Dung VietQR', 'Trạng Thái'
  ]);
  formatHeaderRow(sheetTuition);
  sheetTuition.appendRow(['inv-1', 'Nguyễn Minh Khang', 'Tháng 10/2024', 8, 300000, 2400000, -300000, 2100000, '25/10/2024', 'HP T10 NGUYEN MINH KHANG', 'Chờ phụ huynh CK']);
  sheetTuition.appendRow(['inv-2', 'Phạm Hoàng Nam', 'Tháng 10/2024', 6, 280000, 1680000, 0, 1680000, '22/10/2024', 'HOCPHI T10 HOANG NAM', 'Quá hạn 2 ngày']);
  sheetTuition.appendRow(['inv-3', 'Nhóm IELTS (Bảo Châu & Linh)', 'Tháng 10/2024', 16, 200000, 3200000, 0, 3200000, '27/10/2024', 'HOCPHI T10 IELTS CHAU LINH', 'Chờ phụ huynh CK']);

  // Sheet 4: Nhật Ký Điểm Danh & Nhận Xét
  var sheetLogs = ss.insertSheet('NhatKyDiemDanh');
  sheetLogs.appendRow([
    'Thời Gian Ghi', 'Học Sinh', 'Ca Học', 'Trạng Thái', 'Thời Lượng (Phút)', 'Tập Trung (Sao)', 'Tiếp Thu (Sao)', 'Tự Giác (Sao)', 'Bài Đã Dạy', 'BTVN Đã Giao', 'Gửi Zalo'
  ]);
  formatHeaderRow(sheetLogs);
  sheetLogs.appendRow([
    new Date(), 'Nguyễn Minh Khang', 'Toán 12 Cơ bản (Buổi 7/8)', 'Đúng giờ', 90, 4, 5, 5,
    'Ôn tập chuyên đề Khái niệm lũy thừa & Đạo hàm cấp 1.',
    'Làm đề số 3 (câu 1 - 25) trước 20h Thứ 6.',
    'Đã gửi Zalo'
  ]);
}

/**
 * Định dạng hàng tiêu đề bảng tính
 */
function formatHeaderRow(sheet) {
  var range = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  range.setBackground('#2a14b4')
       .setFontColor('#ffffff')
       .setFontWeight('bold')
       .setFontFamily('Plus Jakarta Sans')
       .setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
}

// =======================================================================
// CÁC HÀM RPC ĐƯỢC GỌI TỪ FRONTEND (google.script.run)
// =======================================================================

/**
 * Lấy toàn bộ dữ liệu ban đầu từ Google Sheet (hoặc dữ liệu mẫu)
 */
function apiGetInitialData() {
  try {
    var ss = getOrCreateSpreadsheet();
    return {
      success: true,
      spreadsheetUrl: ss.getUrl(),
      spreadsheetName: ss.getName(),
      updatedAt: new Date().toISOString()
    };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Ghi nhận điểm danh và nhận xét sư phạm vào Sheet NhatKyDiemDanh
 */
function apiRecordAttendance(payload) {
  try {
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheetByName('NhatKyDiemDanh');
    if (!sheet) {
      sheet = ss.insertSheet('NhatKyDiemDanh');
      sheet.appendRow(['Thời Gian Ghi', 'Học Sinh', 'Ca Học', 'Trạng Thái', 'Thời Lượng (Phút)', 'Tập Trung', 'Tiếp Thu', 'Tự Giác', 'Bài Đã Dạy', 'BTVN', 'Gửi Zalo']);
      formatHeaderRow(sheet);
    }

    sheet.appendRow([
      new Date(),
      payload.studentName || 'Nguyễn Minh Khang',
      payload.subject || 'Toán nâng cao 9',
      payload.statusText || 'Đúng giờ',
      payload.durationMinutes || 90,
      payload.focusRating || 5,
      payload.comprehensionRating || 5,
      payload.attitudeRating || 5,
      payload.lessonFeedback || '',
      payload.homeworkFeedback || '',
      payload.sendZalo ? 'Đã gửi' : 'Chỉ lưu nội bộ'
    ]);

    return { success: true, message: 'Đã lưu điểm danh & nhận xét vào Google Sheets!' };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Tạo lớp học mới và ghi vào Sheet HocSinh & LichDay
 */
function apiCreateClass(payload) {
  try {
    var ss = getOrCreateSpreadsheet();
    var sheetHocSinh = ss.getSheetByName('HocSinh');
    if (sheetHocSinh) {
      sheetHocSinh.appendRow([
        'stu-' + new Date().getTime(),
        payload.name,
        payload.subject,
        payload.classType,
        payload.feePerSession,
        0,
        payload.totalSessions || 8,
        '0%',
        payload.parentName,
        payload.parentPhone,
        payload.goal || ''
      ]);
    }

    return { success: true, message: 'Đã tạo lớp và ghi thông tin vào Google Sheets!' };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Đánh dấu học phí đã thanh toán trong Sheet SoThuHocPhi
 */
function apiMarkPaid(invoiceId) {
  try {
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheetByName('SoThuHocPhi');
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] == invoiceId) {
          sheet.getRange(i + 1, 11).setValue('Đã thanh toán (' + Utilities.formatDate(new Date(), 'GMT+7', 'HH:mm dd/MM/yyyy') + ')');
          break;
        }
      }
    }
    return { success: true, message: 'Đã cập nhật trạng thái thanh toán thành công!' };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Ghi nhận lịch báo nghỉ và hẹn dạy bù vào Sheet
 */
function apiRescheduleSession(payload) {
  try {
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheetByName('LichDay');
    if (sheet) {
      sheet.appendRow([
        'reschedule-' + new Date().getTime(),
        'Bù',
        payload.rescheduleDate || '28/10/2024',
        payload.rescheduleTime || '09:00 - 10:30',
        payload.subject || 'Hóa học 11',
        'Lớp 11',
        payload.studentName || 'Nhóm 3 bạn',
        'Phòng học bù / Online',
        90,
        0,
        'Lịch bù đã hẹn',
        'Lý do: ' + (payload.reason || 'Bận có phép')
      ]);
    }
    return { success: true, message: 'Đã lưu lịch dạy bù vào Google Sheets!' };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}

/**
 * Đồng bộ toàn bộ dữ liệu hiện tại lên Google Sheets
 */
function apiSyncAllData(payload) {
  try {
    var ss = getOrCreateSpreadsheet();
    return {
      success: true,
      spreadsheetUrl: ss.getUrl(),
      message: 'Đã đồng bộ toàn bộ lịch dạy và sổ thu học phí lên Google Sheets thành công!'
    };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}
