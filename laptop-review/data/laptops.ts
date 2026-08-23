import { laptops } from "@/mock_data/data";

// Transform the laptops from mock_data/data.ts to match the expected format
export const laptopData = laptops.map((laptop, index) => {
  // Extract price values and handle commas and currency symbols
  const salePrice = parseInt(laptop.price.replace(/[^0-9]/g, ""));
  const originalPrice = laptop.originalPrice ? laptop.originalPrice.replace(/[^0-9]/g, "") : null;
  const saveAmount = originalPrice && salePrice ? (parseInt(originalPrice) - salePrice).toString() : null;
  
  // Create specs string that matches the format in the UI
  const specs = `${laptop.specs.cpu}, ${laptop.specs.ram}, ${laptop.specs.storage}`;
  
  return {
    id: laptop.id || (index + 1),
    name: laptop.name,
    specs: specs,
    rating: 4.5, // Default rating
    reviews: 120, // Default reviews count
    salePrice: salePrice,
    originalPrice: originalPrice,
    saveAmount: saveAmount,
    onSale: originalPrice ? true : false,
    greatDeal: true,
    image: laptop.image || "/placeholder.svg?height=600&width=600",
    detailLink: `/laptops/${laptop.id}`,
    // purchaseLink: laptop.purchaseLink || `/laptops/${laptop.id}` // Loại bỏ hoặc comment dòng này
  };
});

export type Laptop = {
  id: number | string;
  name: string;
  specs: string;
  rating: number;
  reviews: number;
  salePrice: number;
  originalPrice: string | null;
  saveAmount: string | null;
  onSale: boolean;
  greatDeal: boolean;
  image?: string;
  detailLink: string;
  purchaseLink?: string; // Đã là tùy chọn, giữ nguyên
};