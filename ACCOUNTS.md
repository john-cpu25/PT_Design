# APEX PT_Design — Danh Sách Tài Khoản & Hướng Dẫn Cấp Quyền

> **Lưu ý bảo mật:** Hệ thống PT_Design được cấu hình phân quyền nghiêm ngặt (**Role-Based Access Control**), **CHỈ DÀNH RIÊNG CHO KỸ SƯ (ENGINEER) VÀ QUẢN TRỊ VIÊN (ADMIN)**.

---

## 1. Hướng Dẫn Kích Hoạt & Đăng Nhập Dành Cho Kỹ Sư

1. Truy cập địa chỉ ứng dụng: `http://localhost:3000/`
2. Nhập địa chỉ **Email công ty** (`@apexscengineering.com`).
3. **Thiết lập mật khẩu:**
   - **Tài khoản đăng nhập lần đầu:** Người dùng tự gõ một mật khẩu mong muốn bất kỳ (ví dụ: `Apex@2026`). Hệ thống sẽ tự động băm mã hóa bảo mật **SHA-256** và lưu vào cơ sở dữ liệu Supabase làm mật khẩu chính thức.
   - **Tài khoản đã kích hoạt:** Nhập mật khẩu đã đặt trước đó.
4. Nhấn **ĐĂNG NHẬP** để vào Dashboard.

---

## 2. Danh Sách Tài Khoản HỢP LỆ (Được phép truy cập: Engineer & Admin)

| STT | Họ và Tên | Email Đăng Nhập | Chức Vụ / Position | Phòng Ban / Team | Quyền Hạn | Trạng Thái Mật Khẩu |
|:---:|---|---|---|---|:---:|:---:|
| 1 | **TrungTheNguyen** | `trung.thenguyen@apexscengineering.com` | Engineer / Management | Design / Leadership | **LEADER** | ⏳ Tự đặt lần đầu |
| 2 | **Sơn Lâm** | `son.lam@apexscengineering.com` | Senior Engineer | Lateral Design | **LEADER** | ⏳ Tự đặt lần đầu |
| 3 | **Khánh Nguyễn** | `khanh.nguyen@apexscengineering.com` | Team Leader | BIM | **LEADER** | ⏳ Tự đặt lần đầu |
| 4 | **Cường Phạm** | `cuong.pham@apexscengineering.com` | Line Manager | BIM | **LEADER** | ⏳ Tự đặt lần đầu |
| 5 | **Đức Phạm** | `duc.pham@apexscengineering.com` | Senior Engineer | Slab Design | **LEADER** | ⏳ Tự đặt lần đầu |
| 6 | **Bảo Phạm** | `staff@apexscengineering.com` | Engineer | Slab Design | **LEADER** | ⏳ Tự đặt lần đầu |
| 7 | **Nguyên Lý** | `neil.ly@apexscengineering.com` | Team Leader | BIM | **LEADER** | ⏳ Tự đặt lần đầu |
| 8 | **Vu Do** | `vu.donguyen@apexscengineering.com` | Engineer / Management | Design / Leadership | **ADMIN** | ✅ Đã kích hoạt |
| 9 | **Vũ Đỗ** | `vu@apexscengineering.com` | Engineer Team Leader | Leadership | **ADMIN** | ⏳ Tự đặt lần đầu |
| 10 | **Admin** | `96FCEF00-994D-4BA9-ADAE-EA948702F606@admin.com.au` | Engineer / Management | Design / Leadership | **ADMINAPP** | ⏳ Tự đặt lần đầu |
| 11 | **Jason Le** | `jason@apexscengineering.com` | Engineer / Management | Design / Leadership | **ADMIN** | ⏳ Tự đặt lần đầu |
| 12 | **Nhân Phạm** | `nhan.pham@apexscengineering.com` | Engineer | Slab Design | **USER** | ⏳ Tự đặt lần đầu |
| 13 | **Kỳ Phan** | `ky.phan@apexscengineering.com` | Engineer | Slab Design | **USER** | ⏳ Tự đặt lần đầu |
| 14 | **Ngân Trần** | `annie.tran@apexscengineering.com` | Engineer | Slab Design | **USER** | ⏳ Tự đặt lần đầu |
| 15 | **Nhân Nguyễn** | `johnny.nguyen@apexscengineering.com` | BIM Manager | BIM / REO / MTO | **ADMIN** | ✅ Đã kích hoạt |

