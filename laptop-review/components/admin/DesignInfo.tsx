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

interface DesignInfoProps {
  formData: any
  onChange: (section: string, field: string, value: any) => void
  fieldErrors: Record<string, boolean>
  showValidation: boolean
}

export default function DesignInfo({ 
  formData,
  onChange,
  fieldErrors,
  showValidation
}: DesignInfoProps) {
  const { case: caseInfo, input } = formData.detailedSpecs
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông Tin Thiết Kế</CardTitle>
        <CardDescription>Nhập thông tin chi tiết về thiết kế, kích thước và vật liệu</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Case Information */}
        <div>
          <h3 className="text-lg font-medium mb-4">Thông Tin Vỏ Máy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="case-weight">Trọng Lượng</Label>
              <Input
                id="case-weight"
                placeholder="1.55 kg (3.42 lbs)"
                value={caseInfo.weight}
                onChange={(e) => onChange("detailedSpecs.case", "weight", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="case-dimensions">Kích Thước</Label>
              <Input
                id="case-dimensions"
                placeholder="312.6 x 221.2 x 15.5 mm"
                value={caseInfo.dimensions}
                onChange={(e) => onChange("detailedSpecs.case", "dimensions", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="grid gap-2">
              <Label htmlFor="case-material">Vật Liệu</Label>
              <Input
                id="case-material"
                placeholder="Aluminum"
                value={caseInfo.material}
                onChange={(e) => onChange("detailedSpecs.case", "material", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="case-color">Màu Sắc</Label>
              <Input
                id="case-color"
                placeholder="Space Black"
                value={caseInfo.color}
                onChange={(e) => onChange("detailedSpecs.case", "color", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="grid gap-2">
              <Label htmlFor="case-screen-ratio">Tỷ Lệ Màn Hình-Thân Máy</Label>
              <Input
                id="case-screen-ratio"
                placeholder="92%"
                value={caseInfo.screenToBodyRatio}
                onChange={(e) => onChange("detailedSpecs.case", "screenToBodyRatio", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="case-max-angle">Góc Mở Tối Đa</Label>
              <Input
                id="case-max-angle"
                placeholder="135°"
                value={caseInfo.maxOpenAngle}
                onChange={(e) => onChange("detailedSpecs.case", "maxOpenAngle", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="grid gap-2">
              <Label htmlFor="case-cooling">Hệ Thống Làm Mát</Label>
              <Input
                id="case-cooling"
                placeholder="Active cooling with fan"
                value={caseInfo.cooling}
                onChange={(e) => onChange("detailedSpecs.case", "cooling", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="case-noise">Mức Độ Ồn</Label>
              <Input
                id="case-noise"
                placeholder="30dB under load"
                value={caseInfo.noiseLevel}
                onChange={(e) => onChange("detailedSpecs.case", "noiseLevel", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Input Devices */}
        <div className="pt-3">
          <h3 className="text-lg font-medium mb-4">Bàn Phím & Bàn Di Chuột</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="input-keyboard">Bàn Phím</Label>
              <Input
                id="input-keyboard"
                placeholder="Magic Keyboard with backlight"
                value={input.keyboard}
                onChange={(e) => onChange("detailedSpecs.input", "keyboard", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="input-key-travel">Hành Trình Phím</Label>
              <Input
                id="input-key-travel"
                placeholder="1mm"
                value={input.keyTravel}
                onChange={(e) => onChange("detailedSpecs.input", "keyTravel", e.target.value)}
              />
            </div>
          </div>

          <div className="pt-3">
            <h4 className="font-medium mb-3">Bàn Di Chuột</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="input-touchpad-size">Kích Thước</Label>
                <Input
                  id="input-touchpad-size"
                  placeholder="155 x 95 mm"
                  value={input.touchpad?.size || ""}
                  onChange={(e) => onChange("detailedSpecs.input.touchpad", "size", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="input-touchpad-surface">Bề Mặt</Label>
                <Input
                  id="input-touchpad-surface"
                  placeholder="Glass"
                  value={input.touchpad?.surface || ""}
                  onChange={(e) => onChange("detailedSpecs.input.touchpad", "surface", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description for design and keyboard/touchpad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
          <div className="grid gap-2">
            <Label htmlFor="design-description">Mô Tả Thiết Kế</Label>
            <textarea
              id="design-description"
              className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Mô tả chi tiết về thiết kế và vật liệu của laptop..."
              value={formData.descriptions.design}
              onChange={(e) => onChange("descriptions", "design", e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="keyboard-description">Mô Tả Bàn Phím</Label>
              <textarea
                id="keyboard-description"
                className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Mô tả chi tiết về trải nghiệm sử dụng bàn phím..."
                value={formData.descriptions.keyboard}
                onChange={(e) => onChange("descriptions", "keyboard", e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="trackpad-description">Mô Tả Bàn Di Chuột</Label>
              <textarea
                id="trackpad-description"
                className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Mô tả chi tiết về trải nghiệm sử dụng bàn di chuột..."
                value={formData.descriptions.trackpad}
                onChange={(e) => onChange("descriptions", "trackpad", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 