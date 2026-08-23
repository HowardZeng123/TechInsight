# 💻 Tech Review Web

Một nền tảng web đánh giá và chia sẻ trải nghiệm sử dụng laptop, được phát triển bằng **Next.js** và **Firebase**. Người dùng có thể đăng nhập, đăng bài đánh giá, bình luận và xem nhận xét của người khác để đưa ra quyết định mua hàng chính xác.

## 🚀 Tính năng chính

- 🔐 Đăng ký / Đăng nhập với Firebase Authentication
- 📝 Viết, chỉnh sửa, xoá bài đánh giá laptop
- 💬 Bình luận dưới bài đánh giá
- ⭐ Đánh giá laptop theo thang điểm
- 🔍 Tìm kiếm và lọc laptop theo tên, hãng, cấu hình,...
- 📊 Admin dashboard (tuỳ chọn) để quản lý nội dung

## 🛠️ Công nghệ sử dụng

- [Next.js](https://nextjs.org/) - Framework React mạnh mẽ hỗ trợ SSR và SSG
- [Firebase](https://firebase.google.com/)
  - Authentication
  - Firestore (Database)
  - Firebase Storage (lưu hình ảnh laptop)
  - Firebase Hosting (tuỳ chọn)
 



## ⚙️ Cài đặt & Chạy dự án

### 1. Clone dự án

```bash
git clone https://github.com/Kanjiforwork/TechInsight.git
cd laptop-review

### Cài đặt dependencies
npm install


## Cấu hình Firebase
### Tạo file .env.local và thêm:
env
Sao chép
Chỉnh sửa
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id


#chạy
npm run dev


🧑‍💻 Đóng góp
Chào mừng mọi đóng góp! Vui lòng tạo issue hoặc pull request nếu bạn muốn cải thiện dự án.
