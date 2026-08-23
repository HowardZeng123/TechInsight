import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { seedLaptopData } from './seedLaptopData';

// Dữ liệu tin tức
const newsItems = [
  {
    title: "Apple trình làng MacBook Pro M3 với hệ thống tản nhiệt đột phá",
    image: "/news/news1.jpg",
    excerpt: "Công nghệ tản nhiệt mới giúp máy duy trì hiệu suất cao liên tục trong các tác vụ chuyên nghiệp",
    content: `Tại sự kiện đặc biệt hôm nay, Apple đã chính thức giới thiệu thế hệ MacBook Pro mới nhất, trang bị chip M3 và hệ thống tản nhiệt buồng hơi kép hoàn toàn mới. Điểm khác biệt lớn so với các thế hệ trước đó chính là khả năng duy trì hiệu suất đỉnh cao ngay cả khi xử lý những tác vụ nặng như render video 4K hay huấn luyện mô hình AI trong thời gian dài.

Kết quả benchmark đầu tiên cho thấy một bước tiến ấn tượng với hiệu suất đa nhân cải thiện tới 40% so với dòng M2. Hệ thống này còn tích hợp trí tuệ nhân tạo để tự động điều chỉnh tốc độ quạt tản nhiệt dựa trên loại ứng dụng đang chạy.

"Chúng tôi không chỉ tập trung vào sức mạnh thô, mà còn quan tâm đến việc duy trì sức mạnh đó một cách ổn định," đại diện phòng Kỹ thuật Phần cứng của Apple chia sẻ. Sản phẩm này được kỳ vọng sẽ giải quyết những hạn chế về nhiệt mà các chuyên gia đã phản ánh trong quá khứ. MacBook Pro M3 sẽ có sẵn ở hai kích thước 14 inch và 16 inch, bắt đầu giao hàng từ 30/11 với giá khởi điểm 2.499 USD.`,
    author: "Mark Gurman",
    date: "15/11/2024",
    readTime: "6 phút đọc",
    createdAt: new Date()
  },
  {
    title: "Windows 12 ra mắt: Kỷ nguyên mới của laptop tích hợp AI",
    image: "/news/news3.jpg",
    excerpt: "Các nhà sản xuất lớn đua nhau tung ra laptop tích hợp chip xử lý AI chuyên dụng",
    content: `Sự ra đời của Windows 12 đã khơi mào một cuộc cách mạng trong ngành laptop với hàng loạt sản phẩm mới tích hợp NPU (bộ xử lý thần kinh) chuyên dụng. Dell XPS 14 dẫn đầu cuộc đua với chip Intel AI Boost có khả năng xử lý 45 nghìn tỷ phép tính mỗi giây (TOPS), mở ra khả năng dịch thuật thời gian thực và khử tiếng ồn thông minh trong cuộc gọi video.

Không kém cạnh, HP Spectre x360 thế hệ mới cho thấy những ứng dụng AI thực tế ấn tượng. Chế độ Studio Creator có thể tự động tối ưu hóa tài nguyên hệ thống khi người dùng mở các phần mềm sáng tạo như Photoshop. Trong khi đó, Lenovo tập trung vào an ninh bảo mật, sử dụng NPU để xác thực người dùng liên tục thông qua cách gõ phím và nhận diện khuôn mặt.

Những người dùng đầu tiên báo cáo rằng thời lượng pin cải thiện tới 30% khi thực hiện các tác vụ có hỗ trợ AI so với xử lý truyền thống bằng CPU.`,
    author: "Tom Warren",
    date: "30/10/2024",
    readTime: "8 phút đọc",
    createdAt: new Date()
  },
  {
    title: "Framework Laptop 16: Cách mạng hóa laptop theo kiểu module",
    image: "/news/news2.jpg",
    excerpt: "Hệ thống GPU có thể thay đổi và cổng kết nối linh hoạt thu hút sự quan tâm của toàn ngành",
    content: `Framework vừa tạo nên một bước ngoặt với hệ thống khe mở rộng cách mạng, cho phép người dùng dễ dàng hoán đổi giữa module GPU NVIDIA RTX 4060 Mobile và các cấu hình lưu trữ/kết nối khác nhau. Dù có thiết kế mỏng chỉ 18mm, máy vẫn hỗ trợ tới 64GB RAM DDR5 và ổ cứng PCIe 5.0 dung lượng 8TB.

"Chúng tôi muốn thách thức văn hóa 'dùng xong vứt đi' trong ngành công nghệ," CEO Nirav Patel chia sẻ. Những phân tích sâu cho thấy hệ thống kết nối PCIe được chuẩn hóa, mở đường cho các nhà sản xuất bên thứ ba tham gia.

Mặc dù ban đầu nhận về nhiều hoài nghi, trong thử nghiệm thực tế, máy đã chạy mượt mà Cyberpunk 2077 ở độ phân giải 1440p với 60 khung hình/giây. Phiên bản cơ bản có giá 1.899 USD sẽ được giao trong quý 1/2025, cùng với các module mở rộng từ 299 USD.`,
    author: "Linus Sebastian",
    date: "01/11/2024",
    readTime: "7 phút đọc",
    createdAt: new Date()
  },
];

