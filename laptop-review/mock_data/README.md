
# Hướng dẫn chi tiết cách thêm laptop mới vào Firestore sử dụng file mock_data/data.ts

Dưới đây là hướng dẫn từng bước để thêm laptop mới vào Firestore bằng cách cập nhật file `mock_data/data.ts` và chạy script `seedFirestore.mjs` có sẵn trong dự án:

## Bước 1: Tìm vị trí để thêm laptop mới vào file data.ts

1. Mở file `mock_data/data.ts` (đối với data của laptop)
2. Tìm đến phần cuối của mảng `laptops` (trước dấu ngoặc đóng `]`)

## Bước 2: Thêm dữ liệu laptop mới

Sao chép mẫu dưới đây và điều chỉnh các thông tin theo laptop bạn muốn thêm:

```javascript
{
  id: "ten-laptop-viet-lien-khong-dau",  // Chuỗi định danh, viết thường, không dấu, cách nhau bằng dấu gạch ngang
  name: "Tên Laptop Của Bạn",            // Tên đầy đủ của laptop
  image: "/placeholder.svg?height=600&width=600",  // Đường dẫn hình ảnh
  price: "22.990.000₫",                  // Giá bán hiện tại
  originalPrice: "24.990.000₫",          // Giá gốc (nếu có giảm giá)
  specs: {
    cpu: "Intel Core i7-1255U",          // Thông tin CPU
    gpu: "NVIDIA GeForce RTX 3050 4GB",  // Thông tin GPU
    ram: "16GB DDR5 4800MHz",            // Thông tin RAM
    storage: "512GB PCIe NVMe SSD",      // Thông tin lưu trữ
    display: '15.6" FHD IPS Anti-Glare 144Hz', // Thông tin màn hình
    battery: "70Wh, Up to 8 hours"       // Thông tin pin
  },
  benchmarks: {
    gaming: 7.5,                         // Điểm đánh giá game (0-10)
    productivity: 8.5,                   // Điểm đánh giá năng suất
    content: 8.0,                        // Điểm đánh giá tạo nội dung
    battery: 7.0,                        // Điểm đánh giá pin
    display: 8.5,                        // Điểm đánh giá màn hình
    build: 8.0,                          // Điểm đánh giá chất lượng hoàn thiện
    value: 8.0,                          // Điểm đánh giá giá trị
    overall: 8.0,                        // Điểm đánh giá tổng thể
  },
  detailedSpecs: {
    case: {
      weight: "1.8 kg (3.96 lbs)",
      dimensions: "359 x 256 x 22.8 mm",
      screenToBodyRatio: "85%",
      material: "Aluminum (nắp và bàn phím), Plastic (đế)",
      color: "Đen",
      maxOpenAngle: "150°",
      cooling: "Quạt kép, 2 ống dẫn nhiệt",
      noiseLevel: "40dB dưới tải nặng",
    },
    display: {
      size: '15.6"',
      type: "IPS",
      refreshRate: "144Hz",
      resolution: "1920 x 1080",
      aspectRatio: "16:9",
      ppi: "141",
      brightness: "300 nits",
      colorGamut: {
        sRGB: "98%",
        adobeRGB: "75%",
        dciP3: "85%",
      },
      responseTime: "4ms",
      touchscreen: false,
      hdr: false,
    },
    battery: {
      capacity: "70Wh",
      chargeTime: "2 giờ để sạc đầy",
      type: "Lithium-ion",
      replaceable: false,
      fastCharging: true,
      usbPD: true,
      chargerWattage: "120W",
      chargerWeight: "350g",
    },
    cpu: {
      name: "Intel Core i7-1255U",
      baseFrequency: "1.7 GHz",
      turboFrequency: "4.7 GHz",
      cores: 10,
      threads: 12,
      cache: "12MB",
      integratedGPU: "Intel Iris Xe Graphics",
      process: "10nm SuperFin",
      benchmarks: {
        geekbench6Single: 2380,
        geekbench6Multi: 11200,
        cinebenchR23Single: 1750,
        cinebenchR23Multi: 10800,
      },
    },
    gpu: {
      name: "NVIDIA GeForce RTX 3050",
      tgp: "75W",
      type: "Dedicated",
      process: "8nm",
      baseFrequency: "1057 MHz",
      boostFrequency: "1740 MHz",
      memory: "4GB GDDR6",
      memoryBus: "128-bit",
      memorySpeed: "14 Gbps",
      optimus: true,
      benchmarks: {
        wildlifeExtreme: 6800,
      },
    },
    ram: {
      capacity: "16GB",
      type: "DDR5",
      speed: "4800MHz",
      channels: 2,
      upgradeable: true,
      maxCapacity: "32GB",
      slots: 2,
    },
    storage: {
      capacity: "512GB",
      type: "NVMe SSD",
      interface: "PCIe 4.0 x4",
      upgradeable: true,
      slots: 2,
    },
    sound: {
      speakers: "Loa stereo 2W x 2",
      dolbyAtmos: true,
      microphones: "Hai micro kép",
    },
    connectivity: {
      wifi: "Wi-Fi 6E (802.11ax)",
      bluetooth: "5.2",
      webcam: "FHD 1080p với khẩu độ f/2.0",
      ports: {
        usba: 2,
        usbc: 2,
        thunderbolt: 1,
        hdmi: "1x HDMI 2.1",
        sdCard: "Đầu đọc thẻ SD",
        audio: "Jack tai nghe 3.5mm",
        ethernet: "Gigabit Ethernet",
      },
      fingerprint: true,
      irCamera: false,
    },
    input: {
      keyboard: "Bàn phím có đèn nền RGB",
      numpad: false,
      keyTravel: "1.5mm",
      touchpad: {
        size: "125 x 80 mm",
        surface: "Kính",
        precision: true,
      },
    },
  },
  pros: [
    "Hiệu năng tốt cho công việc và chơi game",
    "Màn hình 144Hz mượt mà",
    "Cổng kết nối đa dạng",
    "Bàn phím thoải mái khi gõ",
  ],
  cons: [
    "Thời lượng pin trung bình",
    "Hơi nặng để mang đi thường xuyên",
    "Loa chỉ ở mức trung bình",
    "Nhiệt độ tăng cao khi chơi game",
  ],
},
```

