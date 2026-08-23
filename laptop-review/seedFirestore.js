// // seedFirestore.js
// // Script để nhập dữ liệu vào Firestore

// const { initializeApp } = require('firebase/app');
// const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');
// const fs = require('fs');
// const path = require('path');

// // Cấu hình Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyAFSVL94k5zXkrAy5oQKbO7rT6W5fPAk4M",
//   authDomain: "laptop-review-all.firebaseapp.com",
//   projectId: "laptop-review-all",
//   storageBucket: "laptop-review-all.firebasestorage.app",
//   messagingSenderId: "1044782876129",
//   appId: "1:1044782876129:web:6e0891bf2753c5a3f63ea0"
// };

// // Khởi tạo Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Dữ liệu mẫu - Tin tức
// const newsItems = [
//   {
//     title: "Apple Unveils M3-Powered MacBook Pro with Revolutionary Cooling System",
//     image: "/news/news1.jpg",
//     excerpt: "New thermal architecture promises sustained performance for professional workloads",
//     content: `At today's Apple Event, the company revealed its next-generation MacBook Pro featuring the M3 chip and an innovative dual-fan vapor chamber cooling system. Unlike previous models that throttled under sustained loads, this new design maintains peak performance during 4K video renders and machine learning tasks. Early benchmarks show a 40% improvement in sustained multicore performance compared to M2 models.

// The system uses machine learning to dynamically adjust fan curves based on application demands. "This isn't just about raw power - it's about delivering that power consistently," said Apple's VP of Hardware Engineering. The redesign comes after criticism of thermal limitations in professional workflows. Available in 14" and 16" configurations, shipping begins November 30th starting at $2,499.`,
//     author: "Mark Gurman",
//     date: "11/15/2024",
//     readTime: "6 min read",
//     createdAt: new Date()
//   },
//   {
//     title: "Windows 12 Launch Sparks New Era of AI-Powered Laptops",
//     image: "/news/news3.jpg",
//     excerpt: "Major OEMs debut neural processing units in consumer laptops",
//     content: `Microsoft's Windows 12 launch has triggered a wave of new laptops featuring dedicated NPUs (Neural Processing Units). Dell's XPS 14 leads the charge with its integrated Intel AI Boost chip capable of 45 TOPS (Tera Operations Per Second), enabling real-time language translation and advanced background noise cancellation during video calls.

// HP's latest Spectre x360 demonstrates practical AI applications - its new Studio Creator mode automatically optimizes system resources when launching creative apps like Photoshop. Lenovo meanwhile focuses on security, using NPUs for continuous authentication through typing patterns and webcam analysis. Early adopters report 30% better battery life during AI-accelerated tasks compared to traditional CPU processing.`,
//     author: "Tom Warren",
//     date: "10/30/2024",
//     readTime: "8 min read",
//     createdAt: new Date()
//   },
//   {
//     title: "Framework Laptop 16 Redefines Modular Computing",
//     image: "/news/news2.jpg",
//     excerpt: "User-upgradable GPU module and port ecosystem gain industry attention",
//     content: `Framework's latest innovation features a revolutionary expansion bay system allowing users to swap between an NVIDIA RTX 4060 Mobile GPU module and additional storage/IO configurations. The magnesium-alloy chassis maintains a slim 18mm profile while supporting up to 64GB DDR5 RAM and 8TB PCIe 5.0 storage.

// CEO Nirav Patel told us: "We're challenging the throwaway culture in tech." Early teardowns reveal standardized PCIe connections for third-party modules. Despite initial skepticism, the system handled Cyberpunk 2077 at 1440p/60fps in testing. The $1,899 base model ships Q1 2025, with expansion modules priced from $299.`,
//     author: "Linus Sebastian",
//     date: "11/01/2024",
//     readTime: "7 min read",
//     createdAt: new Date()
//   },
// ];

// // Dữ liệu mẫu - Bài viết
// const articles = [
//   {
//     title: "Best Productivity Laptops 2024: Ultimate Guide",
//     excerpt: "From executive boards to college dorms - we test all the top workhorses.",
//     content: `After testing 32 machines across price ranges, our team identified clear winners in three categories:

