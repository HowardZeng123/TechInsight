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
import { Switch } from "@/components/ui/switch"

interface DisplayInfoProps {
  formData: any
  onChange: (section: string, field: string, value: any) => void
  fieldErrors: Record<string, boolean>
  showValidation: boolean
}

export default function DisplayInfo({ 
  formData,
  onChange,
  fieldErrors,
  showValidation
}: DisplayInfoProps) {
  const { display } = formData.detailedSpecs
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông Tin Màn Hình</CardTitle>
        <CardDescription>Nhập thông tin chi tiết về màn hình laptop</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Size Field */}
          <div className="grid gap-2">
            <Label htmlFor="display-size">Kích Thước</Label>
            <Input
              id="display-size"
              placeholder='14.2"'
              value={display.size}
              onChange={(e) => onChange("detailedSpecs.display", "size", e.target.value)}
            />
          </div>

          {/* Type Field */}
          <div className="grid gap-2">
            <Label htmlFor="display-type">Loại Màn Hình</Label>
            <Input
              id="display-type"
              placeholder="Mini-LED"
              value={display.type}
              onChange={(e) => onChange("detailedSpecs.display", "type", e.target.value)}
            />
          </div>

          {/* Refresh Rate Field */}
          <div className="grid gap-2">
            <Label htmlFor="display-refresh">Tần Số Quét</Label>
            <Input
              id="display-refresh"
              placeholder="120Hz"
              value={display.refreshRate}
              onChange={(e) => onChange("detailedSpecs.display", "refreshRate", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Resolution Field */}
          <div className="grid gap-2">
            <Label htmlFor="display-resolution">Độ Phân Giải</Label>
            <Input
              id="display-resolution"
              placeholder="3024 x 1964"
              value={display.resolution}
              onChange={(e) => onChange("detailedSpecs.display", "resolution", e.target.value)}
            />
          </div>

          {/* Aspect Ratio Field */}
          <div className="grid gap-2">
            <Label htmlFor="display-aspect">Tỷ Lệ Khung Hình</Label>
            <Input
              id="display-aspect"
              placeholder="16:10"
              value={display.aspectRatio}
              onChange={(e) => onChange("detailedSpecs.display", "aspectRatio", e.target.value)}
            />
          </div>

          {/* PPI Field */}
          <div className="grid gap-2">
            <Label htmlFor="display-ppi">PPI</Label>
            <Input
              id="display-ppi"
              placeholder="254"
              value={display.ppi}
              onChange={(e) => onChange("detailedSpecs.display", "ppi", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Brightness Field */}
          <div className="grid gap-2">
            <Label htmlFor="display-brightness">Độ Sáng</Label>
            <Input
              id="display-brightness"
              placeholder="1600 nits peak, 1000 nits sustained"
              value={display.brightness}
              onChange={(e) => onChange("detailedSpecs.display", "brightness", e.target.value)}
            />
          </div>

          {/* Response Time Field */}
          <div className="grid gap-2">
            <Label htmlFor="display-response">Thời Gian Phản Hồi</Label>
            <Input
              id="display-response"
              placeholder="1ms"
              value={display.responseTime}
              onChange={(e) => onChange("detailedSpecs.display", "responseTime", e.target.value)}
            />
          </div>
        </div>

        {/* Color Gamut */}
        <div className="space-y-2 pt-2">
          <h3 className="font-medium">Dải Màu</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="display-srgb">sRGB</Label>
              <Input
                id="display-srgb"
                placeholder="100%"
                value={display.colorGamut.sRGB}
                onChange={(e) => onChange("detailedSpecs.display.colorGamut", "sRGB", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display-adobe">Adobe RGB</Label>
              <Input
                id="display-adobe"
                placeholder="100%"
                value={display.colorGamut.adobeRGB}
                onChange={(e) => onChange("detailedSpecs.display.colorGamut", "adobeRGB", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="display-p3">DCI-P3</Label>
              <Input
                id="display-p3"
                placeholder="100%"
                value={display.colorGamut.dciP3}
                onChange={(e) => onChange("detailedSpecs.display.colorGamut", "dciP3", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Switches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="display-touch"
              checked={display.touchscreen}
              onCheckedChange={(checked) => onChange("detailedSpecs.display", "touchscreen", checked)}
            />
            <Label htmlFor="display-touch">Màn Hình Cảm Ứng</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="display-hdr"
              checked={display.hdr}
              onCheckedChange={(checked) => onChange("detailedSpecs.display", "hdr", checked)}
            />
            <Label htmlFor="display-hdr">Hỗ Trợ HDR</Label>
          </div>
        </div>

        {/* Description for display */}
        <div className="grid gap-2 pt-2">
          <Label htmlFor="display-description">Mô Tả Màn Hình</Label>
          <textarea
            id="display-description"
            className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Mô tả chi tiết về màn hình của laptop..."
            value={formData.descriptions.display}
            onChange={(e) => onChange("descriptions", "display", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
} 