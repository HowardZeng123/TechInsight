// Script để đặt người dùng đầu tiên làm admin
// Chạy bằng lệnh: node scripts/set-first-admin.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, updateDoc, setDoc } = require('firebase/firestore');

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFSVL94k5zXkrAy5oQKbO7rT6W5fPAk4M",
  authDomain: "laptop-review-all.firebaseapp.com",
  projectId: "laptop-review-all",
  storageBucket: "laptop-review-all.firebasestorage.app",
  messagingSenderId: "1044782876129",
  appId: "1:1044782876129:web:6e0891bf2753c5a3f63ea0"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID của người dùng sẽ đặt làm admin
const userId = "ojxmDfHM0QX8vrTrBqrPZZwPtbR2";

async function setFirstAdmin() {
  try {
    console.log(`Bắt đầu đặt người dùng ${userId} làm admin...`);
    
    // Kiểm tra người dùng tồn tại
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.log("Không tìm thấy người dùng trong Firestore. Tạo mới...");
      
      // Tạo mới người dùng với vai trò admin nếu chưa tồn tại
      await setDoc(userRef, {
        role: "admin",
        createdAt: new Date()
      });
      
      console.log("Đã tạo người dùng mới với vai trò admin!");
    } else {
      console.log("Đã tìm thấy người dùng, cập nhật thành admin...");
      
      // Cập nhật quyền admin cho người dùng
      await updateDoc(userRef, {
        role: "admin"
      });
      
      console.log("Đã cập nhật người dùng thành admin!");
    }
    
    console.log("Thao tác hoàn tất! Người dùng đã có quyền admin.");
  } catch (error) {
    console.error("Lỗi khi đặt người dùng làm admin:", error);
  }
}

// Chạy hàm
setFirstAdmin()
  .then(() => {
    console.log("Hoàn tất quá trình.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Lỗi:", error);
    process.exit(1);
  }); 