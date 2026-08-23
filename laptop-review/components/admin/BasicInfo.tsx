"use client"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BasicInfoProps {
  formData: any
  onChange: (section: string, field: string, value: string) => void
  fieldErrors: Record<string, boolean>
  showValidation: boolean
}

export default function BasicInfo({ 
  formData,
  onChange,
  fieldErrors,
  showValidation
}: BasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông Tin Cơ Bản</CardTitle>
        <CardDescription>Nhập thông tin cơ bản về laptop</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ID Field */}
        <div className="grid gap-2">
          <Label htmlFor="laptop-id" className="flex items-center">
            ID Laptop
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="laptop-id"
            placeholder="macbook-pro-14-m3-pro"
            value={formData.id}
            onChange={(e) => onChange("root", "id", e.target.value)}
            className={fieldErrors["id"] && showValidation ? "border-red-500" : ""}
          />
          {fieldErrors["id"] && showValidation && (
            <p className="text-sm text-red-500">ID là bắt buộc</p>
          )}
          <p className="text-sm text-muted-foreground">
            ID duy nhất để định danh laptop (chỉ dùng chữ thường, số và dấu gạch ngang)
          </p>
        </div>

        {/* Name Field */}
        <div className="grid gap-2">
          <Label htmlFor="laptop-name" className="flex items-center">
            Tên Laptop
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="laptop-name"
            placeholder="MacBook Pro 14-inch (M3 Pro)"
            value={formData.name}
            onChange={(e) => onChange("root", "name", e.target.value)}
            className={fieldErrors["name"] && showValidation ? "border-red-500" : ""}
          />
          {fieldErrors["name"] && showValidation && (
            <p className="text-sm text-red-500">Tên laptop là bắt buộc</p>
          )}
        </div>

        {/* Price Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="price" className="flex items-center">
              Giá Hiện Tại
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="price"
              placeholder="1.999.000₫"
              value={formData.price}
              onChange={(e) => onChange("root", "price", e.target.value)}
              className={fieldErrors["price"] && showValidation ? "border-red-500" : ""}
            />
            {fieldErrors["price"] && showValidation && (
              <p className="text-sm text-red-500">Giá laptop là bắt buộc</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="original-price">Giá Gốc</Label>
            <Input
              id="original-price"
              placeholder="2.499.000₫"
              value={formData.originalPrice}
              onChange={(e) => onChange("root", "originalPrice", e.target.value)}
            />
          </div>
        </div>

        {/* Purchase Link */}
        <div className="grid gap-2">
          <Label htmlFor="purchase-link">Liên Kết Mua Hàng</Label>
          <Input
            id="purchase-link"
            placeholder="https://example.com/buy-laptop"
            value={formData.purchaseLink}
            onChange={(e) => onChange("root", "purchaseLink", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Liên kết để người dùng có thể mua laptop này
          </p>
        </div>

        {/* Image URL */}
        <div className="grid gap-2">
          <Label htmlFor="image-url">URL Hình Ảnh</Label>
          <Input
            id="image-url"
            placeholder="/placeholder.svg?height=600&width=600"
            value={formData.image}
            onChange={(e) => onChange("root", "image", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            URL hình ảnh đại diện cho laptop
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 