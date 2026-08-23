### CÁCH HOẠT ĐỘNG:


Tích hợp API:
Firebase/Firestore SDK cung cấp sẵn một giao diện API để tương tác với cơ sở dữ liệu Firestore. Khi các component gọi các hàm như newsService.getLatest() hoặc articleService.getById(), chúng đang thực hiện các lệnh gọi API đến máy chủ của Firebase.

Truy vấn dữ liệu thời gian thực:
Khi các component được tải, yêu cầu API bất đồng bộ sẽ được gửi đến Firestore để lấy dữ liệu mới nhất về tin tức và bài viết. Quá trình này diễn ra thông qua Firebase SDK – công cụ chịu trách nhiệm xử lý các giao tiếp API.

Xử lý dữ liệu phía client:
Sau khi nhận dữ liệu từ API, các component sẽ xử lý và hiển thị dữ liệu đó theo yêu cầu của giao diện người dùng (UI).




### CÁCH SEED DATABASE (NẾU CHƯA CÓ QUYỀN TRUY CẬP VÀO FIRESTORE HIỆN TẠI)

Cách 1: Kêu Hào add vào project Firebase

Cách 2: chạy lệnh để seed Database. Từng bước như sau:

- Set up 1 Firebase projects mới
- Add vào collection 2 Documents trống là "news" và "articles" (lúc đầu tạo Firebase có thể bắt buộc mặc định phải tạo 1 document rỗng. Cái này không ảnh hưởng gì hết, code vẫn chạy bình thường)
- Cập nhật các thông tin cần thiết (API, authDomain,...) ở trong file firebase.ts (theo đường dẫn lib/firebase.ts)
- Cập nhật phần Rules trong Firestore để file initFirestore.js có thể ghi dữ liệu vào database:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Temporary rule to allow seeding
    match /{document=**} {
      allow read, write: if true;  // Allows unrestricted access for seeding
    }
  }
}

```

- Sau đó mở terminal và chạy lệnh: "node initFirestore.js"


### ADD API FIREBASE:
Vì tôi đã giấu API nên giờ tôi sẽ chỉ mọi người cách để chạy được API. Giống ở trên hãy kêu tôi(Hào) add vào Project Firebase để lấy được API để có thể xài được các chức năng trong bài 
Sau khi được tôi add vào Project. Mọi người hãy tạo cho mình 1 file .env ở trong máy để có thể mà pass cái API vào. Từ đó mới có thể mà xài được những cái như favorite hoặc là mấy cái article một cách mượt mà.

```
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
````
đây là mẫu, mọi người chỉ cần thay cái API của project vào là được.