// 1. **Premium Powerhouse**: Dell XPS 15 (2024) combines Intel's new 14-core Ultra 9 processor with a stunning 4K OLED touchscreen. Its carbon fiber keyboard deck remains cool during marathon coding sessions.

// 2. **Mid-Range Marvel**: The Asus Zenbook 14X surprises with AMD's Ryzen 7 8840U and a 90Wh battery lasting 14 hours of actual office use. Its new haptic touchpad rivals MacBooks for precision.

// 3. **Budget Champion**: Acer's Swift 3 (2024 edition) delivers shockingly good performance with its Core i5-1335U and military-grade durability for under $800.

// We evaluated 18 criteria including keyboard travel distance, PWM flicker rates, and real-world multi-monitor performance. Pro tip: Look for laptops with hardware kill switches for webcams/mics in this era of sophisticated phishing attacks.`,
//     image: "articles/article1.jpg",
//     category: "Guides",
//     date: "November 10, 2024",
//     createdAt: new Date()
//   },
//   {
//     title: "OLED vs Mini-LED Displays: Eye Strain Analysis",
//     excerpt: "Medical study reveals surprising results about long-term use of displays on our eyes.",
//     content: `A 12-month Stanford University study tracked 500 participants using various display technologies. Key findings:

// - **OLED users** reported 22% less eye strain during night sessions due to perfect black levels reducing pupil dilation stress
// - **Mini-LED displays** showed advantages in bright environments, with matte options causing 15% less reflection-related fatigue
// - Both technologies eliminated the PWM-induced headaches common in budget LCD panels

// Dr. Emily Chen, lead researcher, notes: "The 2024 generation of self-healing OLED panels solved burn-in concerns - we saw zero image retention cases." Surprisingly, display curvature mattered more than technology - 1800R curved screens reduced neck strain by 40% during long tasks. Our recommendation: Pair any modern panel with ambient light sensors and take 20-second screen breaks hourly.`,
//     image: "articles/article2.jpg",
//     category: "Comparisons",
//     date: "November 5, 2024",
//     createdAt: new Date()
//   },
//   {
//     title: "The Rise of ARM Architecture in Windows Laptops",
//     excerpt: "How Qualcomm and Microsoft are challenging the x86 dominance in Windows Laptops.",
//     content: `The Snapdragon X Elite's Geekbench 6 multi-core score of 15,230 - beating Intel's Core i9-13900H - marks a turning point. Microsoft's Windows 12 includes a redesigned ARM compiler showing 90% x64 emulation efficiency, finally making Photoshop and AutoCAD viable.

// Key advantages driving adoption:
// - **Battery Life**: 22 hours average in HP EliteBook 1040 G11 (ARM) vs 9 hours in Intel version
// - **Instant Wake**: ARM's smartphone heritage enables 0.5s resume from sleep
// - **5G Integration**: Built-in modems eliminate dongle needs

// But challenges remain - legacy enterprise software and niche drivers still require x86. "We're working with 150+ ISVs on native ports," says Qualcomm's CTO. Industry analysts predict ARM could capture 35% of the Windows market by 2026, especially in enterprise and education sectors.`,
//     image: "articles/article3.png",
//     category: "Technology",
//     date: "November 1, 2024",
//     createdAt: new Date()
//   },
// ];

// // Đọc dữ liệu laptop từ mock_data/data.ts
// async function getLaptopData() {
//   try {
//     // Đường dẫn đến file data.ts
//     const filePath = path.join(process.cwd(), 'mock_data', 'data.ts');
//     console.log(`Đang đọc file từ đường dẫn: ${filePath}`);
    
//     // Đọc nội dung file
//     const fileContent = fs.readFileSync(filePath, 'utf8');
    
//     // Tìm đoạn "export const laptops = [" trong file
//     const laptopsStartMatch = fileContent.match(/export\s+const\s+laptops\s*=\s*\[/);
//     if (!laptopsStartMatch) {
//       throw new Error('Không tìm thấy khai báo laptops trong file data.ts');
//     }
    
