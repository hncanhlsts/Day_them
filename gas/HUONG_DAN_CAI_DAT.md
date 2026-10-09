# Hướng Dẫn Cài Đặt Gia Sư Pro Trên Google Apps Script (Google Sheets)

Ứng dụng **Gia Sư Pro** có thể chạy trực tiếp 100% trên nền tảng **Google Apps Script** và tự động đồng bộ 2 chiều với **Google Sheets**.

---

## 3 Bước Cài Đặt Nhanh (Dưới 2 Phút)

### Bước 1: Mở Bảng Tính Google Sheets Mới
1. Truy cập [sheets.new](https://sheets.new) để tạo một bảng tính Google Sheets mới.
2. Đổi tên bảng tính thành: `Gia Sư Pro - Sổ Dạy & Học Phí`.

### Bước 2: Dán Mã Nguồn Vào Google Apps Script
1. Trên thanh menu Google Sheets, chọn **Tiện ích mở rộng** (Extensions) > **Apps Script**.
2. Tại file `Mã.gs` (hoặc `Code.gs`), xóa nội dung mặc định và **dán toàn bộ nội dung file `gas/Code.gs`** vào.
3. Bấm biểu tượng dấu **+** cạnh mục *Tệp* (Files) > Chọn **HTML** > Đặt tên là `Index`.
4. Dán toàn bộ nội dung file `gas/Index.html` vào file `Index.html` vừa tạo.
5. Bấm biểu tượng **Lưu** (Ctrl + S / Cmd + S).

### Bước 3: Triển Khai Dưới Dạng Ứng Dụng Web (Web App)
1. Ở góc trên bên phải màn hình Apps Script, bấm nút **Triển khai** (Deploy) > Chọn **Tùy chọn triển khai mới** (New deployment).
2. Bấm vào biểu tượng bánh răng bên cạnh *Chọn loại* > Chọn **Ứng dụng web** (Web app).
3. Điền cấu hình:
   - **Mô tả:** `Gia Sư Pro v1.0`
   - **Thực thi dưới dạng:** `Tôi` (User deploying / me)
   - **Ai có quyền truy cập:** `Bất kỳ ai` (Anyone) hoặc `Chỉ mình tôi`.
4. Bấm **Triển khai** (Deploy). Cấp quyền truy cập Google Sheets/Drive khi được yêu cầu.
5. Sao chép **URL ứng dụng web** (Web app URL) và mở trên trình duyệt điện thoại hoặc máy tính để sử dụng ngay!

---

## Các Sheet Được Tự Động Tạo
Hệ thống sẽ tự động cấu hình 4 trang tính:
1. `LichDay`: Lưu trữ lịch dạy trong tuần, giờ học, địa điểm và trạng thái ca dạy.
2. `HocSinh`: Quản lý danh sách học viên, học phí/buổi, số buổi đã học, tiến độ và liên hệ phụ huynh.
3. `SoThuHocPhi`: Bảng kê học phí từng kỳ, đối soát số dư kỳ trước, nội dung chuyển khoản VietQR.
4. `NhatKyDiemDanh`: Lưu vết điểm danh từng buổi, nhận xét sư phạm bằng sao, bài đã học và BTVN.