---

## 3. Danh Sách Tài Khoản BỊ CHẶN (Drafter, Accounts, General Users)

> Các tài khoản dưới đây nếu cố gắng đăng nhập sẽ nhận được thông báo lỗi: *"Truy cập bị từ chối: Ứng dụng PT Design chỉ dành cho Kỹ sư (Engineer) và Quản trị viên (Admin)"*.

| STT | Họ và Tên | Email | Chức Vụ | Nhóm / Bộ Phận | Lý Do Chặn |
|:---:|---|---|---|---|---|
| 1 | Linh Huynh | `linh.huynh@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 2 | Tiến Trần | `tien.tran@apexscengineering.com` | Senior Drafter | BIM | Vị trí Họa viên (Drafter) không thuộc đối tượng tính toán |
| 3 | Hoàng Phạm | `hoang.pham@apexscengineering.com` | Drafter | BIM | Vị trí Họa viên (Drafter) không thuộc đối tượng tính toán |
| 4 | Tâm Phan | `tam.phan@apexscengineering.com` | Drafter & Arch | BIM | Vị trí Họa viên (Drafter) không thuộc đối tượng tính toán |
| 5 | Trung Nguyễn | `trung.hoangnguyen@apexscengineering.com` | Drafter | BIM | Vị trí Họa viên (Drafter) không thuộc đối tượng tính toán |
| 6 | Khiêm Nguyễn | `khiem.nguyen@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 7 | Malinda Dharmakeerthi | `malinda@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 8 | Nam Le | `nam.le@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 9 | Dung Do | `dung.do@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 10 | Khang Trinh | `khang.trinh@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 11 | Loc Pham | `loc.pham@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 12 | Phu Nguyen | `phu@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 13 | Rocco Carinci | `rocco@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 14 | Steven Peka | `steven@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 15 | Yung Li | `yung@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 16 | Sean Ngo | `sean@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 17 | Glenn Boyd | `glenn@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 18 | Rayan Jayatilake | `rayan@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 19 | Charbel Nasr | `charbel@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 20 | Spiros Konnas | `spiros@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 21 | Harry Lambis | `harry@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 22 | Chris Iannuzzi | `chris@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 23 | Jessica Mitchell | `jessica@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 24 | Jin Liang | `jin@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 25 | Joseph Presti | `joseph@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 26 | Amalan Thavarajah | `amalan@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 27 | Matthew Willis | `matthew@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 28 | Ellen Jessop | `accounts@apexscengineering.com` | — | — | Tài khoản phòng Kế toán |
| 29 | Mervin Huynh | `mervin@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 30 | Danial Malekian | `danial@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 31 | Quân Nguyễn | `quan.nguyen@apexscengineering.com` | Drafter | BIM | Vị trí Họa viên (Drafter) không thuộc đối tượng tính toán |
| 32 | Michael Rogers-Frassoni | `michael.rogers@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 33 | Stephen Ye | `stephen@apexscengineering.com` | — | — | Không thuộc vai trò Engineer hoặc Admin |
| 34 | Ánh Nguyễn | `anh.nguyen@apexscengineering.com` | Drafter | BIM | Vị trí Họa viên (Drafter) không thuộc đối tượng tính toán |

---

## 4. Chế Độ Bypass Dành Riêng Cho Quản Trị Viên (Dev / Testing)

- **Bypass Super Admin:** Bấm nút `LOCAL ADMIN BYPASS` dưới thẻ đăng nhập hoặc truy cập trực tiếp link: `http://localhost:3000/?admin_mode=true`
- **Bypass Team Leader:** Truy cập link: `http://localhost:3000/?leader_mode=true`