//     // Lấy vị trí bắt đầu của mảng laptop
//     const startIdx = laptopsStartMatch.index + laptopsStartMatch[0].length;
    
//     // Tìm dấu ngoặc vuông đóng cuối cùng (không hoàn hảo nhưng hoạt động cho trường hợp này)
//     let balance = 1; // Bắt đầu với 1 ngoặc vuông mở
//     let endIdx = startIdx;
    
//     for (let i = startIdx; i < fileContent.length; i++) {
//       if (fileContent[i] === '[') balance++;
//       if (fileContent[i] === ']') balance--;
      
//       if (balance === 0) {
//         endIdx = i;
//         break;
//       }
//     }
    
//     // Lấy nội dung mảng laptops
//     const laptopsArrayString = fileContent.substring(startIdx, endIdx);
    
//     // Chuyển đổi string thành mảng JavaScript bằng cách thêm dấu ngoặc vuông và eval
//     // Lưu ý: eval() không an toàn cho các dữ liệu không tin cậy, nhưng ở đây ta kiểm soát dữ liệu đầu vào
//     const laptopsArray = eval(`[${laptopsArrayString}]`);
    
//     console.log(`Đã tìm thấy ${laptopsArray.length} laptop trong data.ts`);
//     return laptopsArray;
//   } catch (error) {
//     console.error('Lỗi khi đọc dữ liệu laptop:', error);
//     return [];
//   }
// }

// // Hàm nhập dữ liệu tin tức
// async function seedNewsData() {
//   try {
//     const newsCollectionRef = collection(db, "news");
    
//     for (const item of newsItems) {
//       await addDoc(newsCollectionRef, {
//         ...item,
//         createdAt: Timestamp.fromDate(item.createdAt)
//       });
//     }
    
//     console.log("Đã nhập dữ liệu tin tức thành công!");
//     return true;
//   } catch (error) {
//     console.error("Lỗi khi nhập dữ liệu tin tức:", error);
//     return false;
//   }
// }

// // Hàm nhập dữ liệu bài viết
// async function seedArticlesData() {
//   try {
//     const articlesCollectionRef = collection(db, "articles");
    
//     for (const article of articles) {
//       await addDoc(articlesCollectionRef, {
//         ...article,
//         createdAt: Timestamp.fromDate(article.createdAt)
//       });
//     }
    
//     console.log("Đã nhập dữ liệu bài viết thành công!");
//     return true;
//   } catch (error) {
//     console.error("Lỗi khi nhập dữ liệu bài viết:", error);
//     return false;
//   }
// }

// // Hàm nhập dữ liệu laptop
// async function seedLaptopData() {
//   try {
//     const laptops = await getLaptopData();
    
//     if (laptops.length === 0) {
//       console.error("Không có dữ liệu laptop để nhập");
//       return false;
//     }
    
//     const laptopsCollectionRef = collection(db, "laptops");
    
//     for (const laptop of laptops) {
//       await addDoc(laptopsCollectionRef, {
//         ...laptop,
//         createdAt: Timestamp.fromDate(new Date())
//       });
//     }
    
//     console.log("Đã nhập dữ liệu laptop thành công!");
//     return true;
//   } catch (error) {
//     console.error("Lỗi khi nhập dữ liệu laptop:", error);
//     return false;
//   }
// }

// // Hàm nhập tất cả dữ liệu
// async function seedAllData() {
//   console.log('Bắt đầu nhập dữ liệu vào Firestore...');
  
//   const newsResult = await seedNewsData();
//   const articlesResult = await seedArticlesData();
//   const laptopsResult = await seedLaptopData();
  
//   if (newsResult && articlesResult && laptopsResult) {
//     console.log("Đã nhập tất cả dữ liệu thành công!");
//     return true;
//   } else {
//     console.error("Có lỗi khi nhập dữ liệu.");
//     return false;
//   }
// }

// // Chạy hàm nhập dữ liệu
// seedAllData().then(() => {
//   console.log('Hoàn thành quá trình nhập dữ liệu!');
//   process.exit(0);
// }).catch(error => {
//   console.error('Lỗi:', error);
//   process.exit(1);
// }); 