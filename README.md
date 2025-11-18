# Blogging Platform API

API backend cho một nền tảng blog được xây dựng bằng Node.js + Express và MongoDB.

Mục tiêu: cung cấp API cơ bản để đăng ký/đăng nhập người dùng, quản lý bài viết, và hỗ trợ JWT-based authentication cùng rate limiting.

## Tính năng chính

- Đăng ký, đăng nhập, refresh token, logout
- Tạo / cập nhật / xóa / lấy bài viết
- Xác thực bằng JWT
- Giới hạn tần suất (rate limiting)
- Kết nối MongoDB bằng Mongoose

## Yêu cầu

- Node.js (>= 16 recommended)
- MongoDB (local hoặc Atlas)

## Cài đặt

1. Clone repository hoặc tải mã nguồn vào máy.
2. Cài đặt phụ thuộc:

```powershell
npm install
```

## Biến môi trường

Tạo file `.env` ở thư mục gốc và cấu hình các biến sau (ví dụ):

```env
MONGODB_URI=mongodb://localhost:27017/blogging
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=15s
JWT_EXPIRE_REFRESH_TOKEN=7d
PORT=5000
```

Ghi chú:
- `MONGODB_URI`: URL kết nối MongoDB.
- `JWT_SECRET`: khóa bí mật dùng để sign token.
- Thời gian hết hạn token (`JWT_EXPIRE` và `JWT_EXPIRE_REFRESH_TOKEN`) có thể điều chỉnh.

## Chạy ứng dụng

Chạy trong môi trường phát triển (sử dụng `nodemon` theo `package.json`):

```powershell
npm run start
```

Mặc định server khởi động từ `server.js`.

## API Endpoints (tổng quan)

Endpoint chính được mount trong router API (`src/routes/api.js`). Dưới đây là các route hiện có:

- `GET /api/` : Kiểm tra API (trả về "Hello world api")
- `GET /api/account` : Lấy thông tin account (cần `authAdmin` middleware)

- Authentication:
  - `POST /api/register` : Đăng ký người dùng
  - `POST /api/login` : Đăng nhập (trả access + refresh token)
  - `POST /api/refresh_token` : Lấy access token mới bằng refresh token
  - `POST /api/logout` : Logout (hủy refresh token)

- Posts:
  - `POST /api/posts` : Tạo bài viết
  - `PUT /api/posts/:id` : Cập nhật bài viết
  - `DELETE /api/posts/:id` : Xóa bài viết
  - `GET /api/posts/:id` : Lấy bài viết theo id
  - `GET /api/posts` : Lấy danh sách bài viết

Ghi chú: một số route yêu cầu xác thực/role (middleware `auth.js`).

## Middleware chính

- `auth.js` : middleware xác thực, kiểm tra access token và role (ví dụ `authAdmin`).
- `rateLimiter.js` : giới hạn tần suất request cho API.
- `errorHandler.js` : xử lý lỗi trung tâm.

## Cấu trúc dự án (chính)

- `server.js` : entry point
- `src/config/database.js` : kết nối MongoDB
- `src/controllers/` : controllers xử lý request (`postController.js`, `userController.js`)
- `src/models/` : schema Mongoose (`post.js`, `user.js`)
- `src/routes/api.js` : route API
- `src/middleware/` : middleware (`auth.js`, `rateLimiter.js`, `errorHandler.js`)
- `src/services/JwtService.js` : hàm tạo/refresh JWT

## Gợi ý phát triển

- Thêm file `.env.example` để lưu mẫu biến môi trường.
- Bổ sung logging, validation (ví dụ `joi` hoặc `express-validator`).
- Viết test cho các route chính.

## Chạy trên PowerShell (Windows)

Ví dụ các lệnh chạy nhanh:

```powershell
# cài đặt
npm install

# tạo .env rồi khởi động
npm run start
```

## License

Project này sử dụng license: `ISC` (tham chiếu trong `package.json`).

---

Nếu bạn muốn, tôi có thể:

- Thêm `./.env.example` tự động,
- Viết hướng dẫn chi tiết cho deployment (Docker/Heroku/PM2),
- Thêm ví dụ request (Postman collection) hoặc tập hợp tests.

File README này đã được tạo trong `README.md`.
