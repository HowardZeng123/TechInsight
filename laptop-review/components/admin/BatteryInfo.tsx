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

interface BatteryInfoProps {
  formData: any
  onChange: (section: string, field: string, value: any) => void
  fieldErrors: Record<string, boolean>
  showValidation: boolean
}

export default function BatteryInfo({ 
  formData,
  onChange,
  fieldErrors,
  showValidation
}: BatteryInfoProps) {
  const { battery } = formData.detailedSpecs
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông Tin Pin</CardTitle>
        <CardDescription>Nhập thông tin chi tiết về pin và thời lượng sử dụng</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Battery Capacity */}
          <div className="grid gap-2">
            <Label htmlFor="battery-capacity">Dung Lượng Pin</Label>
            <Input
              id="battery-capacity"
              placeholder="70Wh"
              value={battery.capacity}
              onChange={(e) => onChange("detailedSpecs.battery", "capacity", e.target.value)}
            />
          </div>

          {/* Battery Type */}
          <div className="grid gap-2">
            <Label htmlFor="battery-type">Loại Pin</Label>
            <Input
              id="battery-type"
              placeholder="Lithium-polymer"
              value={battery.type}
              onChange={(e) => onChange("detailedSpecs.battery", "type", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Charge Time */}
          <div className="grid gap-2">
            <Label htmlFor="battery-charge-time">Thời Gian Sạc</Label>
            <Input
              id="battery-charge-time"
              placeholder="1.5 hours to full"
              value={battery.chargeTime}
              onChange={(e) => onChange("detailedSpecs.battery", "chargeTime", e.target.value)}
            />
          </div>

          {/* Charger Wattage */}
          <div className="grid gap-2">
            <Label htmlFor="battery-charger-wattage">Công Suất Sạc</Label>
            <Input
              id="battery-charger-wattage"
              placeholder="96W"
              value={battery.chargerWattage}
              onChange={(e) => onChange("detailedSpecs.battery", "chargerWattage", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Charger Weight */}
          <div className="grid gap-2">
            <Label htmlFor="battery-charger-weight">Trọng Lượng Sạc</Label>
            <Input
              id="battery-charger-weight"
              placeholder="280g"
              value={battery.chargerWeight}
              onChange={(e) => onChange("detailedSpecs.battery", "chargerWeight", e.target.value)}
            />
          </div>
        </div>

        {/* Battery Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="battery-replaceable"
              checked={battery.replaceable}
              onCheckedChange={(checked) => onChange("detailedSpecs.battery", "replaceable", checked)}
            />
            <Label htmlFor="battery-replaceable">Pin Có Thể Thay Thế</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="battery-fast-charging"
              checked={battery.fastCharging}
              onCheckedChange={(checked) => onChange("detailedSpecs.battery", "fastCharging", checked)}
            />
            <Label htmlFor="battery-fast-charging">Hỗ Trợ Sạc Nhanh</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="battery-usb-pd"
              checked={battery.usbPD}
              onCheckedChange={(checked) => onChange("detailedSpecs.battery", "usbPD", checked)}
            />
            <Label htmlFor="battery-usb-pd">Hỗ Trợ USB Power Delivery</Label>
          </div>
        </div>

        {/* Battery Life */}
        <div className="space-y-2 pt-4">
          <h3 className="font-medium">Thời Lượng Pin</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="battery-life-casual">Sử Dụng Thông Thường</Label>
              <Input
                id="battery-life-casual"
                placeholder="12.5 hours"
                value={formData.benchmarks.batteryLifeCasual}
                onChange={(e) => onChange("benchmarks", "batteryLifeCasual", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="battery-life-video">Xem Video</Label>
              <Input
                id="battery-life-video"
                placeholder="18 hours"
                value={formData.benchmarks.batteryLifeVideo}
                onChange={(e) => onChange("benchmarks", "batteryLifeVideo", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="battery-life-heavy">Sử Dụng Nặng</Label>
              <Input
                id="battery-life-heavy"
                placeholder="3.8 hours"
                value={formData.benchmarks.batteryLifeHeavy}
                onChange={(e) => onChange("benchmarks", "batteryLifeHeavy", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Description for battery */}
        <div className="grid gap-2 pt-2">
          <Label htmlFor="battery-description">Mô Tả Pin</Label>
          <textarea
            id="battery-description"
            className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Mô tả chi tiết về pin và thời lượng sử dụng..."
            value={formData.descriptions.battery}
            onChange={(e) => onChange("descriptions", "battery", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
} 