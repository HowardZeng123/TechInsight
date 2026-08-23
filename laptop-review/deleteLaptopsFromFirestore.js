// deleteLaptopsFromFirestore.js
// Script để xóa tất cả dữ liệu laptop từ Firestore

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

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

// Hàm xóa tất cả dữ liệu laptop
async function deleteAllLaptops() {
  try {
    console.log('Bắt đầu xóa dữ liệu laptop...');
    const laptopsCollectionRef = collection(db, "laptops");
    const querySnapshot = await getDocs(laptopsCollectionRef);
    
    if (querySnapshot.empty) {
      console.log('Không tìm thấy dữ liệu laptop nào để xóa.');
      return false;
    }
    
    console.log(`Tìm thấy ${querySnapshot.size} laptop để xóa.`);
    
    const deletePromises = querySnapshot.docs.map(async (document) => {
      await deleteDoc(doc(db, "laptops", document.id));
      console.log(`Đã xóa laptop với ID: ${document.id}`);
    });
    
    await Promise.all(deletePromises);
    
    console.log('Đã xóa tất cả dữ liệu laptop thành công!');
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu laptop:', error);
    return false;
  }
}

// Chạy hàm xóa dữ liệu
deleteAllLaptops()
  .then(() => {
    console.log('Hoàn tất quá trình xóa.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Lỗi:', error);
    process.exit(1);
  }); 