## Bước 3: Điều chỉnh dữ liệu

1. **ID của laptop**: Đặt ID thân thiện, ví dụ: "asus-vivobook-15-k513ea", "dell-g15-5515"
2. **Name**: Tên đầy đủ của laptop
3. **Price & originalPrice**: Giá hiện tại và giá gốc (nếu có khuyến mãi)
4. **Thông số kỹ thuật**: Điền thông tin chi tiết vào các trường tương ứng
5. **Benchmark**: Đánh giá điểm theo thang 0-10 cho các khía cạnh

Điều quan trọng: 
- **ID phải duy nhất**: Không được trùng với ID của laptop khác
- **ID phải thân thiện với URL**: Sử dụng dấu gạch ngang giữa các từ, không chứa ký tự đặc biệt

## Bước 4: Đặt laptop mới vào mảng

1. Thêm dữ liệu laptop mới vào mảng `laptops` trong file `mock_data/data.ts`
2. Đảm bảo có dấu phẩy sau mỗi đối tượng laptop (trừ laptop cuối cùng)
3. Đảm bảo cú pháp chính xác (dấu ngoặc, dấu phẩy, v.v.)

Ví dụ:

```javascript
export const laptops = [
  // Các laptop hiện có...
  
  // Laptop cuối cùng hiện tại
  {
    id: "acer-nitro-5",
    // ... dữ liệu laptop hiện tại
  },
  
  // Laptop mới của bạn
  {
    id: "laptop-moi-cua-ban",
    name: "Laptop Mới Của Bạn",
    // ... các thông tin khác
  }
]
```

## Bước 5: Lưu file

Sau khi đã thêm dữ liệu laptop mới và kiểm tra, lưu file `mock_data/data.ts`.

## Bước 6: Chạy script seedFirestore.mjs

1. Mở terminal/PowerShell tại thư mục gốc của dự án (laptop-review)
2. Chạy lệnh sau để đưa dữ liệu lên Firestore:

```
node seedFirestore.mjs
```

Nếu bạn sử dụng PowerShell trong Windows, sử dụng:

```powershell
cd laptop-review
node seedFirestore.mjs
```

## Bước 7: Kiểm tra kết quả

1. Kiểm tra trên Firebase console để đảm bảo dữ liệu đã được thêm vào
2. Kiểm tra trang web của bạn với URL chứa ID thân thiện:
   - `http://localhost:3000/laptops/laptop-moi-cua-ban`

## Lưu ý quan trọng

1. Script `seedFirestore.mjs` sẽ thêm tất cả laptop trong mảng vào Firestore. Nếu bạn chạy nhiều lần, sẽ có nhiều bản sao của cùng một laptop.
2. Để tránh dữ liệu trùng lặp, bạn có thể:
   - Xóa dữ liệu hiện có trên Firestore trước khi chạy script
   - Hoặc tạo một script mới chỉ để thêm một laptop cụ thể

## Ví dụ hoàn chỉnh

Giả sử bạn muốn thêm một laptop mới là "HP Envy x360 13":

```javascript
{
  id: "hp-envy-x360-13",
  name: "HP Envy x360 13 (2024)",
  image: "/placeholder.svg?height=600&width=600",
  price: "25.990.000₫",
  originalPrice: "27.990.000₫",
  specs: {
    cpu: "AMD Ryzen 7 8840U",
    gpu: "AMD Radeon Graphics",
    ram: "16GB LPDDR5 6400MHz",
    storage: "1TB PCIe NVMe SSD",
    display: '13.3" OLED, 2.8K (2880 x 1800), 90Hz',
    battery: "66Wh, Up to 15 hours",
  },
  benchmarks: {
    gaming: 6.0,
    productivity: 9.0,
    content: 8.5,
    battery: 9.2,
    display: 9.5,
    build: 9.0,
    value: 8.5,
    overall: 8.8,
  },
  detailedSpecs: {
    // ... thêm thông số chi tiết nếu cần
  },
  pros: [
    "Màn hình OLED 2.8K sắc nét",
    "Thời lượng pin xuất sắc",
    "Hiệu năng mạnh mẽ với chip AMD series 8000",
    "Thiết kế 2-trong-1 linh hoạt"
  ],
  cons: [
    "Giá hơi cao",
    "Hiệu năng đồ họa 3D giới hạn",
    "Không có đầu đọc thẻ SD",
    "Webcam chỉ HD chứ không phải Full HD"
  ],
},
```

Sau khi thêm vào `mock_data/data.ts`, chạy:

```
node seedFirestore.mjs
```

Khi hoàn tất, bạn có thể truy cập laptop mới tại:
`http://localhost:3000/laptops/hp-envy-x360-13`

