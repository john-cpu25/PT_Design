---
name: pt-design-system
description: Quy chuẩn thiết kế giao diện và định dạng bảng tính công cụ kết cấu PT Design (APEX Southern Cross Engineering)
---

# PT Design System & Engineering Tools Standards

## 1. Thương hiệu & Nhận diện (Branding)
- **Tên công ty / Tiêu đề**: `APEX Southern Cross Engineering`
- **Tagline**: *The Apex of Structural Excellence*
- **Logo**: Sử dụng file hình ảnh chuẩn vector `img/apex_logo.png` (bản đồ Úc + chòm sao Nam Thập Tự + chữ APEX SOUTHERN CROSS ENGINEERING 1 dòng).
- **Favicon**: Đặt trực tiếp `img/apex_logo.png`.

## 2. Quy chuẩn Ô nhập liệu (Input Fields)
Tất cả các ô nhập liệu số và dropdown chọn giá trị trên toàn bộ các công cụ tính toán (PT Spacing, Punching Shear, Strut & Tie, Corbel, v.v.) phải tuân thủ chuẩn màu:
- **Màu chữ ô nhập liệu**: Xanh dương đậm `#1e40af`
- **Độ đậm chữ**: `font-weight: 700` (hoặc `font-weight: 600` cho compact table)
- **Căn lề**: Căn phải cho ô số liệu dạng bảng, căn trái cho form dạng card.
- **Focus state**: Viền tím chuyển đổi mượt mà với `box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1)`.

## 3. Bố cục 2 Cột (Two-Column Spreadsheet Layout)
Đối với các bảng tính kỹ thuật theo tiêu chuẩn (như AS3600):
- **Cột Trái**: Bảng nhập liệu (INPUT) phân nhóm theo `Geometry`, `Properties`, `Loads`, `Strut Geometry`...
- **Cột Phải**: Hình ảnh sơ đồ mô hình (Model Diagram) phía trên + Bảng kết quả (OUTPUT) phía dưới có cột diễn giải công thức tính chi tiết (`white-space: nowrap`).
- **Thẻ Status & Note**: Căn đều chiều cao ở chân 2 cột, chữ trạng thái chính to rõ (`2.2rem`), mô tả trạng thái (`1.2rem`).

## 4. Video Intro & Chuyển cảnh
- Video intro hiển thị tỉ lệ màn hình đẹp, loại bỏ watermark.
- Chuyển cảnh fade-out trực tiếp vào Dashboard mượt mà.

## 5. Hệ thống kích cỡ chữ chuẩn (Typography Scale)

Tất cả các thành phần văn bản phải tuân thủ bảng kích cỡ sau:

| Thành phần | Desktop | Mobile | HTML Tag |
|------------|---------|--------|----------|
| **Tiêu đề lớn nhất (H1)** | 32px – 48px | 26px – 32px | `<h1>` |
| **Tiêu đề chính (H2)** | 24px – 32px | 20px – 24px | `<h2>` |
| **Tiêu đề phụ (H3, H4)** | 18px – 22px | 16px – 18px | `<h3>`, `<h4>` |
| **Nội dung chính (Body)** | 16px – 18px | 14px – 16px | `<p>`, `<li>` |
| **Văn bản phụ (Chú thích, Nhãn)** | 12px – 14px | 11px – 12px | `<small>`, `<span>` |

### Áp dụng vào PT Design:
- **Dashboard title** (H1): `32px` (2rem)
- **Tool header** (H2): `24px` (1.5rem)
- **Card title** (H3/H4): `18px` (1.125rem)
- **Body text / Mô tả**: `16px` (1rem)
- **Label input / Đơn vị / Chú thích**: `12px – 14px` (0.75rem – 0.875rem)
- **Giá trị kết quả nổi bật**: `20px – 24px` (1.25rem – 1.5rem)
- **Giá trị tổng (Total)**: `32px – 48px` (2rem – 3rem)