// Dữ liệu bài viết chuyên sâu
const articles = [
  {
    title: "Laptop năng suất tốt nhất 2024: Cẩm nang chọn máy hoàn hảo",
    excerpt: "Từ phòng họp giám đốc đến phòng sinh viên - chúng tôi đã thử nghiệm tất cả những chiếc máy đáng tin cậy nhất.",
    content: `Sau khi thử nghiệm kỹ lưỡng 32 mẫu laptop thuộc mọi phân khúc giá, đội ngũ chuyên gia của chúng tôi đã tìm ra những chiếc máy xuất sắc nhất trong từng danh mục:

**Hạng mục cao cấp: Dell XPS 15 (2024)**
Sự kết hợp hoàn hảo giữa bộ xử lý Intel 14 nhân Ultra 9 thế hệ mới và màn hình cảm ứng OLED 4K tuyệt đẹp. Điều đặc biệt là bàn phím bằng sợi carbon luôn giữ nhiệt độ mát mẻ ngay cả trong những phiên code marathon dài nhất.

**Hạng mục tầm trung: Asus Zenbook 14X**
Một bất ngờ thú vị với chip AMD Ryzen 7 8840U và viên pin 90Wh có thể hoạt động liên tục 14 giờ trong điều kiện sử dụng văn phòng thực tế. Touchpad haptic mới có độ chính xác sánh ngang với MacBook.

**Hạng mục giá rẻ: Acer Swift 3 (phiên bản 2024)**
Hiệu suất vượt mong đợi với chip Core i5-1335U và độ bền chuẩn quân sự, tất cả trong mức giá dưới 800 USD.

Chúng tôi đã đánh giá dựa trên 18 tiêu chí khác nhau, từ độ nảy của phím bấm, tỷ lệ nhấp nháy PWM, cho đến hiệu suất thực tế khi làm việc với nhiều màn hình. Bí quyết từ chuyên gia: Trong thời đại tấn công mạng tinh vi như hiện nay, hãy ưu tiên những laptop có nút tắt cứng cho webcam và microphone.`,
    image: "articles/article1.jpg",
    category: "Cẩm nang",
    date: "10 tháng 11, 2024",
    createdAt: new Date()
  },
  {
    title: "OLED hay Mini-LED: Công nghệ nào dễ mắt hơn?",
    excerpt: "Nghiên cứu y học mới nhất tiết lộ những điều bất ngờ về tác động lâu dài của các loại màn hình đến thị lực.",
    content: `Trong một nghiên cứu kéo dài 12 tháng, Đại học Stanford đã theo dõi 500 người sử dụng các công nghệ màn hình khác nhau. Kết quả thu được khá bất ngờ:

**Người dùng màn hình OLED**: Giảm 22% tình trạng mỏi mắt khi làm việc ban đêm nhờ khả năng hiển thị màu đen tuyệt đối, giúp giảm áp lực lên đồng tử mắt.

**Màn hình Mini-LED**: Thể hiện ưu thế vượt trội trong môi trường có ánh sáng mạnh, đặc biệt phiên bản chống lóa giúp giảm 15% tình trạng mệt mỏi do phản xạ ánh sáng.

Đáng chú ý, cả hai công nghệ này đều loại bỏ hoàn toàn chứng đau đầu do hiệu ứng PWM - vấn đề thường gặp ở các panel LCD giá rẻ.

Tiến sĩ Emily Chen, trưởng nhóm nghiên cứu, nhận định: "Thế hệ panel OLED 2024 với khả năng tự phục hồi đã giải quyết triệt để vấn đề cháy màn hình - chúng tôi không ghi nhận bất kỳ trường hợp lưu ảnh nào." 

Một phát hiện thú vị khác là độ cong màn hình quan trọng hơn cả công nghệ hiển thị. Màn hình cong 1800R giúp giảm tới 40% tình trạng đau cổ khi làm việc lâu. Chuyên gia khuyên nên kết hợp bất kỳ loại màn hình hiện đại nào với cảm biến ánh sáng thông minh và thói quen nghỉ mắt 20 giây mỗi giờ.`,
    image: "articles/article2.jpg",
    category: "So sánh",
    date: "5 tháng 11, 2024",
    createdAt: new Date()
  },
  {
    title: "Kiến trúc ARM: Làn gió mới thổi vào thế giới laptop Windows",
    excerpt: "Cuộc cạnh tranh khốc liệt giữa Qualcomm và Microsoft nhằm phá vỡ thế thống trị x86 trong laptop Windows.",
    content: `Điểm số đa nhân 15.230 trên Geekbench 6 của Snapdragon X Elite - vượt qua Intel Core i9-13900H - đánh dấu một bước ngoặt lịch sử. Windows 12 với trình biên dịch ARM được thiết kế lại đạt hiệu quả mô phỏng x64 lên tới 90%, cuối cùng cũng khiến Photoshop và AutoCAD chạy mượt mà trên nền tảng này.

**Những ưu điểm vượt trội đang thúc đẩy xu hướng chuyển đổi:**

*Thời lượng pin vượt trội*: HP EliteBook 1040 G11 phiên bản ARM cho thời gian sử dụng trung bình 22 giờ, gấp hơn đôi so với phiên bản Intel (9 giờ).

*Khởi động tức thì*: Nhờ thừa hưởng công nghệ smartphone, ARM cho phép máy tỉnh giấc chỉ trong 0,5 giây từ chế độ ngủ.

*Kết nối 5G tích hợp*: Modem được tích hợp sẵn giúp loại bỏ hoàn toàn nhu cầu sử dụng dongle.

Tuy nhiên, những thách thức vẫn còn tồn tại - các phần mềm doanh nghiệp cũ và driver chuyên dụng vẫn cần kiến trúc x86. "Chúng tôi đang hợp tác với hơn 150 nhà phát triển phần mềm để tạo ra các phiên bản native," CTO của Qualcomm chia sẻ. 

Các chuyên gia phân tích dự đoán ARM có thể chiếm tới 35% thị phần Windows vào năm 2026, đặc biệt trong lĩnh vực doanh nghiệp và giáo dục.`,
    image: "articles/article3.png",
    category: "Công nghệ",
    date: "1 tháng 11, 2024",
    createdAt: new Date()
  },
];

