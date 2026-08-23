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

interface SpecificationsProps {
  formData: any
  onChange: (section: string, field: string, value: string) => void
  fieldErrors: Record<string, boolean>
  showValidation: boolean
}

export default function Specifications({ 
  formData,
  onChange,
  fieldErrors,
  showValidation
}: SpecificationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông Số Kỹ Thuật</CardTitle>
        <CardDescription>Nhập thông số kỹ thuật cơ bản của laptop</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CPU Field */}
          <div className="grid gap-2">
            <Label htmlFor="cpu" className="flex items-center">
              CPU
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="cpu"
              placeholder="Apple M3 Pro (12-core CPU)"
              value={formData.specs.cpu}
              onChange={(e) => onChange("specs", "cpu", e.target.value)}
              className={fieldErrors["specs.cpu"] && showValidation ? "border-red-500" : ""}
            />
            {fieldErrors["specs.cpu"] && showValidation && (
              <p className="text-sm text-red-500">CPU là bắt buộc</p>
            )}
          </div>

          {/* GPU Field */}
          <div className="grid gap-2">
            <Label htmlFor="gpu" className="flex items-center">
              GPU
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="gpu"
              placeholder="16-core GPU"
              value={formData.specs.gpu}
              onChange={(e) => onChange("specs", "gpu", e.target.value)}
              className={fieldErrors["specs.gpu"] && showValidation ? "border-red-500" : ""}
            />
            {fieldErrors["specs.gpu"] && showValidation && (
              <p className="text-sm text-red-500">GPU là bắt buộc</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* RAM Field */}
          <div className="grid gap-2">
            <Label htmlFor="ram" className="flex items-center">
              RAM
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="ram"
              placeholder="18GB Unified Memory"
              value={formData.specs.ram}
              onChange={(e) => onChange("specs", "ram", e.target.value)}
              className={fieldErrors["specs.ram"] && showValidation ? "border-red-500" : ""}
            />
            {fieldErrors["specs.ram"] && showValidation && (
              <p className="text-sm text-red-500">RAM là bắt buộc</p>
            )}
          </div>

          {/* Storage Field */}
          <div className="grid gap-2">
            <Label htmlFor="storage" className="flex items-center">
              Lưu Trữ
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="storage"
              placeholder="512GB SSD"
              value={formData.specs.storage}
              onChange={(e) => onChange("specs", "storage", e.target.value)}
              className={fieldErrors["specs.storage"] && showValidation ? "border-red-500" : ""}
            />
            {fieldErrors["specs.storage"] && showValidation && (
              <p className="text-sm text-red-500">Lưu trữ là bắt buộc</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Display Field */}
          <div className="grid gap-2">
            <Label htmlFor="display" className="flex items-center">
              Màn Hình
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="display"
              placeholder='14.2" Liquid Retina XDR, 120Hz ProMotion'
              value={formData.specs.display}
              onChange={(e) => onChange("specs", "display", e.target.value)}
              className={fieldErrors["specs.display"] && showValidation ? "border-red-500" : ""}
            />
            {fieldErrors["specs.display"] && showValidation && (
              <p className="text-sm text-red-500">Thông tin màn hình là bắt buộc</p>
            )}
          </div>

          {/* Battery Field */}
          <div className="grid gap-2">
            <Label htmlFor="battery" className="flex items-center">
              Pin
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="battery"
              placeholder="70Wh, Up to a 18 hours"
              value={formData.specs.battery}
              onChange={(e) => onChange("specs", "battery", e.target.value)}
              className={fieldErrors["specs.battery"] && showValidation ? "border-red-500" : ""}
            />
            {fieldErrors["specs.battery"] && showValidation && (
              <p className="text-sm text-red-500">Thông tin pin là bắt buộc</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 