// Function to seed news data
export const seedNewsData = async () => {
  try {
    const newsCollectionRef = collection(db, "news");
    
    for (const item of newsItems) {
      await addDoc(newsCollectionRef, {
        ...item,
        createdAt: Timestamp.fromDate(item.createdAt)
      });
    }
    
    console.log("News data successfully seeded to Firestore!");
    return true;
  } catch (error) {
    console.error("Error seeding news data: ", error);
    return false;
  }
};

// Function to seed articles data
export const seedArticlesData = async () => {
  try {
    const articlesCollectionRef = collection(db, "articles");
    
    for (const article of articles) {
      await addDoc(articlesCollectionRef, {
        ...article,
        createdAt: Timestamp.fromDate(article.createdAt)
      });
    }
    
    console.log("Articles data successfully seeded to Firestore!");
    return true;
  } catch (error) {
    console.error("Error seeding articles data: ", error);
    return false;
  }
};

// Function to seed all data
export const seedAllData = async () => {
  const newsResult = await seedNewsData();
  const articlesResult = await seedArticlesData();
  const laptopsResult = await seedLaptopData();
  
  if (newsResult && articlesResult && laptopsResult) {
    console.log("All data seeded successfully!");
    return true;
  } else {
    console.error("There was a problem seeding the data.");
    return false;
  }
};